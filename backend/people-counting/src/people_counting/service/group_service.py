from flask.globals import current_app
from sentry_sdk.api import capture_exception
from config import config
from database import db


def get_list_group(group_id, user_id):
    """
        :param group_id:
        :param user_id:
        :return: {list}
    """
    try:
        if group_id is not None and group_id != "":
            return group_id.split(",")
        find_group = db.find_all(str(config.group), {"userid": user_id})
        return [group_id["id"] for group_id in find_group]
    except BaseException as err:
        current_app.logger.error(err)
        capture_exception(err)

def get_group_by_list_group_id(list_group_id):
    try:
        
        return db.find_all(str(config.group), {
            "id": {
                "$in": list_group_id
            }
        })
    except BaseException as err:
        current_app.logger.error(err)
        capture_exception(err)