# -*- coding: utf-8 -*-

import datetime
import socket
from typing import Counter
from common.constant import DEFAULT_PERCENT

from common.error_message import ErrorMessageEnum
from config import config
from database import db
from flask import current_app, jsonify, request
from sentry_sdk import init
from sentry_sdk.integrations.flask import FlaskIntegration
from utilities import utilities
from utilities.time_utils import transform_timestamp_to_find_previous

import people_counting
from people_counting import count_by_hour
from people_counting.service.box_service import get_list_box
from people_counting.service.group_service import get_list_group
from people_counting.service.zone_service import get_list_zone_id
from people_counting.validation.date_time_validation import \
    validate_input_datetime
from people_counting.validation.previous_type_validation import (
    LIST_PREVIOUS_TYPE, validate_previous_type)

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
ip = socket.gethostbyname(socket.gethostname())
# Timestamp
asctime = datetime.datetime.now()


def count_amount_of_timestamp_by_list_zone(list_zone_id, date_start, date_end, location):
    query = {
        "data": {
            "$elemMatch": {
                "zone_id": {"$in": list_zone_id},
                "timestamp": {"$gte": int(date_start), "$lt": int(date_end)},
                "hour": {"$in": [i for i in range(7, 24)]},
                "location": location
            }
        }
    }
    result = db.find_all(str(config.peopleCountingHistory), query)
    output = []
    lst_hour = [i for i in range(7, 24)]
    for record in result:
        for data in record["data"]:
            if str(data["location"]) == str(location) and data["hour"] in lst_hour and int(date_start) <= int(data["timestamp"]) <= int(date_end):
                output.append(data)
    return len(output)


def count_amount_of_timestamp_by_list_shop_zone(list_zone_id, start, end):
    f"""
    Count data in zone with location == shop
        :parameter: {list_zone_id}, {start}, {end} 
        :return: {int}
    """
    query = {
        "data": {
            "$elemMatch": {
                "zone_id": {"$in": list_zone_id},
                "timestamp": {"$gte": int(start), "$lte": int(end)},
                "dwellTime": {"$gte": 15, "$lte": 120}
            }
        }
    }
    
    find_all_zone_shop = db.find_all(str(config.peopleCountingHistory), query)
    result = []
    for rec in find_all_zone_shop:
        for data in rec["data"]:
            if 15 <= int(data["dwellTime"]) <= 120 and data["location"] == "shop" and int(start) <= int(data["timestamp"]) <= int(end):
                result.append(data)
    return len(result)


def calculator_percentage(now, previous):
    f"""
    Calculator percentage
        :params: {now}, {previous}
        :returns: {bool}, {float}

    """
    if previous == 0:
        increase = True
        percentage = DEFAULT_PERCENT
        return {"percentage": percentage, "increase": increase}
    if now == 0:
        increase = False
        percentage = DEFAULT_PERCENT
        return {"percentage": percentage, "increase": increase}
    elif now < previous:
        increase = False
        percentage = ((previous - now) / previous) * 100
    else:
        increase = True
        percentage = ((now - previous) / previous) * 100
    return {"percentage": percentage, "increase": increase}


def static_people_by_status(date_start, date_end, date_start_previous, date_end_previous, list_box_id, is_new_customer):
    total = count_people_by_status(
        date_start, date_end, is_new_customer, list_box_id)
    totalPrevious = count_people_by_status(
        date_start_previous, date_end_previous, is_new_customer, list_box_id)

    get_percent_increase = calculator_percentage(total, totalPrevious)
    percentage, increase = get_percent_increase["percentage"], get_percent_increase["increase"]
    return {
        "total": total,
        "totalPrevious": totalPrevious,
        "percentage": percentage,
        "increase": increase,
    }


def count_people_by_status(date_start, date_end, is_new_customer, list_box_id):
    query = {
        "$and": [
            {
                "timestamp": {"$gte": int(date_start), "$lt": int(date_end)}
            },
            {
                "boxID": {"$in": list_box_id}
            },
            {
                "listRecord": {
                    "$elemMatch": {
                        "newCustomer": is_new_customer,
                    }
                }
            }
        ]
    }

    customer_record_result = db.find_all(str(config.customerRecord), query)

    count_people = 0
    for customer_record in customer_record_result:
        for record in customer_record["listRecord"]:
            if record["newCustomer"] == True:
                count_people += 1

    return count_people


def count_people_by_zone(date_start, date_end, date_start_previous, date_end_previous, list_box_id, zone_area):
    static = {}
    # find list zone id
    list_zone_id = get_list_zone_id(list_box_id, zone_area)
    if zone_area != "shop":
        total = count_amount_of_timestamp_by_list_zone(list_zone_id,
                                                       date_start, date_end, zone_area)
        totalPrevious = count_amount_of_timestamp_by_list_zone(list_zone_id,
                                                               date_start_previous, date_end_previous, zone_area)
    else:
        total = count_amount_of_timestamp_by_list_shop_zone(
            list_zone_id, date_start, date_end)
        totalPrevious = count_amount_of_timestamp_by_list_shop_zone(list_zone_id, date_start_previous,
                                                                    date_end_previous)
    get_percent_increase = calculator_percentage(total, totalPrevious)
    percentage, increase = get_percent_increase["percentage"], get_percent_increase["increase"]
    static.update({
        "total": total,
        "totalPrevious": totalPrevious,
        "percentage": percentage,
        "increase": increase,
    })
    return static


def static_people_in_rush_hour(date_start, date_end_timestamp, list_box_id):
    return count_people_by_period_of_time(date_start, date_end_timestamp, list_box_id)


