# -*- coding: utf-8 -*-

import datetime
import json
import logging
import math
import socket
import sys

from confluent_kafka import Consumer
# import init keys and capture exception from sentry sdk
from sentry_sdk import init, capture_exception, capture_message

from config import config
from database import db
from utilities import utilities

# init client key from sentry
init(config.CLIENT_KEYS)
sys.path.insert(0, '')

# Local ip
ip = socket.gethostbyname(socket.gethostname())
# Timestamp
asctime = datetime.datetime.now()

# regex email for register account
regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'

topic = config.KAFKA_TOPIC
# Telegram setup
chat_id = config.chat_id


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
    query_data = {
        "$and": [
            {field_input[0]: data[0]},
            {field_input[1]: data[1]}
        ]
    }
    return int(db.count_record(collection, query_data))


def get_date_time(timestamp):
    try:
        return _extracted_from_get_date_time_4(timestamp)
    except BaseException as err:
        capture_exception(err)
        utilities.push_notify_telegram(config.chat_id, err)
        return err


def _extracted_from_get_date_time_4(timestamp):
    # convert input timestamp to datetime
    convert_timestamp_to_datetime = utilities.convert_timestamp(
        int(timestamp))

    # get special date
    convert_date_to_timestamp_to_date_special = datetime.datetime.strptime(
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
        convert_date_to_timestamp_to_date_special.strftime("%Y-%m-%d")) + " 00:00:00"

    # convert full date in 00:00:00 to timestamp
    timestamp_convert_full_date = math.ceil(
        utilities.convert_datetime_to_timestamp(get_full_date))
    return {
        "timestamp_convert_full_date": timestamp_convert_full_date,
        "hour": hour,
        "month": month
    }


def update_data(collection, data, query):
    ts = get_date_time(data["timestamp"])
    find_zone = db.find_one(config.zone, {"id": data["zone_id"]}, None)
    if find_zone:
        necessary_data = {
            "dwellTime": data["dwell_time"],
            "timestamp": data["timestamp"],
            "hour": ts["hour"],
            "zone_id": data["zone_id"],
            "location": find_zone["location"],
            "name": find_zone["name"]
        }
        print("clmNHA` NO CHU: \n", data)

        db.update_document(collection, query, necessary_data)
    else:
        msg = "This zone does not have any location"
        utilities.push_notify_telegram(config.chat_id, msg)


def insert_data(data):
    ts = get_date_time(data["timestamp"])
    print("ts: \n", data)
    timestamp = ts["timestamp_convert_full_date"]
    query_find_pc_record = {
        "camID": data["cam_id"],
        "boxID": data["box_id"],
        "timestamp": timestamp
    }
    find_pc_record = db.find_all(str(config.peopleCountingHistory),
                                 query_find_pc_record,
                                 order="id")
    list_record = [record for record in find_pc_record]
    # insert default data if that day does not have any record
    if not list_record:
        input_data = {
            "camID": data["cam_id"],
            "boxID": data["box_id"],
            "timestamp": timestamp,
            "groupID": data["group_id"],
            "data": []
        }
        db.add_document(str(config.peopleCountingHistory), input_data)
    else:
        # update data from kafka
        # if that day already have record with timestamp above
        query_update_record = {
            "$and": [
                {"camID":  data["cam_id"]},
                {"boxID": data["box_id"]},
                {"timestamp": int(
                    timestamp)},
                # use $elemMatch in mongoDB to find zone_info.id == zone_id on list_zone array
                {"list_routes": {"$exists": True}}
            ]
        }

        update_data(str(config.peopleCountingHistory),
                    data, query_find_pc_record)


def validate_information(data):
    field_input = ["id", "boxID"]
    data_input = [data["cam_id"], data["box_id"]]
    # validate cam and box with id from kafka message
    validate_camera = validate_input(
        field_input, data_input, str(config.camera))

    if validate_camera == 0:
        msg_error_cam_box = "Could not found cam with id {cam_id} in box {box_id}".format(
            cam_id=data["cam_id"], box_id=data["box_id"])
        logging.error(msg_error_cam_box)
        utilities.push_notify_telegram(
            config.chat_id, msg_error_cam_box)

    else:
        zone_validate = ["id", "camID"]
        input_data = [data["zone_id"], data["cam_id"]]
        # validate zone, cam with id from kafka
        validate_zone = validate_input(
            zone_validate, input_data, str(config.zone))

        if validate_zone == 0:
            msg_error_zone = "Could not found zone with id {zone_id} in cam {cam_id}".format(
                zone_id=data["zone_id"], cam_id=data["cam_id"])
            logging.error(msg_error_zone)
            utilities.push_notify_telegram(
                config.chat_id, msg_error_zone)
        else:
            print("dataaaaaa: \n", data)
            # insert data
            insert_data(data)


def validate_input_message(msg_receive_kafka):
    if msg_receive_kafka["box_id"] is None and \
            str(msg_receive_kafka["box_id"]) == "" \
            or msg_receive_kafka["cam_id"] is None \
            and str(msg_receive_kafka["cam_id"]) == "":
        msg_cam_box_err = "Cam ID or Box ID does not exists!"
        content_error_log = "{ip} -- [{asctime}] ''Error: ' - {err}".format(ip=ip, asctime=asctime,
                                                                            err=msg_cam_box_err)
        logging.error(content_error_log)
        utilities.push_notify_telegram(
            config.chat_id, content_error_log)
    else:
        validate_information(msg_receive_kafka)


def handle_data_kafka():
    try:
        return _extracted_from_handle_data_kafka_4()
    except BaseException as err:
        print("err: \n", err)
        capture_exception(err)
        utilities.push_notify_telegram(config.chat_id, err)
        return "False"
    

def _extracted_from_handle_data_kafka_4():
    # connect kafka
    connect = Consumer({
        'bootstrap.servers': config.KAFKA_BROKER,
        'group.id': config.GROUP_ID,
        'auto.offset.reset': 'latest'
    })
    # consume topic
    connect.subscribe(
        [config.KAFKA_TOPIC])
    is_connect = True
    while is_connect:
        msg = connect.poll(0.5)
        if msg is None:
            capture_message(str(msg))
            continue
        if msg.error():
            msg_none_error_log = "{ip} -- [{asctime}] ' 'Error: ' - {err}".format(
                ip=ip, asctime=asctime,
                err=msg.error())
            # write log and push in telegram bot when message is None or error
            capture_message(msg_none_error_log)
            utilities.push_notify_telegram(
                config.chat_id, msg_none_error_log)
            continue
        else:
            # parse json data from kafka
            msg_receive_kafka = json.loads(msg.value().decode('utf-8'))
            validate_input_message(msg_receive_kafka)
        continue
    connect.close()
    return "True"
