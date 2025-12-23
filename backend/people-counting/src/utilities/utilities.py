# -*- coding: utf-8 -*-
"""import necessary lib"""
import re
from flask import request
from flask import jsonify
from functools import wraps
import datetime
from hashlib import md5
import pytz
import requests
import json
from config import config
from database import db
import jwt
import bcrypt
import calendar
import boto3
import logging
from sentry_sdk import capture_exception, init

init(config.CLIENT_KEYS)

TOKEN = config.TOKEN
chat_id = config.chat_id
TELEGRAM = config.TELEGRAM


def flatten(seq, container=None):
    if container is None:
        container = []

    for s in seq:
        try:
            iter(s)  # check if it's iterable
        except TypeError:
            container.append(s)
        else:
            flatten(s, container)

    return container


# Make a regular expression
# for validating an Email
regex = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,' \
        '3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ '


# for custom mails use: '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'

# Define a function for
# for validating an Email


def check_email(email):
    # pass the regular expression
    # and the string in search() method
    return bool(re.search(regex, email))


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        email = request.authorization.get("username")
        password = request.authorization.get("password")
        if password == "" or password is None:
            return jsonify({"message": "Password can not be empty"})
        if email == "" or email is None:
            return jsonify({"message": "Username can not be empty"})
        if email and password:
            find = {}
            find.update(
                {
                    "email": email
                }
            )
            find_user_info = db.find_one(str(config.user), find)
            if find_user_info:
                user_info_password = find_user_info["password"]
                hash_password = str(md5(password.encode()).hexdigest())
                if str(user_info_password) != hash_password:
                    return jsonify({"message": "Password does not match"}), 404
            else:
                return jsonify({"message": "User does not exist"})
        return f(*args, **kwargs)

    return decorated_function


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        """
        :param args:
        :param kwargs:
        :return: f(*args, **kwargs)
        """
        if request.headers.get(
                "Authorization") is None:
            return jsonify({"message": "Missing token"}), 401
        else:
            token = request.headers["authorization"]
        if not token:
            return jsonify({'message': 'Missing token!'}), 401
        try:
            data = jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
        except BaseException as err:
            capture_exception(err)
            print(err)
            return jsonify({'message': 'Token không chính xác hoặc đã hết hạn! Vui lòng đăng nhập lại!'}), 404
        return f(*args, **kwargs)

    return decorated


def convert_timezone():
    datetime_object = datetime.datetime.now()
    current_timezone = pytz.timezone("Etc/UTC")  # my current timezone
    output = current_timezone.localize(datetime_object)  # localize function

    convert_to_current_timezone = output.astimezone(
        pytz.timezone("Asia/Ho_Chi_Minh"))  # timezone method
    return {"timestamp": int(convert_to_current_timezone.timestamp())}


# convert timestamp to datetime
def convert_timestamp(input_time):
    f"""
    :param input_time: 
    :return: {int}
    """
    get_time_stamp = datetime.datetime.fromtimestamp(input_time)
    datetime_convert = get_time_stamp.strftime("%Y-%m-%d %H:%M:%S")
    return str(datetime_convert)


def convert_timestamp_to_date(timestamp):
    f"""
    :param timestamp: 
    :return: {datetime} 
    """
    get_time_stamp = datetime.datetime.fromtimestamp(timestamp)
    date_convert = get_time_stamp.strftime("%Y-%m-%d")
    return str(date_convert)


# convert date to timestamp
def convert_date_to_timestamp(date_input):
    f"""

    :param date_input: 
    :return: {int}
    """
    date = datetime.datetime.strptime(date_input, "%Y-%m-%d")
    return datetime.datetime.timestamp(date)


def convert_datetime_to_timestamp(datetime_input):
    """

    :param datetime_input:
    :return:
    """
    date = datetime.datetime.strptime(datetime_input, "%Y-%m-%d %H:%M:%S.%f")
    return datetime.datetime.timestamp(date)


# convert input month, year to timestamp
def convert_month_to_timestamp(month, year):
    f"""
    :param month: 
    :param year: 
    :return: {dict} 
    """
    total_date = calendar.monthrange(int(year), int(month))
    (undefined, *date) = total_date
    # convert total date to seconds
    total_timestamp = date[0] * 24 * 60 * 60
    # convert string to datetime.datetime
    get_from_time = datetime.datetime.strptime(
        "{}-{}-01 00:00:00".format(year, month), "%Y-%m-%d %H:%M:%S")
    get_to_time = datetime.datetime.strptime(
        "{}-{}-{} 23:59:59".format(year, month, date[0]), "%Y-%m-%d %H:%M:%S")
    # convert input date month year to timestamp by local utc
    convert_from_time = datetime.datetime.timestamp(get_from_time)
    convert_to_time = datetime.datetime.timestamp(get_to_time)
    return {"from": convert_from_time, "to": convert_to_time, "year": year, "month": month,
            "total_timestamp": total_timestamp}


