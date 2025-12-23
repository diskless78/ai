# -*- coding: utf-8 -*-
"""import necessary library, folder in project"""
import datetime
import socket
from http import HTTPStatus

from flask.globals import current_app

from common.constant import DEFAULT_PERCENT, ONE_DAY_TIMESTAMP
from common.error_message import ErrorMessageEnum
from config import config
from database import db
from flask import jsonify, request
from sentry_sdk import capture_exception, init
from sentry_sdk.integrations.flask import FlaskIntegration
from utilities import utilities

from people_counting.service.box_service import get_list_box
from people_counting.service.group_service import get_list_group
# from people_counting.service.people_counting_service import count_pc_day_to_day_v2
from people_counting.validation.date_time_validation import \
    validate_input_datetime
from people_counting.validation.previous_type_validation import (
    LIST_PREVIOUS_TYPE, validate_previous_type)
from people_counting.count_by_weekend_previous_day import response_get_static_by_week_yesterday
init(
    dsn=str(config.CLIENT_KEYS),
    integrations=[FlaskIntegration()],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0,

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
LISTHOURS = utilities.lst_hours(6, 23)

# list previous type
list_previous_type = ["yesterday", "lastWeek", "last14Days", "lastMonth"]


def get_list_group(group_id, user_id):
    """
        :param group_id:
        :param user_id:
        :return: {list}
    """
    if group_id is not None and group_id != "":
        return group_id.split(",")
    find_group = db.find_all(str(config.group), {"userid": user_id})
    return [group_id["id"] for group_id in find_group]


def validate_input_datetime(date_start, date_end):
    """
        :param date_start:
        :param date_end:
        :return: {bool}
    """
    # validate datetime input

    return (
        int(date_start) != 0
        and int(date_end) != 86400
        and int(date_end) >= int(date_start)
    )


def get_list_box(list_group):
    """
        :param list_group:
        :return: {list}
    """
    query_find_box = {
        "group": {"$in": list_group}
    }
    find_box_data = db.find_all(str(config.boxAI), query_find_box)

    return [box["id"] for box in find_box_data]


def validate_previous_type(type_previous):
    """
        :param type_previous:
        :return: {bool}
    """
    return type_previous in list_previous_type


def transform_timestamp_to_find_previous(start, end, previous_type):
    """
        :param start:
        :param end:
        :param previous_type:
        :return: {int}, {int}
    """
    if previous_type == "yesterday":
        return {"start": int(start) - 86400, "end": int(start)}
    elif previous_type == "lastWeek":
        return {"start": int(start) - (7 * 86400), "end": int(end) - (7 * 86400)}
    elif previous_type == "last14Days":
        return {"start": int(start) - (14 * 86400), "end": int(start)}
    else:
        return {"start": int(start) - (30 * 86400), "end": int(start)}


def get_list_zone_id(list_box_id, location):
    """
        :param list_box_id:
        :param location:
        :return:
    """
    query = {
        "boxID": {"$in": list_box_id},
        "location": location
    }
    result = db.find_all(str(config.zone), query)
    return [zone_id["id"] for zone_id in result]


def get_day_number_in_week(date_start):
    """
        :param date_start:
        :return:
    """
    timestamp_to_date = utilities.convert_timestamp_to_date(int(date_start))
    return datetime.datetime.strptime(
        timestamp_to_date, "%Y-%m-%d").weekday()


def count_amount_of_timestamp_by_list_zone(list_zone_id, date_start, date_end, location):
    """
        :param list_zone_id:
        :param date_start:
        :param date_end:
        :param location:
        :return:
    """
    query = {
        # "$and": [
        #     {
        "timestamp": {"$gte": int(date_start), "$lte": int(date_end)}
        # },
        # {
        #     "data": {
        #         "$elemMatch": {         #             "hour": {"$in": [i for i in range(7, 24)]}
        #         }
        #     }
        # }
        # ]
    }
    # convert timestamp to day number
    result = db.find_all(str(config.peopleCountingHistory), query)
    output = [0, 0, 0, 0, 0, 0, 0]
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
                    and str(data["location"]) != "shop"
                    and data["hour"] in lst_hour
                    # and int(date_start) <= data["timestamp"] < int(date_end)
            ) and int(date_end) >= data["timestamp"] >= int(date_start):
                if day_number_in_week == 0:
                    emp_list0.append(data)
                    output[0] = len(emp_list0)
                elif day_number_in_week == 1:
                    emp_list1.append(data)
                    output[1] = len(emp_list1)
                elif day_number_in_week == 2:
                    emp_list2.append(data)
                    output[2] = len(emp_list2)
                elif day_number_in_week == 3:
                    emp_list3.append(data)
                    output[3] = len(emp_list3)
                elif day_number_in_week == 4:
                    emp_list4.append(data)
                    output[4] = len(emp_list4)
                elif day_number_in_week == 5:
                    emp_list5.append(data)
                    output[5] = len(emp_list5)
                elif day_number_in_week == 6:
                    emp_list6.append(data)
                    output[6] = len(emp_list6)
    return output