def count_people_by_period_of_time(date_start, date_end, list_box_id):
    query = {
        "$and": [
            {
                "boxID": {"$in": list_box_id}
            },
            {
                "data": {
                    "$elemMatch": {
                        "timestamp": {"$lte": int(date_end), "$gt": int(date_start)},
                    }
                }
            }
        ]
    }

    people_counting_result = db.find_all(
        str(config.peopleCountingHistory), query)

    list_hour = []
    for history_record in people_counting_result:
        for people in history_record["data"]:
            list_hour.append(people["hour"])

    if (len(list_hour) > 0):
        count_customer_by_hour = Counter(list_hour)

        most_common_hour = count_customer_by_hour.most_common(1)

        return {
            "total": most_common_hour[0][1],
            "percentage": most_common_hour[0][0]
        }

    return {
        "total": 0,
        "percentage": 0
    }


def get_day_number_in_week(date_start):
    timestamp_to_date = utilities.convert_timestamp_to_date(int(date_start))
    return datetime.datetime.strptime(
        timestamp_to_date, "%Y-%m-%d").weekday()


def calculate_rate(first, second):
    f"""
    :param: {first}: 
    :param: {second} 
    :return: {float}  
    """
    # get first rate
    if second["total"] == 0:
        first_rate = DEFAULT_PERCENT
    else:
        first_rate = (first["total"] / second["total"]) * 100
    # get second rate
    if second["totalPrevious"] == 0:
        second_rate = 0.0
    else:
        second_rate = (first["totalPrevious"] / second["totalPrevious"]) * 100

    if second_rate == 0:
        increase = True
        percentage = DEFAULT_PERCENT
    elif first_rate == DEFAULT_PERCENT:
        increase = False
        percentage = DEFAULT_PERCENT
    elif second_rate == DEFAULT_PERCENT :
        increase = True
        percentage = 0
    elif first_rate < second_rate != 0:
        increase = False
        percentage = ((second_rate - first_rate) / second_rate) * 100
    else:
        increase = True
        percentage = ((first_rate - second_rate) / second_rate) * 100
    return {
        "total": first_rate,
        "totalPrevious": second_rate,
        "percentage": percentage,
        "increase": increase
    }


def list_response_list_static(date_start, date_end_timestamp, type_previous, list_box_id):
    get_datetime_previous = transform_timestamp_to_find_previous(
        date_start, date_end_timestamp, type_previous)
    date_start_previous, date_end_previous = get_datetime_previous[
        "start"], get_datetime_previous["end"]

    current_app.logger.info("Get from get_datetime_previous: {get_datetime_previous}"
                            .format(get_datetime_previous=get_datetime_previous))

    return get_static(date_start, date_end_timestamp, date_start_previous, date_end_previous, list_box_id)


def get_static(date_start, date_end_timestamp, date_start_previous, date_end_previous, list_box_id):
    gateStatic = count_people_by_zone(date_start, date_end_timestamp, date_start_previous,
                                      date_end_previous, list_box_id, "gate")
    wayStatic = count_people_by_zone(date_start, date_end_timestamp, date_start_previous,
                                     date_end_previous, list_box_id, "way")
    shopStatic = count_people_by_zone(date_start, date_end_timestamp, date_start_previous,
                                      date_end_previous, list_box_id, "shop")

    rate_1 = calculate_rate(gateStatic, wayStatic)
    rate_2 = calculate_rate(shopStatic, gateStatic)

    new_customer_static = static_people_by_status(date_start, date_end_timestamp,
                                                  date_start_previous, date_end_previous, list_box_id, True)

    old_customer_static = static_people_by_status(date_start, date_end_timestamp,
                                                  date_start_previous, date_end_previous, list_box_id, False)

    rush_hour_static = static_people_in_rush_hour(
        date_start, date_end_timestamp, list_box_id)

    return [gateStatic, wayStatic,
            rate_1, rate_2, shopStatic, new_customer_static,
            old_customer_static, rush_hour_static]


def list_static():
    """
        :return: {dict}
        """
    current_app.logger.info("Start get list static")
    get_input_data = request.args
    date_start = get_input_data.get("dateStart")
    date_end = get_input_data.get("dateEnd")
    if date_start == "" or date_end == "" or date_start == " " or date_end == " ":
        current_app.logger.error("Datetime cannot be empty")
        return jsonify({"message": "Datetime cannot be empty"}), 400

    user_id = utilities.get_user_info(request.headers["authorization"])

    date_end_timestamp = int(date_end) + 86399
    type_previous = get_input_data.get("previousType")

    list_group_id = get_list_group(get_input_data.get("groupID"), user_id)
    current_app.logger.info(
        "Get list group id: {list_group_id}".format(list_group_id=list_group_id))

    if not validate_input_datetime(date_start, date_end_timestamp):
        current_app.logger.error("Wrong date time: date_start={date_start}, date_end={date_end}"
                                 .format(date_start=date_start, date_end=date_end))

        return jsonify({"message": str(ErrorMessageEnum.WRONG_INPUT_DATE_TIME)}), 400

    list_box_id = get_list_box(list_group_id)
    current_app.logger.info(
        "Get list group id: {list_box_id}".format(list_box_id=list_box_id))

    if not list_box_id:
        current_app.logger.error(
            "Could not found box with user id: {user_id}".format(user_id=user_id))
        return jsonify({"message": "Could not found box with user id: {user_id}".format(user_id=user_id)}), 400

    if validate_previous_type(type_previous) is False:
        current_app.logger.error(
            "Type previous must in {list_pre}".format(list_pre=LIST_PREVIOUS_TYPE))
        return jsonify({"message": "Type previous must in {list_pre}".format(list_pre=LIST_PREVIOUS_TYPE)}), 400

    response = list_response_list_static(
        date_start, date_end_timestamp, type_previous, list_box_id)
    return {"data": response}
