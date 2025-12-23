from datetime import datetime
from http import HTTPStatus

from common.error_message import ErrorMessageEnum
from config import config
from database import db
from flask import jsonify, request
from flask.globals import current_app
from utilities import utilities
from utilities.time_utils import later_timestamp_of_day

from people_counting.service.box_service import get_list_box
from people_counting.service.group_service import get_list_group
from people_counting.validation.date_time_validation import (
    is_valid_date_range, validate_input_datetime)


def count_by_date_range():
    data_input = request.args
    date_start = data_input.get('dateStart')
    date_end = data_input.get('dateEnd')

    if not validate_input_datetime(date_start, date_end):
        return {
            "message": str(ErrorMessageEnum.WRONG_INPUT_DATE_TIME)
        }, HTTPStatus.BAD_REQUEST

    date_start_int = int(date_start)
    date_end_int = int(date_end)

    if not is_valid_date_range(date_start_int, date_end_int):
        return {
            "message": str(ErrorMessageEnum.INVALID_DATE_RANGE)
        }, HTTPStatus.BAD_REQUEST

    user_id = utilities.get_user_info(request.headers["authorization"])

    list_group = get_list_group(data_input.get('groupID'), user_id)

    list_box_id = get_list_box(list_group)
    if not list_box_id:
        return jsonify({"message": "This group does not belong any box"}), HTTPStatus.OK

    return count_people_in_date_ranges(date_start_int, date_end_int, list_box_id)


def count_people_in_date_ranges(date_start, date_end, list_box_id):
    if date_end < later_timestamp_of_day(date_start):
        date_end = later_timestamp_of_day(date_start)

    query = {
        "$and": [
            {
                "boxID": {"$in": list_box_id}
            },
            {
                "data": {
                    "$elemMatch": {
                        "timestamp": {"$lte": int(date_end), "$gte": int(date_start)},
                    }
                }
            }
        ]
    }

    people_counting_result = db.find_all(
        str(config.peopleCountingHistory), query)

    list_people = []
    for people_counting_record in people_counting_result:
        list_people += people_counting_record["data"]

    list_count_people_by_day = []
    while date_start <= date_end:
        count_people_in_day = 0
        later_time = later_timestamp_of_day(date_start)

        current_app.logger.info("Counting from {start} to {end}"
                                .format(start=datetime.fromtimestamp(date_start), end=datetime.fromtimestamp(later_time)))

        for people in list_people:
            if people["timestamp"] >= date_start and people["timestamp"] <= later_time and people["location"] == "gate":
                count_people_in_day += 1
        list_count_people_by_day.append(count_people_in_day)
        date_start = int(later_time) + 1

    return {"data": list_count_people_by_day}
