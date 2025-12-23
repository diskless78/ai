from enum import Enum


class LANGUAGE_CODES:
    VI = "vn"
    EN = "en"


class NOTIFY_KEY(str, Enum):
    NOTIFY = "notify"
    MESSAGE = "message"
