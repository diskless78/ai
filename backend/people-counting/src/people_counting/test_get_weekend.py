# -*- coding: utf-8 -*-

from flask import request, jsonify
import datetime
from utilities import utilities
from database import db
from config import config
import socket
from sentry_sdk import init, capture_exception

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
        return {"start": int(start) - 86400, "end": int(start)}
    elif previous_type == "lastWeek":
        return {"start": int(start) - 7 * 86400, "end": int(end - 7 * 86400)}
    elif previous_type == "last14Days":
        return {"start": int(start) - 14 * 86400, "end": int(start)}
    else:
        return {"start": int(start) - 30 * 86400, "end": int(start)}


def get_list_zone_id(list_box_id, location):
    query = {
        "boxID": {"$in": list_box_id},
        "location": location
    }
    result = db.find_all(str(config.zone), query)
    return [zone_id["id"] for zone_id in result]


def get_day_number_in_week(date_start):
    timestamp_to_date = utilities.convert_timestamp_to_date(int(date_start))
    return datetime.datetime.strptime(
        timestamp_to_date, "%Y-%m-%d").weekday()


def count_amount_of_timestamp_by_list_zone(list_zone_id, date_start, date_end, location):
    query = {
        "$and": [
            {
                "timestamp": {"$gte": int(date_start), "$lte": int(date_end)}
            },
            {
                "data": {
                    "$elemMatch": {
                        "zone_id": {"$in": list_zone_id},
                        "hour": {"$in": [i for i in range(7, 24)]}
                    }
                }
            }
        ]
    }
    # convert timestamp to day number
    result = db.find_all(str(config.peopleCountingHistory), query)
    output = {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}
    lst_hour = [i for i in range(7, 24)]
    emp_list0 = []
    emp_list1 = []
    emp_list2 = []
    emp_list3 = []
    emp_list4 = []
    emp_list5 = []
    emp_list6 = []
    for record in result:
        for data in record["data"]:
            # if :
            day_number_in_week = get_day_number_in_week(data["timestamp"])
            if (
                    str(data["location"]) == str(location)
                    and data["hour"] in lst_hour
                    # and int(date_start) <= data["timestamp"] < int(date_end)
            ):
                if day_number_in_week == 0:
                    emp_list0.append(data)
                    output["0"] = len(emp_list0)
                elif day_number_in_week == 1:
                    emp_list1.append(data)
                    output["1"] = len(emp_list1)
                elif day_number_in_week == 2:
                    emp_list2.append(data)
                    output["2"] = len(emp_list2)
                elif day_number_in_week == 3:
                    emp_list3.append(data)
                    output["3"] = len(emp_list3)
                elif day_number_in_week == 4:
                    emp_list4.append(data)
                    output["4"] = len(emp_list4)
                elif day_number_in_week == 5:
                    emp_list5.append(data)
                    output["5"] = len(emp_list5)
                elif day_number_in_week == 6:
                    emp_list6.append(data)
                    output["6"] = len(emp_list6)
    return output