def count_amount_of_timestamp_by_list_shop_zone(list_zone_id, date_start, date_end):
    """
        Count data in zone with location == shop
        :parameter: {list_zone_id}, {date_start}, {date_end}
        :return: {int}
    """
    query = {
        # "$and": [
        #     {
        "timestamp": {"$gte": int(date_start), "$lte": int(date_end)}
        #     },
        #     {
        #         "data": {
        #             "$elemMatch": {
        #                 "zone_id": {"$in": list_zone_id},
        #                 "hour": {"$in": [i for i in range(7, 24)]}
        #             }
        #         }
        #     }
        # ]
    }
    lst_hour = [i for i in range(7, 24)]
    output2 = [0, 0, 0, 0, 0, 0, 0]
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
            if (int(date_end) >= rec["timestamp"] >= int(date_start) and
                    120 >= data["dwellTime"] >= 15
                    and data["hour"] in lst_hour
                    # and int(date_end) >= rec["timestamp"] >= int(date_start)
                    and data["location"] == "shop"
                    and int(date_end) >= data["timestamp"] >= int(date_start)):
                if day_number_in_week == 0:
                    emp_listt0.append(data)
                    output2[0] = len(emp_listt0)
                elif day_number_in_week == 1:
                    emp_listt1.append(data)
                    output2[1] = len(emp_listt1)
                elif day_number_in_week == 2:
                    emp_listt2.append(data)
                    output2[2] = len(emp_listt2)
                elif day_number_in_week == 3:
                    emp_listt3.append(data)
                    output2[3] = len(emp_listt3)
                elif day_number_in_week == 4:
                    emp_listt4.append(data)
                    output2[4] = len(emp_listt4)
                elif day_number_in_week == 5:
                    emp_listt5.append(data)
                    output2[5] = len(emp_listt5)
                elif day_number_in_week == 6:
                    emp_listt6.append(data)
                    output2[6] = len(emp_listt6)
    return output2


def calculate_percent(now, pre, previous_type):
    """
        :param now:
        :param pre:
        :return: {"percentage": percentage, "increase": increase} -> dictionary
    """
    list_percentage = []
    list_increase = []
    for i in range(len(pre)):
        if i > len(pre):
            break
        if pre[i] == 0:
            increase = True
            percentage = 100000001.0
        elif pre[i] > now[i]:
            increase = False
            percentage = (
                (int(pre[i]) - int(now[i])) / int(pre[i])) * 100
        else:
            increase = True
            percentage = ((int(now[i]) - int(pre[i])) / int(pre[i])) * 100
        list_percentage.append(percentage)
        list_increase.append(increase)
    return {"percentage": list_percentage, "increase": list_increase}


