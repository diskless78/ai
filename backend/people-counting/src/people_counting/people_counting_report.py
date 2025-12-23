# -*- coding: utf-8 -*-

from flask import request, jsonify
import datetime
from utilities import utilities
from database import db
from config import config
import socket
from sentry_sdk import capture_exception, init
from collections import Counter

init(config.CLIENT_KEYS)

# Local ip
ip = socket.gethostbyname(socket.gethostname())
# Timestamp
asctime = datetime.datetime.now()

# list hours
list_hours = utilities.lst_hours(6, 23)

# list previous type
lst_previous_type = ["yesterday", "lastWeek", "last14Days", "lastMonth"]


def count_list_zone_timestamp(list_zone, start, end, location):
    f"""
    Count data in zone with location == location
        :parameter: {list_zone}, {start}, {end}
        :return: {int}   
    """
    query_find_record = {
        "data": {
            "$elemMatch": {
                "zone_id": {"$in": list_zone},
                "timestamp": {"$gte": start, "$lt": end},
                "location": location
            },
        }
    }
    find_all_record_pc = db.find_all(str(config.peopleCountingHistory), query_find_record)
    html_css = []
    for rec in find_all_record_pc:
        for data in rec["data"]:
            if data["location"] == location:
                html_css.append(data)
    print("html_css: \n", html_css)
    return len(html_css)


def count_list_shop_zone(list_zone, start, end):
    f"""
    Count data in zone with location != shop
        :parameter: {list_zone}, {start}, {end} 
        :return: {int}
    """
    query = {
        "data": {
            "$elemMatch": {
                "zone_id": {"$in": list_zone},
                "timestamp": {"$gte": start, "$lt": end},
                "dwellTime": {"$gte": 15, "$lte": 120}
            }
        }
    }
    find_all_zone_shop = db.find_all(str(config.peopleCountingHistory), query)
    html_css = []
    for rec in find_all_zone_shop:
        for data in rec["data"]:
            if data["location"] == "shop":
                html_css.append(data)
    return len(html_css)


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
        increase = True
        percentage = ((now - previous) / previous) * 100
    return {"increase": increase, "percentage": percentage}


def list_box(list_group):
    f"""
    :param list_group: 
    :return: {list} 
    """
    query_find_box = {
        "group": {"$in": list_group}
    }
    find_box_data = db.find_all(str(config.boxAI), query_find_box)

    return [box["id"] for box in find_box_data]


def transform_timestamp_to_find_previous(start, end, previous_type):
    f"""
    :param start: 
    :param end: 
    :param previous_type: 
    :return: {int}, {int} 
    """
    if previous_type == "yesterday":
        return int(start) - 86399, start
    elif previous_type == "lastWeek":
        return int(start) - 7 * 86399, end - 7 * 86399
    elif previous_type == "last14Days":
        return int(start) - 14 * 86399, start
    else:
        return int(start) - 30 * 86399, start


def validate_previous_type(type_previous):
    f"""
    :param type_previous: 
    :return: {bool} 
    """
    return type_previous in lst_previous_type


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
    if date_start == "" or date_end == "":
        return False
    elif date_start == 0 or date_end == 86399 or date_end < date_start:
        return False
    return True


def count_customer(start, end, start_previous, end_previous, list_box_id, is_new_customer):
    f"""
    :param start: 
    :param end: 
    :param start_previous: 
    :param end_previous: 
    :param list_box_id: 
    :param is_new_customer: 
    :return: {float}, {int}, {float}, {bool}
    """
    try:
        return _extracted_from_count_customer_4(list_box_id, start, end, start_previous, end_previous, is_new_customer)
    except BaseException as error:
        capture_exception(error)
        utilities.push_notify_telegram(config.chat_id, error)
        return error


def _extracted_from_count_customer_4(list_box_id, start, end, start_previous, end_previous, is_new_customer):
    find_total_customer = {
        "$and": [
            {"boxID": {"$in": list_box_id}},
            {"timestamp": {"$gte": start, "$lt": end}},
            {"listRecord": {"$elemMatch": {"newCustomer": is_new_customer}}}
        ]
    }
    count_customer_now = _extracted_from__extracted_from_count_customer_4_9(
        find_total_customer, is_new_customer
    )

    # count previous customer
    find_total_customer_previous = {
        "boxID": {"$in": list_box_id},
        "timestamp": {"$gte": start_previous, "$lt": end_previous},
        "listRecord": {
            "$elemMatch": {"newCustomer": is_new_customer}
        }
    }
    count_customer_pre = _extracted_from__extracted_from_count_customer_4_9(
        find_total_customer_previous, is_new_customer
    )

    get_data = calculator_percentage(
        len(count_customer_now), len(count_customer_pre))

    percentage, increase = get_data["percentage"], get_data["increase"]
    return {
        "Total": len(count_customer_now),
        "TotalPrevious": len(count_customer_pre),
        "Percentage": percentage,
        "Increase": increase
    }


