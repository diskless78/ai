from enum import Enum

class ErrorMessageEnum(Enum):
    WRONG_INPUT_DATE_TIME = "Wrong input datetime"
    INVALID_DATE_RANGE = "Invalid date range"

    def __str__(self):
        return self.value