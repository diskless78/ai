# -*- coding: utf-8 -*-
"""import necessary lib"""
import datetime
from http import HTTPStatus
import socket

from common.error_message import ErrorMessageEnum
from config import config
from database import db
from flask import jsonify, request
from flask.globals import current_app
from sentry_sdk import capture_exception, capture_message, init
from sentry_sdk.integrations.flask import FlaskIntegration
from utilities import utilities
from utilities.time_utils import is_weekend

from people_counting.service.box_service import get_list_box
from people_counting.validation.date_time_validation import \
    validate_input_datetime

init(
    dsn=str(config.CLIENT_KEYS),
    integrations=[FlaskIntegration()],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0,
    auto_enabling_integrations=False
    # By default the SDK will try to use the SENTRY_RELEASE
    # environment variable, or infer a git commit
    # SHA as release, however you may want to set
    # something more human-readable.
    # release="myapp@1.0.0",
)

# Local ip
IP = socket.gethostbyname(socket.gethostname())
# Timestamp
ASCTIME = datetime.datetime.now()

# list hours
LIST_HOURS = utilities.lst_hours(6, 23)

# list previous type
lst_previous_type = ["yesterday", "lastWeek", "last14Days", "lastMonth"]


def get_list_group(group_id, user_id):
    """
        :param group_id:
        :param user_id:
        :return: {list}
    """
    try:
        if group_id is not None and group_id != "":
            return group_id.split(",")
        find_group = db.find_all(str(config.group), {"userid": user_id})
        return [group_id["id"] for group_id in find_group]
    except BaseException as err:
        capture_exception(err)


def validate_previous_type(type_previous):
    """
        :param type_previous:
        :return: {bool}
    """
    return type_previous in lst_previous_type


def transform_timestamp_to_find_previous(start, end, previous_type):
    """
        :param start:
        :param end:
        :param previous_type:
        :return: {int}, {int}
    """
    if previous_type == "yesterday":
        return {"start": int(start) - 86399, "end": int(start)}
    elif previous_type == "lastWeek":
        return {"start": int(start) - 7 * 86400, "end": int(start)}
    elif previous_type == "last14Days":
        return {"start": int(start) - 14 * 86399, "end": int(start)}
    else:
        return {"start": int(start) - 30 * 86399, "end": int(start)}


def get_day_number_in_week(date_start):
    """
        :param date_start:
        :return:
    """
    timestamp_to_date = utilities.convert_timestamp_to_date(int(date_start))
    return datetime.datetime.strptime(
        timestamp_to_date, "%Y-%m-%d").weekday()


def get_list_zone_id(list_box_id, location):
    try:
        query = {
            "boxID": {"$in": list_box_id},
            "location": location
        }
        result = db.find_all(str(config.zone), query)
        return [zone_id["id"] for zone_id in result]
    except BaseException as err:
        capture_exception(err)


def count_amount_of_timestamp_by_list_zone(list_zone_id, date_start, date_end, location):
    """
        :param list_zone_id:
        :param date_start:
        :param date_end:
        :param location:
        :return:
    """
    try:
        query = {
            "data": {
                "$elemMatch": {
                    "zone_id": {"$in": list_zone_id},
                    "timestamp": {"$gte": int(date_start), "$lt": int(date_end)},
                    "location": location
                }
            }
        }
        current_app.logger.info("{location} ---------> {query}"
                                .format(location=location, query=query))
        result = db.find_all(str(config.peopleCountingHistory), query)
        list_people = []
        lst_hour = [i for i in range(7, 24)]
        for record in result:
            for data in record["data"]:
                if str(data["location"]) == str(location) and data["hour"] in lst_hour:
                    list_people.append(data)

        total_people_in_weekend = 0
        total_people_in_weekday = 0
        for people in list_people:
            if int(date_start) <= people["timestamp"] <= int(date_end):
                if is_weekend(people["timestamp"]):
                    total_people_in_weekend += 1
                else:
                    total_people_in_weekday += 1

        return total_people_in_weekend, total_people_in_weekday
    except BaseException as err:
        capture_exception(err)