def count_people_v2(date_start, date_end, date_start_previous,
                    date_end_previous, list_box_id, zone_area, previous_type):
    """
        :param date_start:
        :param date_end:
        :param date_start_previous:
        :param date_end_previous:
        :param list_box_id:
        :param zone_area:
        :param previous_type:
        :return:
    """
    current_app.logger.info("Start get static from startDate={start} to endDate={end}"
                            .format(start=date_start, end=date_end))
    current_app.logger.info("Start get static from startPreDate={start} to endPreDate={end}"
                            .format(start=date_start_previous, end=date_end_previous))
    static = {}
    # find list zone id
    list_zone_id = get_list_zone_id(list_box_id, zone_area)
    if zone_area != "shop":
        total = count_amount_of_timestamp_by_list_zone(list_zone_id,
                                                       date_start, date_end, zone_area)
        totalPrevious = count_amount_of_timestamp_by_list_zone(list_zone_id,
                                                               date_start_previous,
                                                               date_end_previous,
                                                               zone_area)
    else:
        total = count_amount_of_timestamp_by_list_shop_zone(
            list_zone_id, date_start, date_end)
        totalPrevious = count_amount_of_timestamp_by_list_shop_zone(list_zone_id, date_start_previous,
                                                                    date_end_previous)
    get_percent_increase = calculate_percent(
        total, totalPrevious, previous_type)
    percentages, increases = get_percent_increase["percentage"], get_percent_increase["increase"]
    static.update({
        "Total": total,
        "TotalPrevious": totalPrevious,
        "Percentage": percentages,
        "Increase": increases,
    })
    return static


def count_pc_day_to_day_v2(date_start, date_end,
                           date_start_previous, date_end_previous, list_box_id, zone_location, previous_type):
    """
        :param date_start:
        :param date_end:
        :param date_start_previous:
        :param date_end_previous:
        :param list_box_id:
        :param zone_location:
        :param previous_type:
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
    get_static_data = count_people_v2(int(date_start), int(date_end),
                                      int(date_start_previous),
                                      int(date_end_previous),
                                      list_box_id, zone_location, previous_type)
    html = get_static_data["Total"]
    css_s = get_static_data["TotalPrevious"]
    for i in range(len(css_s)):
        if i >= len(css_s):
            break
        list_data_previous_float[i] = css_s[i]

    for index in range(len(html)):
        if index >= len(html):
            break
        list_data_float[index] = html[index]
        if get_static_data["Increase"][index]:
            list_percentage_int[index] = int(
                get_static_data["Percentage"][index])
        else:
            list_percentage_int[index] = - \
                int(get_static_data["Percentage"][index])

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


def count_customer(start, end, start_previous, end_previous, list_box_id, is_new_customer, previous_type):
    """
        :param start:
        :param end:
        :param start_previous:
        :param end_previous:
        :param list_box_id:
        :param is_new_customer:
        :return: {static} -> dict
    """
    static = {}
    result = _extracted_from_count_customer_3(
        start, end, list_box_id, is_new_customer
    )
    result_pre = _extracted_from_count_customer_3(
        start_previous, end_previous, list_box_id, is_new_customer
    )
    # result_pre = {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}
    get_percent_increase = calculate_percent(result, result_pre, previous_type)
    percentage, increase = get_percent_increase["percentage"], get_percent_increase["increase"]
    static.update({
        "Total": result,
        "TotalPrevious": result_pre,
        "Percentage": percentage,
        "Increase": increase,
    })
    return static


def _extracted_from_count_customer_3(start, end, list_box_id, is_new_customer):
    """
        :param arg0:
        :param arg1:
        :param list_box_id:
        :param is_new_customer:
        :return:
    """
    query_customer = {
        "$and":
            [
                {
                    "timestamp": {"$gte": int(start), "$lte": int(end)}
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
            if int(start) <= record["timestamp"] <= int(end):
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


def count_customer_day_to_day_v2(date_start, date_end, date_start_previous,
                                 date_end_previous,
                                 list_box_id, is_new_customer, previous_type):
    """
        :param date_start:
        :param date_end:
        :param date_start_previous:
        :param date_end_previous:
        :param list_box_id:
        :param is_new_customer:
        :param previous_type:
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
    get_static_data_customer = count_customer(date_start,
                                              date_end,
                                              date_start_previous,
                                              date_end_previous,
                                              list_box_id,
                                              is_new_customer, previous_type)
    html = get_static_data_customer["Total"]
    css_s = get_static_data_customer["TotalPrevious"]
    for i in range(len(css_s)):
        if i >= len(css_s):
            break
        list_data_previous_float[i] = css_s[i]

    for index in range(len(html)):
        if index >= len(html):
            break
        list_data_float[index] = html[index]
        if get_static_data_customer["Increase"][index]:
            list_percentage_int[index] = int(
                get_static_data_customer["Percentage"][index])
        else:
            list_percentage_int[index] = - \
                int(get_static_data_customer["Percentage"][index])

    for elem in range(len(list_data_float)):
        if elem >= len(list_data_float):
            break
        list_data[elem] = "{:.2f}".format(list_data_float[elem])
        list_data_previous_day[elem] = "{:.2f}".format(
            list_data_previous_float[elem])
        list_percentage[elem] = "{:.2f}".format(list_percentage_int[elem])
    heatmapData.update({"data": list_data})
    heatmapPercentage.update({"data": list_percentage})
    return {"heatmapData": heatmapData,
            "heatmapPercentage": heatmapPercentage}