# send docs api telegram


def send_documents(chat_id, path_file, caption='', parse_mode=None, disable_notification=False,
                   reply_to_message_id=0,
                   reply_markup=None):
    f"""

    :param chat_id: 
    :param path_file: 
    :param caption: 
    :param parse_mode: 
    :param disable_notification: 
    :param reply_to_message_id: 
    :param reply_markup: 
    :return: {bool}
    """
    with open(path_file, 'rb') as file:
        response = requests.post(
            'https://api.telegram.org/bot{token}/sendDocument?'.format(
                token=TOKEN),
            data={
                'chat_id': chat_id,  # Integer or String
                'caption': caption,  # String
                # String https://core.telegram.org/bots/api#formatting-options
                'parse_mode': parse_mode,
                'disable_notification': disable_notification,  # Boolean
                'reply_to_message_id': reply_to_message_id,  # Integer

            },
            files={
                'document': file.read()
            }
        )
        file.close()
        if response.status_code == 200:
            return json.loads(response.text)
    return True


# push message to telegram
def push_notify_telegram(chat_id, text):
    try:
        param = {'chat_id': chat_id, 'text': text}
        requests.get(config.TELEGRAM, params=param)
        return True
    except BaseException as err:
        capture_exception(err)
        return False


# set webhook telegram
def set_webhook_tele(token, url, end_point):
    f"""

    :param token: 
    :param url: 
    :param end_point: 
    :return: {bool}
    """
    url = url
    token = token
    end_point = end_point
    try:
        requests.post(
            "https://api.telegram.org/{t}/setWebHook?url={u}/{e}".format(t=token, u=url, e=end_point))
    except BaseException as err:
        capture_exception(err)
    return True


# hash password
def hash_password(input_password):
    f"""

    :param input_password: 
    :return: {str} 
    """
    return md5(input_password.encode()).hexdigest()


# encrypt password for client using bcrypt
def encrypt_password(input_password):
    f"""

    :param input_password: 
    :return: {str} 
    """
    return bcrypt.hashpw(input_password, bcrypt.gensalt())


# S3 settings
def s3_connection():
    return boto3.client(service_name='s3',
                        endpoint_url=config.S3_URL,
                        region_name=config.S3_REGION,
                        aws_access_key_id=config.S3_ACCESS_KEY,
                        aws_secret_access_key=config.S3_SECRET_KEY)


# gen list hours
# x from hour => data type : in
# y: to hour => data type : in
def lst_hours(x, y):
    """

    :param x:
    :param y:
    :return: list
    """
    try:
        lst = []
        for i in range(x, y + 1):
            i = "" + str(i).zfill(2)
            lst.append(i)
        return lst
    except BaseException as err:
        capture_exception(err)


# gen default value count, dwellTime
# x from value => data type : in
# y: to value => data type : in
def count_lst_hours(x, y):
    f"""

    :param x: 
    :param y: 
    :return: {list} 
    """
    return [0 for _ in range(x, y + 1)]


# merge two list into a dictionary
def merge_lst_to_dict(key_data, value_data):
    f"""

    :param key_data: 
    :param value_data: 
    :return: {dict}
    """
    try:
        zip_iterator = zip(key_data, value_data)
        return dict(zip_iterator)
    except BaseException as err:
        capture_exception(err)


def get_user_info(headers):
    f"""

    :param headers: 
    :return: {str}
    """
    try:
        decode = jwt.decode(headers, config.SECRET_KEY, algorithms=["HS256"])
        user_id = db.find_one(config.user, {"email": decode["email"]})
        return user_id["id"]
    except BaseException as err:
        capture_exception(err)


def error_log(ip, time, error):
    FORMAT = '%(asctime)-15s %(clientip)s %(user)-8s %(message)s'
    logging.basicConfig(FORMAT)
    logger = logging.getLogger('tcpserver')
    logger.error("{IP} -- {ASCTIME} -- Error: {error}, ".format(IP=ip, ASCTIME=time, error=error))