def _extracted_from__extracted_from_count_customer_4_9(arg0, is_new_customer):
    count_total_customer = db.find_all(str(config.customerRecord), arg0)
    result = []
    for rec in count_total_customer:
        for data in rec["listRecord"]:
            if data["newCustomer"] == is_new_customer:
                result.append(data)

    return result


def count_people(start, end, start_previous, end_previous, lst_box, zone_area):
    f"""
    Count data in zone with zone area: gate, way, shop
        :parameter: {start}, {end}, {start_previous}, {end_previous}, {lst_box}, {zone_area} 
        :returns: {bool}, {int}, {int}, {float}
    """
    query_find_zone = {
        "boxID": {"$in": lst_box},
        "location": zone_area
    }
    find_zone = db.find_all(str(config.zone), query_find_zone, None)

    list_zone_id = [zone["id"] for zone in find_zone]
    if zone_area != "shop":
        count_data = count_list_zone_timestamp(list_zone_id, start, end, zone_area)
        count_data_previous = count_list_zone_timestamp(
            list_zone_id, start_previous, end_previous, zone_area)
    else:
        count_data = count_list_shop_zone(list_zone_id, start, end)
        count_data_previous = count_list_shop_zone(
            list_zone_id, start_previous, end_previous)
    get_percentage = calculator_percentage(count_data, count_data_previous)
    percent, increase = get_percentage["percentage"], get_percentage["increase"]
    return {
        "Total": count_data,
        "TotalPrevious": count_data_previous,
        "Percentage": percent,
        "Increase": increase
    }


def get_zone_area_static(date_start, date_end, lst_box, type_previous):
    f"""
    Get static data of zone area
        :parameter: {date_start, date_end, lst_box, type_previous}
        :returns: {int}, {int}, {int}, {int}, {int}        
    """
    # datetime previous
    date_start_previous, date_end_previous = transform_timestamp_to_find_previous(
        date_start, date_end, type_previous)

    # gate static data
    gate_static = count_people(date_start, date_end + 86400,
                               date_start_previous, date_end_previous, lst_box, "gate")

    # way static data
    way_static = count_people(date_start, date_end + 86400,
                              date_start_previous, date_end_previous, lst_box, "way")

    # shop static data
    shop_static = count_people(date_start, date_end + 86400,
                               date_start_previous, date_end_previous, lst_box, "shop")

    return {"gate_static": gate_static, "way_static": way_static,
            "shop_static": shop_static, "date_start_previous": date_start_previous,
            "date_end_previous": date_end_previous}


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


def response_data(date_start, date_end, lst_box, type_previous):
    f"""

    :param date_start: 
    :param date_end: 
    :param lst_box: 
    :param type_previous: 
    :return: {list} 
    """
    try:
        return _extracted_from_response_data_5(
            date_start, date_end, type_previous, lst_box
        )

    except BaseException as error:
        utilities.push_notify_telegram(config.chat_id, error)
        capture_exception(error)
        return {"error": error}


def _extracted_from_response_data_5(date_start, date_end, type_previous, lst_box):
    f"""

    :param date_start: 
    :param date_end: 
    :param type_previous: 
    :param lst_box: 
    :return: {list}
    """
    # get start previous and end previous timestamp
    start_pre, end_pre = transform_timestamp_to_find_previous(
        date_start, date_end, type_previous)

    # get static by zone area
    get_static = get_zone_area_static(
        date_start, date_end, lst_box, type_previous)

    # calculate rate
    fist_rate = calculate_rate(
        get_static["gate_static"], get_static["way_static"])
    second_rate = calculate_rate(
        get_static["shop_static"], get_static["gate_static"])

    return [
        get_static["gate_static"],
        get_static["way_static"],
        get_static["shop_static"],
        fist_rate,
        second_rate,
        # new customer
        count_customer(
            date_start,
            date_end,
            start_pre,
            end_pre,
            list_box_id=lst_box,
            is_new_customer=True,
        ),
        # old customer
        count_customer(
            date_start,
            date_end,
            start_pre,
            end_pre,
            list_box_id=lst_box,
            is_new_customer=False,
        ),
    ]


