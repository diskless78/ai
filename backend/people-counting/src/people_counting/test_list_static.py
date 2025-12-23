# -*- coding: utf-8 -*-

from flask import request, jsonify
import datetime
from utilities import utilities
from database import db
from config import config
import socket
from sentry_sdk import init, capture_exception, capture_message

init(config.CLIENT_KEYS)

# Local ip
ip = socket.gethostbyname(socket.gethostname())
# Timestamp
asctime = datetime.datetime.now()

# list hours
list_hours = utilities.lst_hours(6, 23)

# list previous type
lst_previous_type = ["yesterday", "lastWeek", "last14Days", "lastMonth"]


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
    print("query: \n", query)
    result = db.find_all(str(config.peopleCountingHistory), query)
    output = []
    lst_hour = [i for i in range(7, 24)]
    for record in result:
        for data in record["data"]:
            if str(data["location"]) == str(location) and data["hour"] in lst_hour:
                output.append(data)
    print("len: \n", len(output))
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
            if 15 <= int(data["dwellTime"]) <= 120 and data["location"] == "shop":
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
        percentage = 101.0
    elif now < previous:
        increase = False
        percentage = ((previous - now) / previous) * 100
    else:
        increase = False
        percentage = ((now - previous) / previous) * 100
    return {"percentage": percentage, "increase": increase}


def count_people_v2(date_start, date_end, date_start_previous, date_end_previous, list_box_id, zone_area):
    static = {}
    # find list zone id
    list_zone_id = get_list_zone_id(list_box_id, zone_area)
    if zone_area != "shop":
        total = count_amount_of_timestamp_by_list_zone(list_zone_id,
                                                       date_start, date_end, zone_area)
        print("total != shop: \n", total)
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
        "Total": total,
        "TotalPrevious": totalPrevious,
        "Percentage": percentage,
        "Increase": increase,
    })
    return static


def get_list_group(group_id, user_id):
    f"""
    :param group_id: 
    :param user_id: 
    :return: {list} 
    """
    if group_id is not None and group_id != "":
        return group_id.split(",")
    find_group = db.find_all(str(config.group), {"userid": user_id})
    return [group_id["id"] for group_id in find_group]


def validate_input_datetime(date_start, date_end):
    f"""
    :param date_start: 
    :param date_end: 
    :return: {bool} 
    """
    # validate datetime input
    return (
        int(date_start) != 0
        and int(date_end) != 86399
        and int(date_end) >= int(date_start)
    )


def get_list_box(list_group):
    f"""
    :param list_group: 
    :return: {list} 
    """
    query_find_box = {
        "group": {"$in": list_group}
    }
    find_box_data = db.find_all(str(config.boxAI), query_find_box)

    return [box["id"] for box in find_box_data]


def validate_previous_type(type_previous):
    f"""
    :param type_previous: 
    :return: {bool} 
    """
    return type_previous in lst_previous_type


def transform_timestamp_to_find_previous(start, end, previous_type):
    f"""
    :param start: 
    :param end: 
    :param previous_type: 
    :return: {int}, {int} 
    """
    if previous_type == "yesterday":
        return {"start": int(start) - 86399, "end": int(start)}
    elif previous_type == "lastWeek":
        return {"start": int(start) - 7 * 86399, "end": int(end - 7 * 86399)}
    elif previous_type == "last14Days":
        return {"start": int(start) - 14 * 86399, "end": int(start)}
    else:
        return {"start": int(start) - 30 * 86399, "end": int(start)}


def get_day_number_in_week(date_start):
    timestamp_to_date = utilities.convert_timestamp_to_date(int(date_start))
    return datetime.datetime.strptime(
        timestamp_to_date, "%Y-%m-%d").weekday()


def get_list_zone_id(list_box_id, location):
    query = {
        "boxID": {"$in": list_box_id},
        "location": location
    }
    result = db.find_all(str(config.zone), query)
    return [zone_id["id"] for zone_id in result]


def calculate_rate(first, second):
    f"""
    :param: {first}: 
    :param: {second} 
    :return: {float}  
    """
    # get first rate
    if second["Total"] == 0:
        first_rate = 101.0
    else:
        first_rate = (first["Total"] / second["Total"]) * 100

    # get second rate
    if second["TotalPrevious"] == 0:
        second_rate = 0.0
    else:
        second_rate = (first["TotalPrevious"] / second["TotalPrevious"]) * 100

    if second_rate == 0:
        increase = True
        percentage = 101.0
    elif first_rate < second_rate != 0:
        increase = False
        percentage = ((second_rate - first_rate) / second_rate) * 100
    else:
        increase = True
        percentage = ((first_rate - second_rate) / second_rate) * 100
    return {
        "Total": first_rate,
        "TotalPrevious": second_rate,
        "Percentage": percentage,
        "Increase": increase
    }


def list_static():
    """
        :return: {dict}
        """
    data = []
    get_input_data = request.args
    date_start = get_input_data.get("dateStart")
    date_end = get_input_data.get("dateEnd")
    if date_start == "" or date_end == "":
        return jsonify({"message": "Datetime cannot be empty"}), 400
    user_id = utilities.get_user_info(request.headers["authorization"])
    date_end_timestamp = int(date_end) + 86399
    type_previous = get_input_data.get("previousType")

    list_group_id = get_list_group(get_input_data.get("groupID"), user_id)

    if not validate_input_datetime(date_start, date_end_timestamp):
        return jsonify({"message": "Wrong input datetime"}), 400

    list_box_id = get_list_box(list_group_id)

    if len(list_box_id) == 0:
        return jsonify({"message": "Could not found box with user id: {user_id}".format(user_id=user_id)}), 400

    if validate_previous_type(type_previous) is False:
        return jsonify({"message": "Type previous must in {list_pre}".format(list_pre=lst_previous_type)}), 400

    get_datetime_previous = transform_timestamp_to_find_previous(
        date_start, date_end_timestamp, type_previous)
    date_start_previous, date_end_previous = get_datetime_previous[
        "start"], get_datetime_previous["end"]

    gateStatic = count_people_v2(date_start, date_end_timestamp, date_start_previous,
                                 date_end_previous, list_box_id, "gate")
    print("gateStatic: \n", gateStatic)
    wayStatic = count_people_v2(date_start, date_end_timestamp, date_start_previous,
                                date_end_previous, list_box_id, "way")
    shopStatic = count_people_v2(date_start, date_end_timestamp, date_start_previous,
                                 date_end_previous, list_box_id, "shop")

    rate_1 = calculate_rate(gateStatic, wayStatic)
    rate_2 = calculate_rate(shopStatic, gateStatic)
    data.extend((gateStatic, wayStatic, rate_1, rate_2, shopStatic))

    return {"data": data}
