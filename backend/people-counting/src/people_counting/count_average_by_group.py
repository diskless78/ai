from common import constant
from common.error_message import ErrorMessageEnum
from config import config
from database import db
from flask import request
from flask.globals import current_app
from utilities import utilities
from utilities.time_utils import later_timestamp_of_day

from people_counting.service.group_service import (get_group_by_list_group_id,
                                                   get_list_group)
from people_counting.validation.date_time_validation import \
    validate_input_datetime


def count_average_by_group():
    data_input = request.args
    date_start = data_input.get('dateStart')
    date_end = data_input.get('dateEnd')

    if not validate_input_datetime(date_start, date_end):
        return {
            "message": str(ErrorMessageEnum.WRONG_INPUT_DATE_TIME)
        }, 400

    user_id = utilities.get_user_info(request.headers["authorization"])

    list_group_id = get_list_group(data_input.get('groupID'), user_id)

    return count_people(date_start, date_end, list_group_id)


def count_people(date_start, date_end, list_group_id):
    if date_start == date_end:
        date_end = later_timestamp_of_day(int(date_start))

    query_by_list_group_id = {
        "$and": [
            {
                "groupID": {"$in": list_group_id}
            },
            {
                "timestamp": {"$lte": int(date_end), "$gte": int(date_start)}
            }

        ]
    }

    current_app.logger.info("Query all people in list group: {query}"
                            .format(query=query_by_list_group_id))

    list_group_result = db.find_all(
        str(config.peopleCountingHistory), query_by_list_group_id)

    list_group = get_group_by_list_group_id(list_group_id)

    dict_people_by_group = dict.fromkeys(list_group_id, [])

    for group in list_group_result:
        for id in list_group_id:
            if group["groupID"] == id:
                dict_people_by_group.update({
                    id: dict_people_by_group[id] + group["data"]
                })

    list_average_response = []

    for group_id in dict_people_by_group:
        list_average_response.append(calculate_average(
            dict_people_by_group[group_id],
            get_group_name_by_id(group_id, list_group)
        )
        )

    return {"data": list_average_response}


def calculate_average(list_people, group_name):
    calculate_response = {
        "name": group_name,
        "comeIn": 0,
        "passer": 0,
        "averageTime": 0,
        "rate": constant.DEFAULT_PERCENT
    }

    for people in list_people:
        if people["location"] == constant.LOCATION_GATE:
            calculate_response["comeIn"] += 1

        if people["location"] == constant.LOCATION_WAY:
            calculate_response["passer"] += 1

        calculate_response["averageTime"] += people["dwellTime"]

    calculate_response["rate"] = calculate_rate(
        calculate_response["comeIn"],
        calculate_response["passer"]
    )

    if len(list_people) > 0:
        calculate_response["averageTime"] = calculate_response["averageTime"] / \
            len(list_people)

    return calculate_response


def get_group_name_by_id(id, list_group):
    for group in list_group:
        if group["id"] == id:
            return group["name"]

    return constant.EMPTY_STRING


def calculate_rate(first, second):
    # get first rate
    if second == 0:
        return constant.DEFAULT_PERCENT
    else:
        return (first / second) * 100