def list_static():
    f"""
        :returns: {dict}
    """
    data_input = request.args
    # get input timestamp from arg
    date_start = data_input.get('dateStart')
    date_end = data_input.get('dateEnd')
    user_id = utilities.get_user_info(request.headers["authorization"])

    # find group with user id above
    list_group = get_list_group(data_input.get('groupID'), user_id)

    if not validate_input_datetime(date_start, date_end):
        return jsonify({"message": "Wrong input datetime"}), 400

    # get type of query input
    type_previous = data_input.get("previousType")
    if not validate_previous_type(type_previous):
        return jsonify({"message": "previousType can not be empty"}), 400

    # validate box
    lst_box = list_box(list_group)
    if lst_box == 0:
        return jsonify({"message": "This group does not belong any box"}), 404
    print("dateStart: \n", date_start)
    print("dateEnd: \n", date_end)
    return {"listResponse": response_data(int(date_start), int(date_end), lst_box, type_previous)}


def get_zone_string(zone_area):
    if zone_area == "shop":
        return {"name": "Lượng người mua hàng", "name_percentage": "Lượng người mua hàng"}
    elif zone_area == "way":
        return {"name": "Lượng người đi qua", "name_percentage": "Lượng người đi qua"}
    elif zone_area == "gate":
        return {"name": "Lượng người đi vào", "name_percentage": "Lượng người đi vào"}


