from datetime import datetime
from http import HTTPStatus

from common.constant import ONE_DAY_TIMESTAMP
from common.error_message import ErrorMessageEnum
from flask import jsonify, request
from flask.globals import current_app
from utilities import utilities

from people_counting.get_list_static import (get_static,
                                             list_response_list_static)
from people_counting.service.box_service import get_list_box
from people_counting.service.group_service import get_list_group
from people_counting.service.zone_service import get_list_zone_id
from people_counting.validation.date_time_validation import \
    validate_input_datetime


def list_static_overall():
    """
        :return: {dict}
        """
    current_app.logger.info("Start get list static overall")
    get_input_data = request.args
    date_start = get_input_data.get("dateStart")
    if date_start == "" or date_start == " ":
        current_app.logger.error("Datetime cannot be empty")
        return jsonify({"message": "Datetime cannot be empty"}), HTTPStatus.BAD_REQUEST

    user_id = utilities.get_user_info(request.headers["authorization"])

    date_end_timestamp = datetime.now().timestamp()

    list_group_id = get_list_group(get_input_data.get("groupID"), user_id)
    current_app.logger.info(
        "Get list group id: {list_group_id}".format(list_group_id=list_group_id))

    if not validate_input_datetime(date_start, date_end_timestamp):
        current_app.logger.error("Wrong date time: date_start={date_start}, date_end={date_end}"
                                 .format(date_start=date_start, date_end=str(date_end_timestamp)))

        return jsonify({"message": str(ErrorMessageEnum.WRONG_INPUT_DATE_TIME)}), HTTPStatus.BAD_REQUEST

    list_box_id = get_list_box(list_group_id)
    current_app.logger.info(
        "Get list group id: {list_box_id}".format(list_box_id=list_box_id))

    if not list_box_id:
        current_app.logger.error(
            "Could not found box with user id: {user_id}".format(user_id=user_id))
        return jsonify({"message": "Could not found box with user id: {user_id}".format(user_id=user_id)}), HTTPStatus.BAD_REQUEST

    response = get_list_static_overall(
        date_start, date_end_timestamp, list_box_id)

    return {"data": response}


def get_list_static_overall(date_start, date_end_timestamp, list_box_id):
    date_start_previous = int(date_start) - ONE_DAY_TIMESTAMP
    date_end_previous = date_end_timestamp - ONE_DAY_TIMESTAMP

    return get_static(date_start, date_end_timestamp, date_start_previous, date_end_previous, list_box_id)