def count_amount_of_timestamp_by_list_shop_zone(list_zone_id, date_start, date_end):
    f"""
    Count data in zone with location == shop
        :parameter: {list_zone_id}, {date_start}, {date_end} 
        :return: {int}
    """
    query = {
        "$and": [
            {
                "timestamp": {"$gte": int(date_start), "$lte": int(date_end)}
            },
            {
                "data": {
                    "$elemMatch": {
                        "zone_id": {"$in": list_zone_id},
                        "hour": {"$in": [i for i in range(7, 24)]}
                    }
                }
            }
        ]
    }
    lst_hour = [i for i in range(7, 24)]
    output2 = {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}
    find_all_zone_shop = db.find_all(str(config.peopleCountingHistory), query)
    emp_listt0 = []
    emp_listt1 = []
    emp_listt2 = []
    emp_listt3 = []
    emp_listt4 = []
    emp_listt5 = []
    emp_listt6 = []

    for rec in find_all_zone_shop:
        for data in rec["data"]:
            day_number_in_week = get_day_number_in_week(data["timestamp"])
            if (
                    120 >= data["dwellTime"] >= 15
                    and data["hour"] in lst_hour
                    # and int(start) <= data["timestamp"] < int(end)
                    and data["location"] == "shop"
            ):
                if day_number_in_week == 0:
                    emp_listt0.append(data)
                    output2["0"] = len(emp_listt0)
                elif day_number_in_week == 1:
                    emp_listt1.append(data)
                    output2["1"] = len(emp_listt1)
                elif day_number_in_week == 2:
                    emp_listt2.append(data)
                    output2["2"] = len(emp_listt2)
                elif day_number_in_week == 3:
                    emp_listt3.append(data)
                    output2["3"] = len(emp_listt3)
                elif day_number_in_week == 4:
                    emp_listt4.append(data)
                    output2["4"] = len(emp_listt4)
                elif day_number_in_week == 5:
                    emp_listt5.append(data)
                    output2["5"] = len(emp_listt5)
                elif day_number_in_week == 6:
                    emp_listt6.append(data)
                    output2["6"] = len(emp_listt6)
    return output2


def calcu_cl(now, pre):
    for i in range(len(now)):
        if pre[i] == 0:
            increase = True
            percentage = 101.0
            print("per :\n", percentage)
        elif pre[i] > now[i + 1]:
            increase = False
            percentage = ((int(pre[i]) - int(now[i + 1])) / int(pre[i])) * 100
            print("percentage222: \n", percentage)
        else:
            increase = True
            percentage = ((int(now[i + 1]) - int(pre[i])) / int(pre[i])) * 100
            print("percentage: \n", percentage)
        return {"percentage": percentage, "increase": increase}


def calculator_percentage2(now_data, previous):
    f"""
    Calculator percentage
        :params: {now_data}, {previous}
        :returns: {bool}, {float}

    """
    for key, now in now_data.items():
        for k, pre in previous.items():
            if int(pre) == 0:
                increase = True
                percentage = 101.0
            elif int(now) < int(pre):
                increase = False
                percentage = ((int(pre) - int(now)) / int(pre))*100
            else:
                increase = True
                percentage = ((int(now) - int(pre)) / int(pre)) * 100
            return {"percentage": percentage, "increase": increase}


def count_people_v2(date_start, date_end, date_start_previous, date_end_previous, list_box_id, zone_area):
    """

    :param date_start:
    :param date_end:
    :param date_start_previous:
    :param date_end_previous:
    :param list_box_id:
    :param zone_area:
    :return:
    """
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
    get_percent_increase = calculator_percentage2(total, totalPrevious)
    percentage, increase = get_percent_increase["percentage"], get_percent_increase["increase"]
    static.update({
        "Total": total,
        "TotalPrevious": totalPrevious,
        "Percentage": percentage,
        "Increase": increase,
    })
    return static