def count_pc_day_by_day(date_start, date_end, start_previous, lst_box, zone_area):
    f"""

    :param date_start: 
    :param date_end: 
    :param start_previous: 
    :param lst_box: 
    :param zone_area: 
    :return: {dict}, {dict}, {dict} 
    """
    heatmapData = {}
    heatmapPercentage = {}
    heatmapDataPrevious = {}
    list_data = ["0e+00", "0e+00", "0e+00", "0e+00", "0e+00", "0e+00", "0e+00"]
    list_percentage = ["0e+00", "0e+00", "0e+00",
                       "0e+00", "0e+00", "0e+00", "0e+00"]
    list_data_previous = ["0e+00", "0e+00",
                          "0e+00", "0e+00", "0e+00", "0e+00", "0e+00"]

    list_data_float = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    list_percentage_int = [0, 0, 0, 0, 0, 0, 0]
    list_data_previous_float = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    if zone_area == "shop":
        name, name_percentage = _extracted_from_count_pc_day_by_day_11("shop")
        heatmapData.update({"name": name})
        heatmapPercentage.update({"name": name_percentage})
    elif zone_area == "way":
        name, name_percentage = _extracted_from_count_pc_day_by_day_11("way")
        heatmapData.update({"name": name})
        heatmapPercentage.update({"name": name_percentage})
    elif zone_area == "gate":
        name, name_percentage = _extracted_from_count_pc_day_by_day_11("gate")
        heatmapData.update({"name": name})
        heatmapPercentage.update({"name": name_percentage})
    for day_number, i in enumerate(date_start, start=1):
        if date_start < date_end:
            get_static_data = count_people(date_start, date_start + 86400,
                                           start_previous + 86400 * day_number,
                                           start_previous + 86400 + 86400 * day_number,
                                           lst_box, zone_area)
            timestamp_to_date = utilities.convert_timestamp_to_date(date_start)
            day_number_of_week = datetime.datetime.strptime(
                timestamp_to_date, "%Y-%m-%d").weekday()
            if int(day_number_of_week) == 0:
                list_data_float[6] = get_static_data["Total"]
                list_data_previous_float[6] = get_static_data["TotalPrevious"]
                if get_static_data["Increase"]:
                    list_percentage_int[6] = list_percentage_int[6] + \
                                             int(get_static_data["Percentage"])
                else:
                    list_percentage_int[6] = list_percentage_int[6] - \
                                             int(get_static_data["Percentage"])
            elif int(day_number_of_week) == 1:
                list_data_float[0] = get_static_data["Total"]
                list_data_previous_float[0] = get_static_data["TotalPrevious"]
                if get_static_data["Increase"]:
                    list_percentage_int[0] = list_percentage_int[0] + \
                                             int(get_static_data["Percentage"])
                else:
                    list_percentage_int[0] = list_percentage_int[0] - \
                                             int(get_static_data["Percentage"])
            elif int(day_number_of_week) == 2:
                list_data_float[1] = get_static_data["Total"]
                list_data_previous_float[1] = get_static_data["TotalPrevious"]
                if get_static_data["Increase"]:
                    list_percentage_int[1] = list_percentage_int[1] + \
                                             int(get_static_data["Percentage"])
                else:
                    list_percentage_int[1] = list_percentage_int[1] - \
                                             int(get_static_data["Percentage"])
            elif int(day_number_of_week) == 3:
                list_data_float[2] = get_static_data["Total"]
                list_data_previous_float[2] = get_static_data["TotalPrevious"]
                if get_static_data["Increase"]:
                    list_percentage_int[2] = list_percentage_int[2] + \
                                             int(get_static_data["Percentage"])
                else:
                    list_percentage_int[2] = list_percentage_int[2] - \
                                             int(get_static_data["Percentage"])
            elif int(day_number_of_week) == 4:
                list_data_float[3] = get_static_data["Total"]
                list_data_previous_float[3] = get_static_data["TotalPrevious"]
                if get_static_data["Increase"]:
                    list_percentage_int[3] = list_percentage_int[3] + \
                                             int(get_static_data["Percentage"])
                else:
                    list_percentage_int[3] = list_percentage_int[3] - \
                                             int(get_static_data["Percentage"])
            elif int(day_number_of_week) == 5:
                list_data_float[4] = get_static_data["Total"]
                list_data_previous_float[4] = get_static_data["TotalPrevious"]
                if get_static_data["Increase"]:
                    list_percentage_int[4] = list_percentage_int[4] + \
                                             int(get_static_data["Percentage"])
                else:
                    list_percentage_int[4] = list_percentage_int[4] - \
                                             int(get_static_data["Percentage"])
            elif int(day_number_of_week) == 6:
                list_data_float[5] = get_static_data["Total"]
                list_data_previous_float[5] = get_static_data["TotalPrevious"]
                if get_static_data["Increase"]:
                    list_percentage_int[5] = list_percentage_int[5] + \
                                             int(get_static_data["Percentage"])
                else:
                    list_percentage_int[5] = list_percentage_int[5] - \
                                             int(get_static_data["Percentage"])
    for index in range(len(list_data_float)):
        list_data[index] = "{:.2f}".format(list_data_float[index])
        list_data_previous[index] = "{:.2f}".format(
            list_data_previous_float[index])
        list_percentage[index] = "{:.2f}".format(list_percentage_int[index])

    heatmapDataPrevious.update({"data": list_data_previous})
    heatmapData.update({"data": list_data})
    heatmapPercentage.update({"data": list_data})
    return heatmapData, heatmapPercentage, heatmapDataPrevious


def _extracted_from_count_pc_day_by_day_11(arg0):
    f"""
    :param arg0: 
    :return: {str} 
    """
    zone_str = get_zone_string(arg0)
    name = zone_str["name"]
    name_percentage = zone_str["name_percentage"]
    return name, name_percentage


def get_rate_day_by_day(first_zone, second_zone, first_zone_previous, second_zone_previous, name):
    f"""

    :param first_zone: 
    :param second_zone: 
    :param first_zone_previous: 
    :param second_zone_previous: 
    :param name: 
    :return: {list}, {list} 
    """
    rate = {}
    ratePercentage2 = {}
    listRate = []
    listRatePercentage = []
    rate.update({"name": name})
    ratePercentage2.update({"name": name})
    rate_previous = 0.0
    rate_data = 0.0
    print("first_zone: \n", first_zone["data"])
    for index, value in enumerate(first_zone["data"], start=1):
        if index <= len(first_zone["data"]):
            print("index: \n", index)
            if float(second_zone["data"][index]) == 0.0:
                rate_data = 101.0
                print("xnxx first")
            else:
                try:
                    x = float(value)
                    y = float(second_zone["data"][index])
                    rate_data = (x / y) * 100
                except BaseException as error:
                    utilities.push_notify_telegram(config.chat_id, error)
                    capture_exception(error)
            listRate.append("{:.2f}".format(rate_data))
            if float(second_zone_previous["data"][index]) == 0.0:
                rate_previous = 101.0
                print("xnxx second")
            else:
                try:
                    x = float(first_zone_previous["data"][index])
                    y = float(second_zone_previous["data"][index])
                    rate_previous = (x / y) * 100
                except BaseException as error:
                    capture_exception(error)
                    utilities.push_notify_telegram(config.chat_id, error)
            ratePercentage = rate_data - rate_previous
            if ratePercentage >= 0:
                listRatePercentage.append("-{:.2f}".format(ratePercentage))
            else:
                listRatePercentage.append("{:.2f}".format(ratePercentage))
            rate.update({"data": listRate})
            ratePercentage2.update({"data": listRatePercentage})
            print("rate list: \n", rate)
            print("rate list percent: \n", ratePercentage)
            return rate, ratePercentage


