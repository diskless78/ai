from config import config
from database import db

def get_list_box(list_group):
    f"""
    :param list_group: 
    :return: {list} 
    """
    query_find_box = {
        "group": {"$in": list_group}
    }
    find_box_data = db.find_all(str(config.boxAI), query_find_box)

    return [box["id"] for box in find_box_data]