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


def count_amount_of_timestamp_by_list_zone(list_zone_id, date_start, date_end, location):
    query = {
        "data": {
            "$elemMatch": {
                "zone_id": {"$in": list_zone_id},
                "timestamp": {"$gte": int(date_start), "$lt": int(date_end)},
                "location": location
            }
        }
    }
    result = db.find_all(str(config.peopleCountingHistory), query)
    output = []
    lst_hour = [i for i in range(7, 24)]
    for record in result:
        for data in record["data"]:
            if str(data["location"]) == str(location) and data["hour"] in lst_hour:
                output.append(data)
    print(output)
    return len(output)


def get_count_of_separated_weekend(date_start, date_end, date_start_previous, date_end_previous, list_box_id,
                                   zone_area):
    f"""
    :param date_start: 
    :param date_end: 
    :param date_start_previous: 
    :param date_end_previous: 
    :param list_box_id: 
    :param zone_area: 
    :return: {list}, {list} 
    """
    totalWeekNormal = 0
    totalWeekNormalPrevious = 0
    totalWeekend = 0
    totalWeekendPrevious = 0
    i = 0
    data = []
    dataPrevious = []
    # get data now
    list_zone_id = get_list_zone_id(list_box_id, zone_area)
    total = count_amount_of_timestamp_by_list_zone(
        list_zone_id, date_start, date_end, zone_area)
    # for _ in range(int(date_end)):
    if int(date_start) >= int(date_end):
        print("allooooo")
    day_number_in_week = get_day_number_in_week(date_start)
    print("total: \n")
    if day_number_in_week in [0, 1, 2, 3, 4]:
        totalWeekNormal = int(total)
    else:
        totalWeekend = int(total)
    data.extend((totalWeekNormal, totalWeekend))
    date_start = int(date_start) + 86400

    # get data previous
    # for _ in range(date_end_previous):
    if int(date_start_previous) >= int(date_end_previous):
        print("allooooo 2")
    list_zone_id = get_list_zone_id(list_box_id, zone_area)
    day_number_in_week = get_day_number_in_week(date_start_previous)
    total = count_amount_of_timestamp_by_list_zone(
        list_zone_id, date_start_previous, date_end_previous, zone_area)
    if day_number_in_week in [0, 1, 2, 3, 4]:
        totalWeekNormalPrevious = int(total)
    else:
        totalWeekendPrevious = int(total)
    dataPrevious.extend((totalWeekNormalPrevious, totalWeekendPrevious))
    date_start_previous = int(date_start_previous) + 86400
    return {"data": data, "dataPrevious": dataPrevious}


def count_separated_weekend():
    """
    :return: {dict}
    """
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

    get_result_count_of_separated_weekend_gate = get_count_of_separated_weekend(date_start, date_end_timestamp,
                                                                                date_start_previous, date_end_previous,
                                                                                list_box_id, "gate")
    dataGate = get_result_count_of_separated_weekend_gate["data"]
    dataGatePrevious = get_result_count_of_separated_weekend_gate["dataPrevious"]

    get_result_count_of_separated_weekend_way = get_count_of_separated_weekend(date_start, date_end_timestamp,
                                                                               date_start_previous, date_end_previous,
                                                                               list_box_id, "way")
    dataWay = get_result_count_of_separated_weekend_way["data"]

    dataWayPrevious = get_result_count_of_separated_weekend_way["dataPrevious"]
    # dataWay = 0
    #
    # dataWayPrevious = 0
    return {
        "dataGate": dataGate,
        "dataGatePrevious": dataGatePrevious,
        "dataWay": dataWay,
        "dataWayPrevious": dataWayPrevious
    }
