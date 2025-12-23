import datetime
from utilities.utilities import convert_timestamp_to_date
from datetime import time


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
        return {"start": int(start) - 7 * 86400, "end": int(start)}
    elif previous_type == "last14Days":
        return {"start": int(start) - 14 * 86399, "end": int(start)}
    else:
        return {"start": int(start) - 30 * 86399, "end": int(start)}

def get_day_number_in_week(date_start):
    """
        :param date_start:
        :return:
    """
    timestamp_to_date = convert_timestamp_to_date(int(date_start))
    return datetime.datetime.strptime(
        timestamp_to_date, "%Y-%m-%d").weekday()

def later_timestamp_of_day(value):
    date_object = datetime.datetime.fromtimestamp(value)
    earliest_time = datetime.datetime.combine(date_object, time.max)
    return earliest_time.timestamp()

def is_weekend(timestamp):
    return datetime.datetime.fromtimestamp(timestamp).weekday() >= 4