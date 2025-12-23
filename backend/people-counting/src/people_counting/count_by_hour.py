# -*- coding: utf-8 -*
"""import necessary library, folder in project"""
import socket
from http import HTTPStatus

from common.error_message import ErrorMessageEnum
from config import config
from database import db
from flask import jsonify, request
from sentry_sdk import capture_exception, init
from sentry_sdk.integrations.flask import FlaskIntegration
from utilities import utilities

from people_counting.service.box_service import get_list_box
from people_counting.service.group_service import get_list_group
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

# list hours
LIST_HOURS = utilities.lst_hours(6, 23)


def response_count_by_hour(list_box_id, date_start, date_end):
    """
        :param list_box_id:
        :param date_start:
        :param date_end:
        :return: -> list
    """
    try:
        return _extracted_from_response_count_by_hour_4(
            list_box_id, date_end, date_start
        )
    except BaseException as err:
        capture_exception(err)
        utilities.push_notify_telegram(config.chat_id, str(err))
        return "false"


def _extracted_from_response_count_by_hour_4(list_box_id, date_end, date_start):
    # find zone with location == gate, boxID in list_box_id bellow
    find_list_zone = db.find_all(str(config.zone),
                                 {"boxID": {"$in": list_box_id}, "location": "gate"})
    list_zone_id = [zone["id"] for zone in find_list_zone]
    query = {
        "data": {
            "$elemMatch": {
                "zone_id": {"$in": list_zone_id},
                "timestamp": {"$lte": int(date_end), "$gt": int(date_start)},
                "location": "gate"
            }
        }
    }
    find_record = db.find_all(str(config.peopleCountingHistory), query)
    list_hour_customer_enter = []
    for item in find_record:
        for rec in item["data"]:
            if rec["location"] == "gate":
                list_hour_customer_enter.append(rec["hour"])

    # Count customers

    count_customer_by_hour = []
    for hour in range(7, 24):
        counter = 0
        for visted_hour in list_hour_customer_enter:
            if hour == visted_hour:
                counter += 1
        count_customer_by_hour.append(counter)

    if find_record:
        return {"data": count_customer_by_hour}

    value = [number - number for number in range(7, 24)]
    return {"data": value}


def count_by_hours():
    """
        :return: {dict}
    """
    try:
        data_input = request.args
        date_start = int(data_input.get('dateStart'))
        date_end = date_start + 86399
        if not validate_input_datetime(date_start, date_end):
            return jsonify({"message": str(ErrorMessageEnum.WRONG_INPUT_DATE_TIME)}), HTTPStatus.BAD_REQUEST
        user_id = utilities.get_user_info(request.headers["authorization"])
        # get list group
        list_group = get_list_group(data_input.get('groupID'), user_id)
        # get list box
        list_box_id = get_list_box(list_group)
        if not list_box_id:
            return jsonify({"message": "This group does not belong any box"}), HTTPStatus.OK
        return response_count_by_hour(list_box_id, date_start, date_end)
    except BaseException as err:
        capture_exception(err)
        return "false", HTTPStatus.BAD_REQUEST
