# -*- coding: utf-8 -*-
"""import necessary lib"""
import datetime
import json
import logging
import math
import socket
import sys

from config import config
from confluent_kafka import Consumer
from database import db
from sentry_sdk import capture_exception, capture_message, init
from sentry_sdk.integrations.flask import FlaskIntegration
from utilities import utilities

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
sys.path.insert(0, '')

# Local ip
IP = socket.gethostbyname(socket.gethostname())
# Timestamp
ASCTIME = datetime.datetime.now()

TOPIC = config.KAFKA_TOPIC
# Telegram setup
CHAT_ID = config.chat_id


## SAMPLE MESSAGE RECEIVE FROM KAFKA##
##  {                               ##
##    "box_id": string,             ##
##    "cam_id": string,             ##
##    "zone_id": string,            ##
##    "direction_id": string,       ##
##    "dwell_time": int,            ##
##    "timestamp": int              ##
##   }                              ##
######################################


def validate_input(field_input, data, collection):
    """
        Validate input
        :param field_input:
        :param data:
        :param collection:
        :return:
    """
    query_data = {
        "$and": [
            {field_input[0]: data[0]},
            {field_input[1]: data[1]}
        ]
    }
    return int(db.count_record(collection, query_data))


def convert_special_datetime(timestamp):
    """
        Convert datetime
        :param timestamp:
        :return:
    """
    # convert input timestamp to datetime
    convert_timestamp_to_datetime = utilities.convert_timestamp(
        int(timestamp))

    # get special date
    get_special_datetime = datetime.datetime.strptime(
        convert_timestamp_to_datetime,
        "%Y-%m-%d %H:%M:%S").date()

    # get special hour
    hour = datetime.datetime.strptime(
        convert_timestamp_to_datetime,
        "%Y-%m-%d %H:%M:%S").hour
    month = datetime.datetime.strptime(
        convert_timestamp_to_datetime,
        "%Y-%m-%d %H:%M:%S").month

    # get full date to find record in tbl_people_counting_history
    get_full_date = str(
        get_special_datetime.strftime("%Y-%m-%d")) + " 00:00:00.000"

    # convert full date in 00:00:00 to timestamp
    timestamp_convert_full_date = math.ceil(
        utilities.convert_datetime_to_timestamp(get_full_date))
    return {
        "timestamp_convert_full_date": timestamp_convert_full_date,
        "hour": hour,
        "month": month
    }


def get_date_time(timestamp):
    """
        Get datetime
        :param timestamp:
        :return:
    """
    try:
        return convert_special_datetime(timestamp)
    except BaseException as err:
        print(err)
        capture_exception(err)
        utilities.push_notify_telegram(CHAT_ID, err)


def update_data(data, timestamp, find_zone):
    """
        Update data in record
        :param data:
        :param timestamp:
        :return:
    """
    time_stamp = get_date_time(data["timestamp"])
    query_update_record = {
        "$and": [
            {"camID": data["cam_id"]},
            {"boxID": data["box_id"]},
            {"timestamp": int(
                timestamp)},
            # use $elemMatch in mongoDB to find zone_info.id == zone_id on list_zone array
            {"data": {"$exists": True}}
        ]
    }
    if find_zone:
        necessary_data = {
            "dwellTime": data["dwell_time"],
            "timestamp": data["timestamp"],
            "hour": time_stamp["hour"],
            "zone_id": data["zone_id"],
            "location": find_zone["location"],
            "name": find_zone["name"]
        }
        db.push_data_document(str(config.peopleCountingHistory),
                              query_update_record, necessary_data)
    else:
        msg = "This zone does not have any location"
        utilities.push_notify_telegram(CHAT_ID, msg)


def insert_data(data, timestamp, group_id,
                time_stamp, find_zone):
    """
        insert data
        :param data:
        :param timestamp:
        :param group_id:
        :param time_stamp:
        :param find_zone:
        :return:
    """
    input_data = {
        "camID": data["cam_id"],
        "boxID": data["box_id"],
        "timestamp": timestamp,
        "groupID": group_id["id"],
        "data": [{"dwellTime": data["dwell_time"],
                  "timestamp": data["timestamp"],
                  "hour": time_stamp["hour"],
                  "zone_id": data["zone_id"],
                  "location": find_zone["location"],
                  "name": find_zone["name"]}]
    }
    db.add_document(str(config.peopleCountingHistory), input_data)


