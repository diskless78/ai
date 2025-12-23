
from datetime import datetime


MAX_RANGE_DAYS = 15

def validate_input_datetime(date_start, date_end):
    """
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


def is_valid_date_range(date_start, date_end):
    date_start_object = datetime.fromtimestamp(date_start)
    date_end_object = datetime.fromtimestamp(date_end)

    if date_end >= date_start:
        date_diff = date_end_object - date_start_object
        return date_diff.days <= MAX_RANGE_DAYS

    return False