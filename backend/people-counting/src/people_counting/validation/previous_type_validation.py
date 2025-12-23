
# list previous type
LIST_PREVIOUS_TYPE = ["yesterday", "lastWeek", "last14Days", "lastMonth"]

def validate_previous_type(type_previous):
    """
        :param type_previous:
        :return: {bool}
    """
    return type_previous in LIST_PREVIOUS_TYPE