def count_customer_day_to_day(date_start, date_end, start_pre, list_box_id, is_new_customer):
    """

    :param date_start:
    :param date_end:
    :param start_pre:
    :param list_box_id:
    :param is_new_customer:
    :return:
    """
    try:
        heatmapData = {}
        heatmapPercentage = {}
        if is_new_customer is True:
            heatmapData.update({"name": "Khách hàng mới"})
            heatmapPercentage.update({"name": "Khách hàng mới"})
        else:
            heatmapData.update({"name": "Khách hàng cũ"})
            heatmapPercentage.update({"name": "Khách hàng cũ"})

        list_data = ["0e+00", "0e+00", "0e+00",
                     "0e+00", "0e+00", "0e+00", "0e+00"]
        list_percentage = ["0e+00", "0e+00", "0e+00",
                           "0e+00", "0e+00", "0e+00", "0e+00"]
        list_data_previous_day = ["0e+00", "0e+00",
                                  "0e+00", "0e+00", "0e+00", "0e+00", "0e+00"]

        list_data_float = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        list_percentage_int = [0, 0, 0, 0, 0, 0, 0]
        list_data_previous_day_float = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        for day_number, i in enumerate(date_start, start=86400):
            if date_start < date_end:
                get_static_data_customer = count_customer(date_start, date_start + 86400,
                                                          start_pre + 86400 * day_number,
                                                          start_pre + 86400 * day_number + 86400,
                                                          list_box_id, is_new_customer)
                print(get_static_data_customer)
                timestamp_to_date = utilities.convert_timestamp_to_date(
                    date_start)
                day_number_of_week = datetime.datetime.strptime(
                    timestamp_to_date, "%Y-%m-%d").weekday()
                if int(day_number_of_week) == 0:
                    list_data_float[6] = list_data_float[6] + \
                                         get_static_data_customer["Total"]
                    list_data_previous_day[6] = list_data_previous_day[6] + \
                                                get_static_data_customer["TotalPrevious"]
                    if get_static_data_customer["Increase"] is True:
                        list_percentage_int[6] = list_percentage_int[6] + \
                                                 int(get_static_data_customer["Percentage"])
                    else:
                        list_percentage_int[6] = list_percentage_int[6] - \
                                                 int(get_static_data_customer["Percentage"])
                elif int(day_number_of_week) == 1:
                    list_data_float[0] = list_data_float[0] + \
                                         get_static_data_customer["Total"]
                    list_data_previous_day[0] = list_data_previous_day[0] + \
                                                get_static_data_customer["TotalPrevious"]
                    if get_static_data_customer["Increase"] is True:
                        list_percentage_int[0] = list_percentage_int[0] + \
                                                 int(get_static_data_customer["Percentage"])
                    else:
                        list_percentage_int[0] = list_percentage_int[0] - \
                                                 int(get_static_data_customer["Percentage"])
                elif int(day_number_of_week) == 2:
                    list_data_float[1] = list_data_float[1] + \
                                         get_static_data_customer["Total"]
                    list_data_previous_day[1] = list_data_previous_day[1] + \
                                                get_static_data_customer["TotalPrevious"]
                    if get_static_data_customer["Increase"] is True:
                        list_percentage_int[1] = list_percentage_int[1] + \
                                                 int(get_static_data_customer["Percentage"])
                    else:
                        list_percentage_int[1] = list_percentage_int[1] - \
                                                 int(get_static_data_customer["Percentage"])
                elif int(day_number_of_week) == 3:
                    list_data_float[2] = list_data_float[2] + \
                                         get_static_data_customer["Total"]
                    list_data_previous_day[2] = list_data_previous_day[2] + \
                                                get_static_data_customer["TotalPrevious"]
                    if get_static_data_customer["Increase"] is True:
                        list_percentage_int[2] = list_percentage_int[2] + \
                                                 int(get_static_data_customer["Percentage"])
                    else:
                        list_percentage_int[2] = list_percentage_int[2] - \
                                                 int(get_static_data_customer["Percentage"])
                elif int(day_number_of_week) == 4:
                    list_data_float[3] = list_data_float[3] + \
                                         get_static_data_customer["Total"]
                    list_data_previous_day[3] = list_data_previous_day[3] + \
                                                get_static_data_customer["TotalPrevious"]
                    if get_static_data_customer["Increase"] is True:
                        list_percentage_int[3] = list_percentage_int[3] + \
                                                 int(get_static_data_customer["Percentage"])
                    else:
                        list_percentage_int[3] = list_percentage_int[3] - \
                                                 int(get_static_data_customer["Percentage"])
                elif int(day_number_of_week) == 5:
                    list_data_float[4] = list_data_float[4] + \
                                         get_static_data_customer["Total"]
                    list_data_previous_day[4] = list_data_previous_day[4] + \
                                                get_static_data_customer["TotalPrevious"]
                    if get_static_data_customer["Increase"] is True:
                        list_percentage_int[4] = list_percentage_int[4] + \
                                                 int(get_static_data_customer["Percentage"])
                    else:
                        list_percentage_int[4] = list_percentage_int[4] - \
                                                 int(get_static_data_customer["Percentage"])
                elif int(day_number_of_week) == 6:
                    list_data_float[5] = list_data_float[5] + \
                                         get_static_data_customer["Total"]
                    list_data_previous_day[5] = list_data_previous_day[5] + \
                                                get_static_data_customer["TotalPrevious"]
                    if get_static_data_customer["Increase"] is True:
                        list_percentage_int[5] = list_percentage_int[5] + \
                                                 int(get_static_data_customer["Percentage"])
                    else:
                        list_percentage_int[5] = list_percentage_int[5] - \
                                                 int(get_static_data_customer["Percentage"])
                day_number += 1
        for index in range(len(list_data_float)):
            list_data[index] = float(list_data_float[index])
            list_data_previous_day[index] = float(
                list_data_previous_day_float[index])
            list_percentage = float(list_percentage_int[index])
        heatmapData.update({"data": list_data})
        heatmapPercentage.update({"data": list_percentage})
        return heatmapData, heatmapPercentage
    except BaseException as error:
        utilities.push_notify_telegram(config.chat_id, error)
        capture_exception(error)
        return {"error": error}