def get_count_of_separated_weekend(date_start, date_end, date_start_previous,
                                   date_end_previous, list_box_id,
                                   zone_area):
    """
        :param date_start:
        :param date_end:
        :param date_start_previous:
        :param date_end_previous:
        :param list_box_id:
        :param zone_area:
        :return: {list}, {list}
    """
    try:

        data = []
        dataPrevious = []
        # get data now
        list_zone_id = get_list_zone_id(list_box_id, zone_area)
        total_people_weekend, total_people_weekday = count_amount_of_timestamp_by_list_zone(
            list_zone_id, date_start, date_end, zone_area)

        data.extend((total_people_weekday, total_people_weekend))

        total_people_previous_weekend, total_people_previous_weekday = count_amount_of_timestamp_by_list_zone(
            list_zone_id, date_start_previous, date_end_previous, zone_area)

        dataPrevious.extend((total_people_previous_weekday,
                            total_people_previous_weekend))
        return {"data": data, "dataPrevious": dataPrevious}
    except BaseException as err:
        capture_exception(err)


def response_count_separated_weekend(get_input_data,
                                     user_id,
                                     date_start,
                                     date_end_timestamp, type_previous):
    """
        :param get_input_data:
        :param user_id:
        :param date_start:
        :param date_end_timestamp:
        :param type_previous:
        :return: {dict}
    """
    try:
        list_group_id = get_list_group(get_input_data.get("groupID"), user_id)

        if not validate_input_datetime(date_start, date_end_timestamp):
            return jsonify({"message": str(ErrorMessageEnum.WRONG_INPUT_DATE_TIME)}), HTTPStatus.BAD_REQUEST

        list_box_id = get_list_box(list_group_id)

        if not list_box_id:
            return jsonify({"message": "Could not found box with user id: {user_id}".format(user_id=user_id)}), HTTPStatus.BAD_REQUEST

        if validate_previous_type(type_previous) is False:
            return jsonify({"message": "Type previous must in {list_pre}".format(list_pre=lst_previous_type)}), HTTPStatus.BAD_REQUEST

        get_datetime_previous = transform_timestamp_to_find_previous(
            date_start, date_end_timestamp, type_previous)
        date_start_previous, date_end_previous = get_datetime_previous[
            "start"], get_datetime_previous["end"]
        get_result_count_of_separated_weekend_gate = get_count_of_separated_weekend(date_start,
                                                                                    date_end_timestamp,
                                                                                    date_start_previous,
                                                                                    date_end_previous,
                                                                                    list_box_id, "gate")
        dataGate = get_result_count_of_separated_weekend_gate["data"]
        dataGatePrevious = get_result_count_of_separated_weekend_gate["dataPrevious"]

        get_result_count_of_separated_weekend_way = get_count_of_separated_weekend(date_start,
                                                                                   date_end_timestamp,
                                                                                   date_start_previous,
                                                                                   date_end_previous,
                                                                                   list_box_id, "way")
        dataWay = get_result_count_of_separated_weekend_way["data"]

        dataWayPrevious = get_result_count_of_separated_weekend_way["dataPrevious"]
        return {
            "dataGate": dataGate,
            "dataGatePrevious": dataGatePrevious,
            "dataWay": dataWay,
            "dataWayPrevious": dataWayPrevious
        }
    except BaseException as err:
        capture_exception(err)


def count_separated_weekend():
    """
        Receive data from url
        :return: {dict}
    """
    try:
        get_input_data = request.args
        date_start = get_input_data.get("dateStart")
        date_end = get_input_data.get("dateEnd")
        if date_start == "" or date_end == "":
            return jsonify({"message": "Datetime cannot be empty"}), HTTPStatus.BAD_REQUEST
        user_id = utilities.get_user_info(request.headers["authorization"])
        date_end_timestamp = int(date_end) + 86399
        type_previous = get_input_data.get("previousType")
        return response_count_separated_weekend(get_input_data,
                                                user_id,
                                                date_start,
                                                date_end_timestamp,
                                                type_previous)
    except BaseException as err:
        content_error_log = "{ip} -- [{asctime}] ''Error: ' - {err}".format(ip=IP, asctime=ASCTIME,
                                                                            err=str(err))
        capture_message(content_error_log)
        return str(err), HTTPStatus.NOT_FOUND