def count_pc_day_to_day_v2(date_start, date_end, date_start_previous, list_box_id, zone_location):
    """

    :param date_start:
    :param date_end:
    :param date_start_previous:
    :param list_box_id:
    :param zone_location:
    :return:
    """
    heatmapData = {}
    heatmapDataPrevious = {}
    heatmapPercentage = {}
    if zone_location == "gate":
        heatmapData.update({"name": "Lượng người đi vào"})
        heatmapPercentage.update({"name": "Lượng người đi vào"})
    elif zone_location == "shop":
        heatmapData.update({"name": "Lượng người mua hàng"})
        heatmapPercentage.update({"name": "Lượng người mua hàng"})
    elif zone_location == "way":
        heatmapData.update({"name": "Lượng người đi qua"})
        heatmapPercentage.update({"name": "Lượng người đi qua"})
    list_data = ["0e+00", "0e+00", "0e+00", "0e+00", "0e+00", "0e+00", "0e+00"]
    list_percentage = ["0e+00", "0e+00", "0e+00",
                       "0e+00", "0e+00", "0e+00", "0e+00"]
    list_data_previous = ["0e+00", "0e+00",
                          "0e+00", "0e+00", "0e+00", "0e+00", "0e+00"]

    list_data_float = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    list_percentage_int = [0, 0, 0, 0, 0, 0, 0]
    list_data_previous_float = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    i = 0
    k = 0

    get_static_data = count_people_v2(int(date_start), int(date_end), int(date_start_previous) + 86400 * i,
                                      int(date_start_previous) + 86400 * i + 86400, list_box_id, zone_location)
    html = get_static_data["Total"]
    css_s = get_static_data["TotalPrevious"]
    for _ in range(int(date_end)):
        if int(date_start) >= int(date_end):
            break
        day_number_of_week = get_day_number_in_week(int(date_start))
        if int(day_number_of_week) == 0:
            list_data_float[0] = html["0"]
            list_data_previous_float[0] = css_s["0"]
            if get_static_data["Increase"]:
                list_percentage_int[0] = int(get_static_data["Percentage"])
            else:
                list_percentage_int[0] = - int(get_static_data["Percentage"])
        elif int(day_number_of_week) == 1:
            list_data_float[1] = html["1"]
            list_data_previous_float[1] = css_s["1"]
            if get_static_data["Increase"]:
                list_percentage_int[1] = int(get_static_data["Percentage"])
            else:
                list_percentage_int[1] = - int(get_static_data["Percentage"])
        elif int(day_number_of_week) == 2:
            list_data_float[2] = html["2"]
            list_data_previous_float[2] = css_s["2"]
            if get_static_data["Increase"]:
                list_percentage_int[2] = int(get_static_data["Percentage"])
            else:
                list_percentage_int[2] = -  int(get_static_data["Percentage"])
        elif int(day_number_of_week) == 3:
            list_data_float[3] = html["3"]
            list_data_previous_float[3] = css_s["3"]
            if get_static_data["Increase"]:
                list_percentage_int[3] = int(get_static_data["Percentage"])
            else:
                list_percentage_int[3] = -  int(get_static_data["Percentage"])
        elif int(day_number_of_week) == 4:
            list_data_float[4] = html["4"]
            list_data_previous_float[4] = css_s["4"]
            if get_static_data["Increase"]:
                list_percentage_int[4] = int(get_static_data["Percentage"])
            else:
                list_percentage_int[4] = - int(get_static_data["Percentage"])
        elif int(day_number_of_week) == 5:
            list_data_float[5] = html["5"]
            list_data_previous_float[5] = css_s["5"]
            if get_static_data["Increase"]:
                list_percentage_int[5] = int(get_static_data["Percentage"])
            else:
                list_percentage_int[5] = - int(get_static_data["Percentage"])
        elif int(day_number_of_week) == 6:
            list_data_float[6] = html["6"]
            list_data_previous_float[6] = css_s["6"]
            if get_static_data["Increase"]:
                list_percentage_int[6] = int(get_static_data["Percentage"])
            else:
                list_percentage_int[6] = -  int(get_static_data["Percentage"])
        date_start = int(date_start) + 86400
        # i += 1
    for index in range(len(list_data_float)):
        if index < len(list_data_float):
            list_data[index] = "{:.2f}".format(list_data_float[index])
            list_data_previous[index] = "{:.2f}".format(
                list_data_previous_float[index])
            list_percentage[index] = "{:.2f}".format(
                list_percentage_int[index])

    heatmapDataPrevious.update({"data": list_data_previous})
    heatmapData.update({"data": list_data})
    heatmapPercentage.update({"data": list_percentage})
    return {"heatmapData": heatmapData, "heatmapDataPrevious": heatmapDataPrevious,
            "heatmapPercentage": heatmapPercentage}