def response_static_by_week(date_start, date_end, list_group, type_previous):
    # get start previous and end previous timestamp
    start_pre, end_pre = transform_timestamp_to_find_previous(
        date_start, date_end, type_previous)

    # list box
    lst_box = list_box(list_group)
    if lst_box == 0:
        return jsonify({"message": "This group does not belong any box"})
    peopleCountInWayFromWeek, peopleCountInWayPercentageFromWeek, peopleCountInWayPreviousFromWeek = count_pc_day_by_day(
        date_start, date_end, start_pre, lst_box, "way")
    peopleCountInGateFromWeek, peopleCountInGatePercentageFromWeek, peopleCountInGatePreviousFromWeek = count_pc_day_by_day(
        date_start, date_end, start_pre, lst_box, "gate")

    peopleCountInShopFromWeek, peopleCountInShopPercentageFromWeek, peopleCountInShopPreviousFromWeek = count_pc_day_by_day(
        date_start, date_end, start_pre, lst_box, "shop")

    rate1, rate1_percentage = get_rate_day_by_day(
        peopleCountInGateFromWeek, peopleCountInWayFromWeek, peopleCountInGatePreviousFromWeek,
        peopleCountInWayPreviousFromWeek, "Tỉ lệ chuyển đổi 1")
    rate2, rate2_percentage = get_rate_day_by_day(peopleCountInShopFromWeek, peopleCountInGateFromWeek,
                                                  peopleCountInShopPreviousFromWeek, peopleCountInGatePreviousFromWeek,
                                                  "Tỉ lệ chuyển đổi 2")

    oldCustomer, oldCustomerPercentage = count_customer_day_to_day(
        date_start, date_end, start_pre, lst_box, False)
    newCustomer, newCustomerPercentage = count_customer_day_to_day(
        date_start, date_end, start_pre, lst_box, True)

    data = [peopleCountInWayFromWeek,
            peopleCountInGateFromWeek, peopleCountInShopFromWeek, rate1, rate2, oldCustomer, newCustomer]
    print("data: \n", data)
    dataPercentage = [peopleCountInWayPercentageFromWeek,
                      peopleCountInGatePercentageFromWeek, peopleCountInShopPercentageFromWeek, rate1_percentage,
                      rate2_percentage, oldCustomerPercentage, newCustomerPercentage]
    print("data percentage: \n", dataPercentage)

    return {"data": data, "data_percent": dataPercentage}


