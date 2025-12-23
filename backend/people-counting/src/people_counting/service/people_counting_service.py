from config import config 
from database import db
from people_counting.service.zone_service import get_list_zone_id
from utilities.time_utils import get_day_number_in_week


def count_pc_day_to_day_v2(date_start, date_end,
                           date_start_previous, list_box_id, zone_location):
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

    get_static_data = count_people_v2(int(date_start), int(date_end),
                                      int(date_start_previous),
                                      int(date_start_previous) + 86400,
                                      list_box_id, zone_location)
    total = get_static_data["Total"]
    total_previous = get_static_data["TotalPrevious"]
    for _ in range(int(date_end)):
        if int(date_start) >= int(date_end):
            break
        day_number_of_week = get_day_number_in_week(int(date_start))
        if int(day_number_of_week) == 0:
            list_data_float[0] = total["0"]
            list_data_previous_float[0] = total_previous["0"]
            if get_static_data["Increase"][0]:
                list_percentage_int[0] = int(get_static_data["Percentage"][0])
            else:
                list_percentage_int[0] = - int(get_static_data["Percentage"][0])
        elif int(day_number_of_week) == 1:
            list_data_float[1] = total["1"]
            list_data_previous_float[1] = total_previous["1"]
            if get_static_data["Increase"][1]:
                list_percentage_int[1] = int(get_static_data["Percentage"][1])
            else:
                list_percentage_int[1] = - int(get_static_data["Percentage"][1])
        elif int(day_number_of_week) == 2:
            list_data_float[2] = total["2"]
            list_data_previous_float[2] = total_previous["2"]
            if get_static_data["Increase"][2]:
                list_percentage_int[2] = int(get_static_data["Percentage"][2])
            else:
                list_percentage_int[2] = -  int(get_static_data["Percentage"][2])
        elif int(day_number_of_week) == 3:
            list_data_float[3] = total["3"]
            list_data_previous_float[3] = total_previous["3"]
            if get_static_data["Increase"][3]:
                list_percentage_int[3] = int(get_static_data["Percentage"][3])
            else:
                list_percentage_int[3] = -  int(get_static_data["Percentage"][3])
        elif int(day_number_of_week) == 4:
            list_data_float[4] = total["4"]
            list_data_previous_float[4] = total_previous["4"]
            if get_static_data["Increase"][4]:
                list_percentage_int[4] = int(get_static_data["Percentage"][4])
            else:
                list_percentage_int[4] = - int(get_static_data["Percentage"][4])
        elif int(day_number_of_week) == 5:
            list_data_float[5] = total["5"]
            list_data_previous_float[5] = total_previous["5"]
            if get_static_data["Increase"][5]:
                list_percentage_int[5] = int(get_static_data["Percentage"][5])
            else:
                list_percentage_int[5] = - int(get_static_data["Percentage"][5])
        elif int(day_number_of_week) == 6:
            list_data_float[6] = total["6"]
            list_data_previous_float[6] = total_previous["6"]
            if get_static_data["Increase"][6]:
                list_percentage_int[6] = int(get_static_data["Percentage"][6])
            else:
                list_percentage_int[6] = -  int(get_static_data["Percentage"][6])
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

def count_people_v2(date_start, date_end, date_start_previous,
                    date_end_previous, list_box_id, zone_area):
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
                                                               date_start_previous,
                                                               date_end_previous,
                                                               zone_area)

    else:
        total = count_amount_of_timestamp_by_list_shop_zone(
            list_zone_id, date_start, date_end)
        totalPrevious = count_amount_of_timestamp_by_list_shop_zone(list_zone_id, date_start_previous,
                                                                    date_end_previous)
    get_percent_increase = calculator_percentage2(total, totalPrevious)
    list_percentage, list_increase = get_percent_increase["percentage"], get_percent_increase["increase"]
    static.update({
        "Total": total,
        "TotalPrevious": totalPrevious,
        "Percentage": list_percentage,
        "Increase": list_increase,
    })
    return static

def count_amount_of_timestamp_by_list_zone(list_zone_id, date_start, date_end, location):
    """
        :param list_zone_id:
        :param date_start:
        :param date_end:
        :param location:
        :return:
    """
    query = {
        "$and": [
            {
                "timestamp": {"$gte": int(date_start), "$lt": int(date_end)}
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
    """
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
                        "hour": {"$in": [i for i in range(7, 24)]},
                        "dwellTime": {"$gte": 15, "$lte": 120}
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

def calculator_percentage2(now_data, previous):
    """
        Calculator percentage
        :params: {now_data}, {previous}
        :returns: {bool}, {float}
    """
    list_percentage = []
    list_increase = []

    for key, now in now_data.items():
        pre = previous[key]
        if int(pre) == 0:
            increase = True
            percentage = 100000001
        elif int(now) < int(pre):
            increase = False
            percentage = ((int(pre) - int(now)) / int(pre)) * 100
        else:
            increase = True
            percentage = ((int(now) - int(pre)) / int(pre)) * 100
        
        list_percentage.append(percentage)
        list_increase.append(increase)
    return {"percentage": list_percentage, "increase": list_increase}