def get_rate_day_to_day(first_zone, second_zone, first_zone_previous,
                        second_zone_previous, name, previous_type):  # sourcery no-metrics
    """
        :param first_zone:
        :param second_zone:
        :param first_zone_previous:
        :param second_zone_previous:
        :param name:
        :return: {list}, {list}
    """
    rate = {}
    ratePercentage = {}
    listRate = []
    listRatePercentage = []
    rate_data = 0.0
    rate_previous = 0.0
    rate.update({"name": name})
    ratePercentage.update({"name": name})
    for elem in range(len(second_zone_previous["data"])):
        if elem >= len(second_zone_previous["data"]):
            break
        if str(second_zone["data"][elem]) == "0.00":
            rate_data = 100000001.0
        else:
            try:
                x = float(first_zone["data"][elem])
                y = float(second_zone["data"][elem])
                rate_data = (x / y) * 100
            except BaseException as error:
                capture_exception(error)
        listRate.append(rate_data)
        if str(second_zone_previous["data"][elem]) == "0.00":
            rate_previous = 100000001.0
        else:
            try:
                x = float(first_zone_previous["data"][elem])
                y = float(second_zone_previous["data"][elem])
                rate_previous = (x / y) * 100
            except BaseException as error:
                capture_exception(error)
        if int(rate_data) == DEFAULT_PERCENT and int(rate_previous) != DEFAULT_PERCENT:
            rate_per = -100.0
        elif int(rate_data) != DEFAULT_PERCENT and int(rate_previous) == DEFAULT_PERCENT:
            rate_per = 0.0
        else:
            rate_per = rate_data - rate_previous
        listRatePercentage.append(str(rate_per))
    rate.update({"data": listRate})
    ratePercentage.update({"data": listRatePercentage})
    return rate, ratePercentage