def get_static_by_week():
    f"""
    :return: {dict} 
    """
    # get input from args
    data_input = request.args
    date_start = data_input.get('dateStart')
    date_end = data_input.get('dateEnd')
    type_previous = data_input.get("previousType")
    user_id = utilities.get_user_info(request.headers["authorization"])

    # get list group
    list_group = get_list_group(data_input.get('groupID'), user_id)

    # validate datetime input
    if not validate_input_datetime(date_start, date_end):
        return jsonify({"message": "Wrong input datetime"}), 400
    get_response = response_static_by_week(
        date_start, date_end, list_group, type_previous)
    return {
        "data": get_response["data"],
        "dataPercentage": get_response["data_percent"]
    }


def get_total_week_previous(date_start_previous, date_end_previous, list_box_id, zone_name):
    f"""
        :param date_start_previous: 
        :param date_end_previous: 
        :param list_box_id: 
        :param zone_name: 
        :return: {list}
        """
    try:
        totalWeekNormalPrevious = 0
        totalWeekendPrevious = 0
        for it, value in enumerate(date_end_previous, start=int(date_start_previous)):
            print("number: \n", it)
            print("date_end: \n", date_end_previous)
            print("date_start: \n", date_start_previous)
            if it < int(date_end_previous):
                find_list_zone = db.find_all(str(config.zone),
                                             {"boxID": {"$in": list_box_id}, "location": zone_name})
                list_zone_id = [zone["id"] for zone in find_list_zone]
                count_amount_timestamp_list_zone = count_list_zone_timestamp(list_zone_id, it, it + 86400, zone_name)
                print("count_amount_timestamp_list_zone: \n", count_amount_timestamp_list_zone)
                timestamp_to_date = utilities.convert_timestamp_to_date(
                    int(date_start_previous))
                print("timestamp_to_date number ê e ê ê: \n", timestamp_to_date)
                day_number_of_week = datetime.datetime.strptime(
                    timestamp_to_date, "%Y-%m-%d").weekday()
                print("day number ê e ê ê: \n", day_number_of_week)
                if day_number_of_week in [1, 2, 3, 4, 5]:
                    totalWeekNormalPrevious += int(count_amount_timestamp_list_zone)
                    print("totalWeekend: \n", totalWeekNormalPrevious)
                else:
                    totalWeekendPrevious += int(count_amount_timestamp_list_zone)
                    print("totalWeekNormal: \n", totalWeekendPrevious)
            it += 86400
        return [totalWeekNormalPrevious, totalWeekendPrevious]
    except BaseException as error:
        utilities.push_notify_telegram(config.chat_id, error)
        capture_exception(error)
        return {"error": error}


def get_count_of_separate_week(date_start, date_end, start_pre, end_pre, list_box_id, zone_name):
    try:
        total_week = get_total_week(
            date_start, date_end, list_box_id, zone_name
        )
        total_week_previous = get_total_week_previous(
            start_pre, end_pre, list_box_id, zone_name
        )
        return total_week, total_week_previous
    except BaseException as error:
        utilities.push_notify_telegram(config.chat_id, error)
        capture_exception(error)
        return {"error": error}