def count_customer(start, end, start_previous, end_previous, list_box_id, is_new_customer, user_id):
    """

    :param start:
    :param end:
    :param start_previous:
    :param end_previous:
    :param list_box_id:
    :param is_new_customer:
    :param user_id:
    :return:
    """
    static = {}
    result = _extracted_from_count_customer_3(
        start, end, list_box_id, is_new_customer, user_id
    )
    # print(":now: \n", result)
    result_pre = _extracted_from_count_customer_3(
        start_previous, end_previous, list_box_id, is_new_customer, user_id
    )
    # result_pre = {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}
    get_percent_increase = calcu_cl(result, result_pre)
    percentage, increase = get_percent_increase["percentage"], get_percent_increase["increase"]
    static.update({
        "Total": result,
        "TotalPrevious": result_pre,
        "Percentage": percentage,
        "Increase": increase,
    })
    return static


def _extracted_from_count_customer_3(arg0, arg1, list_box_id, is_new_customer, user_id):
    """

    :param arg0:
    :param arg1:
    :param list_box_id:
    :param is_new_customer:
    :param user_id:
    :return:
    """
    query_customer = {
        "$and":
            [
                {
                    "timestamp": {"$gte": int(arg0), "$lt": int(arg1)}
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

    find_customer = db.find_all(str(config.customerRecord), query_customer)
    emp_listt0 = []
    emp_listt1 = []
    emp_listt2 = []
    emp_listt3 = []
    emp_listt4 = []
    emp_listt5 = []
    emp_listt6 = []
    output_customer = [0, 0, 0, 0, 0, 0, 0]
    for data in find_customer:
        for record in data["listRecord"]:
            day_number_in_week = get_day_number_in_week(data["timestamp"])
            if record["newCustomer"] == is_new_customer:
                if day_number_in_week == 0:
                    emp_listt0.append(data)
                    output_customer[0] = len(emp_listt0)
                elif day_number_in_week == 1:
                    emp_listt1.append(data)
                    output_customer[1] = len(emp_listt1)
                elif day_number_in_week == 2:
                    emp_listt2.append(data)
                    output_customer[2] = len(emp_listt2)
                elif day_number_in_week == 3:
                    emp_listt3.append(data)
                    output_customer[3] = len(emp_listt3)
                elif day_number_in_week == 4:
                    emp_listt4.append(data)
                    output_customer[4] = len(emp_listt4)
                elif day_number_in_week == 5:
                    emp_listt5.append(data)
                    output_customer[5] = len(emp_listt5)
                elif day_number_in_week == 6:
                    emp_listt6.append(data)
                    output_customer[6] = len(emp_listt6)

    return output_customer


def count_customer_day_to_day_v2(date_start, date_end, date_start_previous, list_box_id, is_new_customer, user_id):
    """

    :param date_start:
    :param date_end:
    :param date_start_previous:
    :param list_box_id:
    :param is_new_customer:
    :param user_id:
    :return:
    """
    heatmapData = {}
    heatmapPercentage = {}
    if is_new_customer:
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
    list_data_previous_float = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    day_num = 0
    get_static_data_customer = count_customer(date_start, date_end,
                                              date_start_previous + 86400 * day_num,
                                              date_start_previous + 86400 * day_num + 86400,
                                              list_box_id, is_new_customer, user_id)
    html = get_static_data_customer["Total"]
    css_s = get_static_data_customer["TotalPrevious"]
    for _ in range(int(date_end)):
        if int(date_start) >= int(date_end):
            break
        day_number_of_week = get_day_number_in_week(int(date_start))
        if int(day_number_of_week) == 0:
            list_data_float[0] = html[0]
            list_data_previous_float[0] = css_s[0]
            if get_static_data_customer["Increase"]:
                list_percentage_int[0] = int(get_static_data_customer["Percentage"])
            else:
                list_percentage_int[0] =  -int(get_static_data_customer["Percentage"])
        elif int(day_number_of_week) == 1:
            list_data_float[1] = html[1]
            list_data_previous_float[1] = css_s[1]
            if get_static_data_customer["Increase"]:
                list_percentage_int[1] = int(get_static_data_customer["Percentage"])
            else:
                list_percentage_int[1] = - int(get_static_data_customer["Percentage"])
        elif int(day_number_of_week) == 2:
            list_data_float[2] = html[2]
            list_data_previous_float[2] = css_s[2]
            if get_static_data_customer["Increase"]:
                list_percentage_int[2] = int(get_static_data_customer["Percentage"])
            else:
                list_percentage_int[2] =- int(get_static_data_customer["Percentage"])
        elif int(day_number_of_week) == 3:
            list_data_float[3] = html[3]
            list_data_previous_float[3] = css_s[3]
            if get_static_data_customer["Increase"]:
                list_percentage_int[3] = int(get_static_data_customer["Percentage"])
            else:
                list_percentage_int[3] =- int(get_static_data_customer["Percentage"])
        elif int(day_number_of_week) == 4:
            list_data_float[4] = html[4]
            list_data_previous_float[4] = css_s[4]
            if get_static_data_customer["Increase"]:
                list_percentage_int[4] = int(get_static_data_customer["Percentage"])
            else:
                list_percentage_int[4] = list_percentage_int[4] - int(get_static_data_customer["Percentage"])
        elif int(day_number_of_week) == 5:
            list_data_float[5] = html[5]
            list_data_previous_float[5] = css_s[5]
            if get_static_data_customer["Increase"]:
                list_percentage_int[5] =int(get_static_data_customer["Percentage"])
            else:
                list_percentage_int[5] = - int(get_static_data_customer["Percentage"])
        elif int(day_number_of_week) == 6:
            list_data_float[6] = html[6]
            list_data_previous_float[6] = css_s[6]
            if get_static_data_customer["Increase"]:
                list_percentage_int[6] =int(get_static_data_customer["Percentage"])
            else:
                list_percentage_int[6] = - int(get_static_data_customer["Percentage"])
        date_start = int(date_start) + 86400
    for elem, value in enumerate(list_data_float, start=0):
        list_data[elem] = float(list_data_float[elem])
        list_data_previous_day[elem] = float(
            list_data_previous_float[elem])
        list_percentage[elem] = float(list_percentage_int[elem])
        heatmapData.update({"data": list_data})
        heatmapPercentage.update({"data": list_percentage})
    return {"heatmapData": heatmapData,
            "heatmapPercentage": heatmapPercentage}


def get_rate_day_to_day(first_zone, second_zone, first_zone_previous, second_zone_previous, name):
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
    for elem, clgv in enumerate(first_zone["data"], start=0):
        if str(second_zone["data"][elem]) == "0.00":
            rate_data = 101.0
        else:
            try:
                x = int(float(first_zone["data"][elem]))
                y = int(float(second_zone["data"][elem]))
                rate_data = (x / y) * 100
            except BaseException as error:
                capture_exception(error)

        if str(second_zone_previous["data"][elem]) == "0.00":
            rate_previous = 101.0
        else:
            try:
                x = int(float(first_zone_previous["data"][elem]))
                y = int(float(second_zone_previous["data"][elem]))
                rate_previous = (x / y) * 100
            except BaseException as error:
                capture_exception(error)
        if int(float(rate_data)) == 101 and int(float(rate_previous)) != 101:
            listRatePercentage.append("-100")
        else:
            ratePer = rate_data - rate_previous
            # if ratePer < 0:
            #     print(
            #         "rate_data -  \n {} rate_previous: \n {}".format(rate_data, rate_previous))
            listRatePercentage.append(ratePer)
        listRate.append(rate_data)
        rate.update({"data": listRate})
        ratePercentage2.update({"data": listRatePercentage})
    return rate, ratePercentage2


def get_static_by_week_v2():
    input_args = request.args
    date_start = input_args.get("dateStart")
    date_end = input_args.get("dateEnd")
    if date_start == "" or date_end == "":
        return jsonify({"message": "Datetime cannot be empty"}), 400
    date_end_timestamp = int(date_end) + 86399
    type_previous = input_args.get("previousType")
    user_id = utilities.get_user_info(request.headers["authorization"])

    # get list group
    list_group = get_list_group(input_args.get('groupID'), user_id)

    if not validate_input_datetime(date_start, date_end_timestamp):
        return jsonify({"message": "Wrong input datetime"}), 400

    # list box id
    list_box_id = get_list_box(list_group)

    if len(list_box_id) == 0:
        return jsonify({"message": "Could not found box with user id: {user_id}".format(user_id=user_id)}), 400
    if validate_previous_type(type_previous) is False:
        return jsonify({"message": "Type previous must in {list_pre}".format(list_pre=lst_previous_type)}), 400

    get_time_previous = transform_timestamp_to_find_previous(
        date_start, date_end, type_previous)
    start_previous, end_previous = get_time_previous["start"], get_time_previous["end"]

    abcd = count_pc_day_to_day_v2(
        date_start, date_end_timestamp, start_previous, list_box_id, "way")
    peopleCountInWayFromWeek = abcd["heatmapData"]
    peopleCountInWayPreviousFromWeek = abcd["heatmapDataPrevious"]
    peopleCountInWayPercentageFromWeek = abcd["heatmapPercentage"]
    bcd = count_pc_day_to_day_v2(
        date_start, date_end_timestamp, start_previous, list_box_id, "gate")
    peopleCountInGateFromWeek = bcd["heatmapData"]
    peopleCountInGatePreviousFromWeek = bcd["heatmapDataPrevious"]
    peopleCountInGatePercentageFromWeek = bcd["heatmapPercentage"]

    cd = count_pc_day_to_day_v2(
        date_start, date_end_timestamp, start_previous, list_box_id, "shop")
    peopleCountInShopFromWeek = cd["heatmapData"]
    peopleCountInShopPreviousFromWeek = cd["heatmapDataPrevious"]
    peopleCountInShopPercentageFromWeek = cd["heatmapPercentage"]
    rate1, rate1_percentage = get_rate_day_to_day(
        peopleCountInGateFromWeek, peopleCountInWayFromWeek, peopleCountInGatePreviousFromWeek,
        peopleCountInWayPreviousFromWeek, "Tỉ lệ chuyển đổi 1")
    rate2, rate2_percentage = get_rate_day_to_day(peopleCountInShopFromWeek, peopleCountInGateFromWeek,
                                                  peopleCountInShopPreviousFromWeek, peopleCountInGatePreviousFromWeek,
                                                  "Tỉ lệ chuyển đổi 2")

    get_old_cus = count_customer_day_to_day_v2(
        date_start, date_end_timestamp, start_previous, list_box_id, False, user_id)
    oldCustomer = get_old_cus["heatmapData"]
    oldCustomerPercentage = get_old_cus["heatmapPercentage"]
    get_new_customer = count_customer_day_to_day_v2(
        date_start, date_end_timestamp, start_previous, list_box_id, True, user_id)
    newCustomer = get_new_customer["heatmapData"]
    newCustomerPercentage = get_new_customer["heatmapPercentage"]
    data = [peopleCountInWayFromWeek,
            peopleCountInGateFromWeek, peopleCountInShopFromWeek, rate1, rate2, oldCustomer, newCustomer]
    dataPercentage = [peopleCountInWayPercentageFromWeek,
                      peopleCountInGatePercentageFromWeek, peopleCountInShopPercentageFromWeek, rate1_percentage,
                      rate2_percentage, oldCustomerPercentage, newCustomerPercentage]
    return {"data": data, "dataPercentage": dataPercentage}