def parse_data(data):
    """
        :param data:
        :return:
    """
    processed_timestamp = get_date_time(data["timestamp"])
    timestamp_begin_of_day = processed_timestamp["timestamp_convert_full_date"]
    query_find_pc_record = {
        "camID": data["cam_id"],
        "boxID": data["box_id"],
        "timestamp": timestamp_begin_of_day
    }
    find_pc_record = db.find_all(str(config.peopleCountingHistory),
                                 query_find_pc_record,
                                 order="id")
    list_record = [record for record in find_pc_record]
    # insert default data if that day does not have any record
    box = db.find_one(config.boxAI, {"id": data["box_id"]})
    if box:
        find_zone = db.find_one(config.zone, {"id": data["zone_id"]}, None)
        group_id = db.find_one(config.group, {"id": box["group"]})
        if len(list_record) <= 0:
            insert_data(data, timestamp_begin_of_day, group_id,
                        processed_timestamp, find_zone)
            print("Update data success")
        else:
            # update data from kafka
            # if that day already have record with timestamp above
            update_data(data, timestamp_begin_of_day, find_zone)
            print("Update data success")
    else:
        msg = "Could not found any group own box with id {boxID}".format(
            boxID=data["box_id"])
        capture_message(msg)


def validate_information(data):
    """
        :param data:
        :return:
    """
    print(f"""Start consume message CamID {data["cam_id"]} boxID {data["box_id"]}""")

    field_input = ["id", "boxID"]
    data_input = [data["cam_id"], data["box_id"]]
    # validate cam and box with id from kafka message
    total_camera = validate_input(
        field_input, data_input, str(config.camera))

    if total_camera == 0:
        msg_error_cam_box = "Could not found cam with id {cam_id} in box {box_id}".format(
            cam_id=data["cam_id"], box_id=data["box_id"])
        logging.error(msg_error_cam_box)
        capture_message(msg_error_cam_box)

    else:
        zone_validate = ["id", "camID"]
        input_data = [data["zone_id"], data["cam_id"]]
        # validate zone, cam with id from kafka
        total_zone = validate_input(
            zone_validate, input_data, str(config.zone))

        if total_zone == 0:
            msg_error_zone = "Could not found zone with id {zone_id} in cam {cam_id}".format(
                zone_id=data["zone_id"], cam_id=data["cam_id"])
            logging.error(msg_error_zone)
            capture_message(msg_error_zone)
        else:
            # parse data => ready for inserting or updating data into database
            parse_data(data)


def validate_input_message(msg_receive_kafka):
    """
        Validate data from kafka
        :param msg_receive_kafka:
        :return:
    """
    if msg_receive_kafka["box_id"] is None and \
            str(msg_receive_kafka["box_id"]) == "" \
            or msg_receive_kafka["cam_id"] is None \
            and str(msg_receive_kafka["cam_id"]) == "":
        msg_cam_box_err = "Cam ID or Box ID does not exists!"
        content_error_log = "{IP} -- [{ASCTIME}] ''Error: ' - {err}".format(IP=IP, ASCTIME=ASCTIME,
                                                                            err=msg_cam_box_err)
        capture_message(content_error_log)
        utilities.push_notify_telegram(CHAT_ID,
                                       content_error_log)
    else:
        validate_information(msg_receive_kafka)


def handle_data_kafka():
    """Handle data"""
    try:
        return consume_data_kafka()
    except BaseException as err:
        capture_exception(err)
        utilities.push_notify_telegram(CHAT_ID, err)


def consume_data_kafka():
    """
        Connect and consume data from kafka
    """
    # connect kafka
    connect = Consumer({
        'bootstrap.servers': config.KAFKA_BROKER,
        'group.id': config.GROUP_ID,
        'auto.offset.reset': 'latest'
    })
    # consume TOPIC
    connect.subscribe(
        [config.KAFKA_TOPIC])
    is_connect = True
    while is_connect:
        msg = connect.poll(0.5)
        if msg is None:
            capture_message(str(msg))
            continue
        if msg.error():
            msg_none_error_log = "{IP} -- [{ASCTIME}] ' 'Error: ' - {err}".format(
                IP=IP, ASCTIME=ASCTIME,
                err=msg.error())
            # write log and push in telegram bot when message is None or error
            capture_message(msg_none_error_log)
            utilities.push_notify_telegram(
                CHAT_ID, msg_none_error_log)
            continue
        else:
            # parse json data from kafka
            msg_receive_kafka = json.loads(msg.value().decode('utf-8'))
            validate_input_message(msg_receive_kafka)
        continue
    connect.close()