def get_total_week(date_start, date_end, list_box_id, zone_name):
    f"""

    :param date_start: 
    :param date_end: 
    :param list_box_id: 
    :param zone_name: 
    :return: {list}
    """
    try:
        totalWeekNormal = 0
        totalWeekend = 0
        response = []
        for number, _ in enumerate(date_end, start=int(date_start)):
            if number < int(date_end):
                find_list_zone = db.find_all(str(config.zone),
                                             {"boxID": {"$in": list_box_id}, "location": zone_name})
                list_zone_id = [zone["id"] for zone in find_list_zone]
                count_amount_timestamp_list_zone = count_list_zone_timestamp(list_zone_id, number, number, zone_name)
                timestamp_to_date = utilities.convert_timestamp_to_date(
                    int(date_start))
                day_number_of_week = datetime.datetime.strptime(
                    timestamp_to_date, "%Y-%m-%d").weekday()
                if day_number_of_week in [1, 2, 3, 4, 5]:
                    totalWeekNormal += int(count_amount_timestamp_list_zone)
                else:
                    totalWeekend += int(count_amount_timestamp_list_zone)
                response.extend((totalWeekNormal, totalWeekend))
            number += 86400
        return [totalWeekNormal, totalWeekend]
    except BaseException as error:
        utilities.push_notify_telegram(config.chat_id, error)
        capture_exception(error)
        return {"error": error}


def response_separate_weekend(date_start, date_end, list_group, type_previous):
    # get start previous and end previous timestamp
    start_pre, end_pre = transform_timestamp_to_find_previous(
        date_start, date_end, type_previous)

    # list box
    lst_box = list_box(list_group)
    if lst_box == 0:
        return jsonify({"message": "This group does not belong any box"})

    dataGate, dataGatePrevious = get_count_of_separate_week(
        date_start, date_end, start_pre, end_pre, lst_box, "gate")
    dataWay, dataWayPrevious = get_count_of_separate_week(
        date_start, date_end, start_pre, end_pre, lst_box, "way")
    return {
        "dataGate": dataGate,
        "dataGatePrevious": dataGatePrevious,
        "dataWay": dataWay,
        "dataWayPrevious": dataWayPrevious,
    }


def count_separate_weekend():
    f"""
    :return: {dict} 
    """
    # get input from args
    data_input = request.args
    date_start = data_input.get('dateStart')
    date_end = data_input.get('dateEnd')
    type_previous = data_input.get("previousType")
    user_id = utilities.get_user_info(request.headers["authorization"])

    # get list group
    list_group = get_list_group(data_input.get('groupID'), user_id)

    # validate datetime input
    if not validate_input_datetime(date_start, date_end):
        return jsonify({"message": "Wrong input datetime"}), 400

    response_separate_weekend(date_start, date_end, list_group, type_previous)
    return {"data": response_separate_weekend(date_start, date_end, list_group, type_previous)}


def count_amount_timestamp_list_zone_from_hour(list_zone_id, start, end):
    query_find_pc_record = {
        "data": {
            "$elemMatch": {"zone_id": {"$in": list_zone_id},
                           "timestamp": {"$lt": end, "$gte": start},
                           "hour": {"$in": list_hours}},
        }
    }
    return db.count_record(str(config.peopleCountingHistory), query_find_pc_record)


def count_by_hours():
    f"""
    :return: {dict} 
    """
    data_input = request.args
    date_start = int(data_input.get('dateStart'))
    date_end = date_start + 86399
    if not validate_input_datetime(date_start, date_end):
        return jsonify({"message": "Wrong input datetime"}), 400
    user_id = utilities.get_user_info(request.headers["authorization"])
    # get list group
    list_group = get_list_group(data_input.get('groupID'), user_id)
    # get list box
    list_box_id = list_box(list_group)
    if len(list_box_id) == 0:
        return jsonify({"message": "This group does not belong any box"})
    # find zone with location == gate, boxID in list_box_id bellow
    find_list_zone = db.find_all(str(config.zone), {"boxID": {"$in": list_box_id}, "location": "gate"})
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
    data2 = []
    for dt in find_record:
        for rec in dt["data"]:
            if rec["location"] == "gate":
                print("hour: \n", rec["hour"])
                data2.append(rec["hour"])
    # test = [data["hour"] for data in find_record["data"] if data["location"] == "gate"]
    for num in range(7, 24):
        data2.append(num)
    print(data2)
    if find_record:
        return _extracted_from_count_by_hours_31(data2)
    value = [number - number for number in range(7, 24)]
    return {"data": value}


def _extracted_from_count_by_hours_31(test):
    c = Counter([data for data in test])
    s = [value - 1 for key, value in c.items()]
    s2 = [key for key, value in c.items()]
    print(s)
    print(s2)
    # return {"data": sorted(c.items())}
    return {"data": dict(zip(s2, s))}