def response_get_static_by_week(date_start, date_end, type_previous,
                                list_box_id, previous_type):
    """
        :param date_start:
        :param date_end:
        :param type_previous:
        :param list_box_id:
        :return:  {"data": data, "dataPercentage": dataPercentage} -> dict
    """
    get_time_previous = transform_timestamp_to_find_previous(
        date_start, date_end, type_previous)

    current_app.logger.info(get_time_previous)

    start_previous = get_time_previous["start"]
    end_previous = get_time_previous["end"]
    wayCountByFuckingWeek = count_pc_day_to_day_v2(
        date_start, date_end,
        start_previous, end_previous, list_box_id,
        "way", previous_type)
    peopleCountInWayFromWeek = wayCountByFuckingWeek["heatmapData"]
    peopleCountInWayPreviousFromWeek = wayCountByFuckingWeek["heatmapDataPrevious"]
    peopleCountInWayPercentageFromWeek = wayCountByFuckingWeek["heatmapPercentage"]
    gateCountByFuckingWeek = count_pc_day_to_day_v2(
        date_start, date_end, start_previous, end_previous, list_box_id, "gate", previous_type)
    peopleCountInGateFromWeek = gateCountByFuckingWeek["heatmapData"]
    peopleCountInGatePreviousFromWeek = gateCountByFuckingWeek["heatmapDataPrevious"]
    peopleCountInGatePercentageFromWeek = gateCountByFuckingWeek["heatmapPercentage"]

    shopCountByFuckingWeek = count_pc_day_to_day_v2(
        date_start, date_end, start_previous, end_previous, list_box_id, "shop", previous_type)
    peopleCountInShopFromWeek = shopCountByFuckingWeek["heatmapData"]
    peopleCountInShopPreviousFromWeek = shopCountByFuckingWeek["heatmapDataPrevious"]
    peopleCountInShopPercentageFromWeek = shopCountByFuckingWeek["heatmapPercentage"]
    rate1, rate1_percentage = get_rate_day_to_day(
        peopleCountInGateFromWeek, peopleCountInWayFromWeek, peopleCountInGatePreviousFromWeek,
        peopleCountInWayPreviousFromWeek, "Tỉ lệ chuyển đổi 1", type_previous)
    rate2, rate2_percentage = get_rate_day_to_day(peopleCountInShopFromWeek,
                                                  peopleCountInGateFromWeek,
                                                  peopleCountInShopPreviousFromWeek,
                                                  peopleCountInGatePreviousFromWeek,
                                                  "Tỉ lệ chuyển đổi 2", type_previous)

    get_old_cus = count_customer_day_to_day_v2(
        date_start, date_end, start_previous, end_previous, list_box_id, False, previous_type)
    oldCustomer = get_old_cus["heatmapData"]
    oldCustomerPercentage = get_old_cus["heatmapPercentage"]
    get_new_customer = count_customer_day_to_day_v2(
        date_start, date_end, start_previous, end_previous, list_box_id, True, previous_type)
    newCustomer = get_new_customer["heatmapData"]
    newCustomerPercentage = get_new_customer["heatmapPercentage"]
    data = [peopleCountInWayFromWeek,
            peopleCountInGateFromWeek,
            peopleCountInShopFromWeek,
            rate1, rate2, oldCustomer,
            newCustomer]
    dataPercentage = [peopleCountInWayPercentageFromWeek,
                      peopleCountInGatePercentageFromWeek,
                      peopleCountInShopPercentageFromWeek,
                      rate1_percentage,
                      rate2_percentage,
                      oldCustomerPercentage,
                      newCustomerPercentage]
    return {"data": data, "dataPercentage": dataPercentage}


def get_static_by_week_v2():
    """
        :return: display data after calculate
    """
    input_args = request.args
    date_start = input_args.get("dateStart")
    date_end = input_args.get("dateEnd")
    if date_start == "" or date_end == "":
        return jsonify({"message": "Datetime cannot be empty"}), HTTPStatus.BAD_REQUEST
    date_end_timestamp = int(date_end) + 86400
    type_previous = input_args.get("previousType")
    user_id = utilities.get_user_info(request.headers["authorization"])

    # get list group
    list_group = get_list_group(input_args.get('groupID'), user_id)
    if (
            type_previous == "yesterday"
            and not validate_input_datetime(date_start, date_end_timestamp)
            or type_previous != "yesterday"
            and not validate_input_datetime(date_start, date_end)
    ):
        return jsonify({"message": str(ErrorMessageEnum.WRONG_INPUT_DATE_TIME)}), HTTPStatus.BAD_REQUEST
    # list box id
    list_box_id = get_list_box(list_group)
    if not list_box_id:
        return jsonify(
            {"message": "Could not found box with user id: {user_id}".format(user_id=user_id)}), HTTPStatus.BAD_REQUEST
    if validate_previous_type(type_previous) is False:
        return jsonify(
            {"message": "Type previous must in {list_pre}".format(list_pre=LIST_PREVIOUS_TYPE)}), HTTPStatus.BAD_REQUEST
    if type_previous == "yesterday":
        response = response_get_static_by_week_yesterday(date_start, date_end, type_previous,
                                               date_end_timestamp,
                                               list_box_id)
        print("previous")
    else:
        response = response_get_static_by_week(date_start, date_end,
                                               type_previous,
                                               list_box_id, type_previous)
    return {"data": response["data"], "dataPercentage": response["dataPercentage"]}
