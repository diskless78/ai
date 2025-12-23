from config import config
from database import db


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
