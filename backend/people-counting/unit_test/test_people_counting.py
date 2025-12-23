import datetime
import unittest
import random
import string
import sys

sys.path.append('src/')
from utilities import utilities
from config import config
from database import db
from people_counting import count_separated_weekend, count_by_weekend, count_by_hour, get_list_static

domains = ["hotmail.com", "gmail.com", "yahoo.com", "cxview.ai"]
letters = string.ascii_lowercase[:12]


def get_one_random_name(letters):
    return ''.join(random.choice(letters) for i in range(13))


def get_one_random_domain(domains):
    return random.choice(domains)


def generate_random_emails():
    return [get_one_random_name(letters) + '@' + get_one_random_domain(domains) for i in
            range(100)]


class TestListHelperFunction(unittest.TestCase):

    def test_validate_standard_email(self):
        """Validate email with email standard regex"""
        for email in generate_random_emails():
            self.assertTrue(email)

    def test_convert_date_time(self):
        """Convert special datetime to timestamp, month"""
        year = "2021"
        month = "07"
        result = utilities.convert_month_to_timestamp(month, year)
        self.assertEqual("1625072400", str(int(result["from"])))

    def test_convert_special_time(self):
        """Convert special time to year, number in week, date"""
        year = "2021"
        month = "07"
        result = utilities.convert_month_to_timestamp(month, year)
        self.assertEqual("1627750799", str(int(result["to"])))

    def test_convert_month(self):
        """Convert month to timestamp"""
        year = "2021"
        month = "07"
        result = utilities.convert_month_to_timestamp(month, year)
        self.assertEqual(month, result["month"])
        self.assertEqual(year, result["year"])

    def test_send_message_telegram(self):
        """Test send message telegram"""
        self.assertTrue(utilities.push_notify_telegram(config.chat_id, self.shortDescription()))

    def test_hash_password(self):
        """Hash password"""
        hash_example_password = utilities.hash_password("anhhoangdepchai")
        self.assertTrue(type(hash_example_password), str)

    def test_encrypt_password(self):
        """Encrypt password"""
        random_pwd = "htmlcssjavascript"
        encrypt = utilities.encrypt_password(random_pwd.encode('utf8'))
        self.assertEqual(type(str(encrypt)), str)

    def test_validate_dictionary(self):
        """Validate a dictionary"""
        lst_a = utilities.lst_hours(6, 11)
        lst_b = utilities.lst_hours(6, 11)
        a_dict = utilities.merge_lst_to_dict(lst_b, lst_a)
        self.assertEqual(type(a_dict), dict)

    def test_count_amount_of_timestamp_by_list_zone(self):
        """Count amount of timestamp by list zone"""
        list_zone_id = [db.find_all(str(config.zone), {"id": {"$exists": True}})]
        date_time_now = datetime.datetime.now()
        date_start = utilities.convert_datetime_to_timestamp(str(date_time_now))
        date_end = date_start + 86400
        lst_location = ["shop", "gate", "way"]
        for item in lst_location:
            expect_result = (
                count_separated_weekend.count_amount_of_timestamp_by_list_zone(
                    list_zone_id, date_start, date_end, item
                )
            )
            self.assertListEqual([expect_result], [expect_result])

    def test_get_previous_type_first_edition(self):
        """Validate previous type"""
        type_previous = "yesterday"
        self.assertTrue(count_separated_weekend.validate_previous_type(type_previous),
                        "This type should in {list_type}".format(list_type=count_separated_weekend.lst_previous_type))
        self.assertFalse(count_separated_weekend.validate_previous_type(type_previous + "slave"),
                         "This type should not in {list_type}".format(
                             list_type=count_separated_weekend.lst_previous_type))

    def test_get_previous_type_second_edition(self):
        """Validate previous type"""
        type_previous = "yesterday"
        self.assertFalse(count_separated_weekend.validate_previous_type(type_previous + "slave"),
                         "This type should not in {list_type}".format(
                             list_type=count_separated_weekend.lst_previous_type))

    def test_count_separated_weekend(self):
        """Count separated weekend"""
        get_input_data = {
            "groupID": ""
        }
        date_time_now = datetime.datetime.now()
        date_start = utilities.convert_datetime_to_timestamp(str(date_time_now))
        date_end = date_start + 86400
        user_id = "1"
        for data in count_separated_weekend.lst_previous_type:
            response = count_separated_weekend.response_count_separated_weekend(
                get_input_data,
                user_id,
                date_start,
                date_end,
                data)
            dic_expected = {
                "dataGate": response["dataGate"],
                "dataGatePrevious": response["dataGatePrevious"],
                "dataWay": response["dataWay"],
                "dataWayPrevious": response["dataWayPrevious"]
            }
            self.assertDictEqual(dic_expected, response)

    def test_count_by_hours(self):
        """Count by hours"""
        date_time_now = datetime.datetime.now()
        date_start = utilities.convert_datetime_to_timestamp(str(date_time_now))
        query = {
            "id": {
                "$exists": True
            }
        }
        find_box = db.find_all(config.boxAI, query)
        list_box_id = [data["id"] for data in find_box]
        response = count_by_hour.response_count_by_hour(list_box_id, date_start, date_start + 86399)
        dict_expected = {
            "data":
                {7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0,
                 22: 0, 23: 0}
        }
        self.assertDictEqual(dict_expected, response)

    def test_calculate_percentage(self):
        """Calculate percentage"""
        self._extracted_from_test_calculate_percentage_2(50.0, 1, 2)
        data_expect2 = {
            "percentage": 25.0,
            "increase": False
        }
        test_function2 = get_list_static.calculator_percentage(3, 4)
        self.assertDictEqual(data_expect2, test_function2)
        self._extracted_from_test_calculate_percentage_2(80.0, 2, 10)

    def test_calculate_percent_rate(self):
        """Calculate rate"""
        self._extracted_from_test_calculate_percentage_2(400.0, 10, 2)

    def test_calculate_percent(self):
        self._extracted_from_test_calculate_percentage_2(400.0, 10, 2)

    def _extracted_from_test_calculate_percentage_2(self, arg0, arg1, arg2):
        data_expect = {"percentage": arg0, "increase": False}
        test_function = get_list_static.calculator_percentage(arg1, arg2)
        self.assertDictEqual(data_expect, test_function)

    def test_count_people_with_zone_area(self):
        """Count people version 2"""
        date_time_now = datetime.datetime.now()
        date_start = utilities.convert_datetime_to_timestamp(str(date_time_now))
        date_end = date_start + 86399
        get_datetime_previous = get_list_static.transform_timestamp_to_find_previous(
            date_start, date_end, "yesterday")
        date_start_previous, date_end_previous = get_datetime_previous[
                                                     "start"], get_datetime_previous["end"]
        query = {
            "id": {
                "$exists": True
            }
        }
        find_box = db.find_all(config.boxAI, query)
        list_box_id = [data["id"] for data in find_box]
        data = get_list_static.count_people_by_zone(date_start, date_end, date_start_previous,
                                               date_end_previous, list_box_id, "gate")
        expect_data = {'Total': 0, 'TotalPrevious': 0, 'Percentage': 101.0, 'Increase': True}
        self.assertDictEqual(expect_data, data)

    def test_count_customer_day2day(self):
        """Test count customer day2day"""
        query = {
            "id": {
                "$exists": True
            }
        }
        find_box = db.find_all(config.boxAI, query)
        list_box_id = [data["id"] for data in find_box]
        date_time_now = datetime.datetime.now()
        date_start = utilities.convert_datetime_to_timestamp(str(date_time_now))
        date_end = date_start + 86399
        get_datetime_previous = get_list_static.transform_timestamp_to_find_previous(
            date_start, date_end, "yesterday")
        date_start_previous, date_end_previous = get_datetime_previous[
                                                     "start"], get_datetime_previous["end"]

        data3 = get_list_static.count_people_by_zone(date_start + (86399 * 7), date_end + (86399 * 7),
                                                date_start_previous + (86399 * 7),
                                                date_end_previous + (86399 * 7), list_box_id, "gate")
        expect_data3 = {'Total': 0, 'TotalPrevious': 0, 'Percentage': 101.0, 'Increase': True}
        self.assertDictEqual(data3, expect_data3)

    def test_get_response_count_pc(self):
        """Test response count pc"""
        query = {
            "id": {
                "$exists": True
            }
        }
        find_box = db.find_all(config.boxAI, query)
        list_box_id = [data["id"] for data in find_box]
        date_time_now = datetime.datetime.now()
        date_start = utilities.convert_datetime_to_timestamp(str(date_time_now))
        date_end = date_start + 86399
        get_datetime_previous = get_list_static.transform_timestamp_to_find_previous(
            date_start, date_end, "yesterday")
        date_start_previous, date_end_previous = get_datetime_previous[
                                                     "start"], get_datetime_previous["end"]
        data2 = get_list_static.count_people_by_zone(date_start + 86399, date_end + 86399, date_start_previous + 86399,
                                                date_end_previous + 86399, list_box_id, "gate")
        expect_data2 = {'Total': 0, 'TotalPrevious': 0, 'Percentage': 101.0, 'Increase': True}
        self.assertDictEqual(expect_data2, data2)

    def test_list_response_list_static(self):
        date_time_now = datetime.datetime.now()
        date_start = utilities.convert_datetime_to_timestamp(str(date_time_now))
        date_end = date_start + 86399
        query = {
            "id": {
                "$exists": True
            }
        }
        find_box = db.find_all(config.boxAI, query)
        list_box_id = [data["id"] for data in find_box]
        data = get_list_static.list_response_list_static(date_start, date_end, "yesterday", list_box_id)
        expect_data = {
            "data": [
                {
                    "Increase": True,
                    "Percentage": 101.0,
                    "Total": 0,
                    "TotalPrevious": 0
                },
                {
                    "Increase": True,
                    "Percentage": 101.0,
                    "Total": 0,
                    "TotalPrevious": 0
                },
                {
                    "Increase": True,
                    "Percentage": 101.0,
                    "Total": 101.0,
                    "TotalPrevious": 0.0
                },
                {
                    "Increase": True,
                    "Percentage": 101.0,
                    "Total": 101.0,
                    "TotalPrevious": 0.0
                },
                {
                    "Increase": True,
                    "Percentage": 101.0,
                    "Total": 0,
                    "TotalPrevious": 0
                }
            ]
        }
        self.assertDictEqual(data, expect_data)

    def test_list_response_static(self):
        """Response list static"""
        date_time_now = datetime.datetime.now()
        date_start = utilities.convert_datetime_to_timestamp(str(date_time_now))
        date_end = date_start + 86399
        query = {
            "id": {
                "$exists": True
            }
        }
        find_box = db.find_all(config.boxAI, query)
        list_box_id = [data["id"] for data in find_box]
        data2 = get_list_static.list_response_list_static(date_start + 86399, date_end + 86399, "yesterday",
                                                          list_box_id)
        expect_data2 = {
            "data": [
                {
                    "Increase": True,
                    "Percentage": 101.0,
                    "Total": 0,
                    "TotalPrevious": 0
                },
                {
                    "Increase": True,
                    "Percentage": 101.0,
                    "Total": 0,
                    "TotalPrevious": 0
                },
                {
                    "Increase": True,
                    "Percentage": 101.0,
                    "Total": 101.0,
                    "TotalPrevious": 0.0
                },
                {
                    "Increase": True,
                    "Percentage": 101.0,
                    "Total": 101.0,
                    "TotalPrevious": 0.0
                },
                {
                    "Increase": True,
                    "Percentage": 101.0,
                    "Total": 0,
                    "TotalPrevious": 0
                }
            ]
        }
        self.assertDictEqual(data2, expect_data2)

    def test_day_number_in_week(self):
        """Day number in week"""
        date_time_now = datetime.datetime.now()
        date_start = utilities.convert_datetime_to_timestamp(str(date_time_now))
        number = get_list_static.get_day_number_in_week(date_start)
        lst_day = [i for i in range(7)]
        self.assertTrue(number in lst_day)
        lst_day2 = [i for i in range(7)]
        self.assertFalse(number not in lst_day2)

    def test_validate_number(self):
        """Day number in week"""
        date_time_now = datetime.datetime.now()
        date_start = utilities.convert_datetime_to_timestamp(str(date_time_now))
        number = get_list_static.get_day_number_in_week(date_start)
        lst_day3 = [k for k in range(10, 17)]
        self.assertFalse(number in lst_day3)
        lst_day34 = [i + 17 for i in range(77, 99)]
        self.assertFalse(number in lst_day34)

    def test_response_get_static_by_week(self):
        """Test response static by week"""
        date_start = utilities.convert_datetime_to_timestamp(str(datetime.datetime.now()))
        date_end = date_start + 86399
        list_previous_type = ["yesterday", "lastWeek", "last14Days", "lastMonth"]
        query = {
            "id": {
                "$exists": True
            }
        }
        find_box = db.find_all(config.boxAI, query)
        list_box_id = [data["id"] for data in find_box]
        expected_response_yesterday1 = count_by_weekend.response_get_static_by_week(date_start,
                                                                                    date_end,
                                                                                    list_previous_type[0],
                                                                                    date_end,
                                                                                    list_box_id)
        expected_response_yesterday2 = count_by_weekend.response_get_static_by_week(date_start,
                                                                                    date_end,
                                                                                    list_previous_type[0],
                                                                                    date_end,
                                                                                    list_box_id)
        self.assertDictEqual(expected_response_yesterday1, expected_response_yesterday2)

    def test_response_get_static_by_week_2(self):
        """test response static by week"""
        date_start = utilities.convert_datetime_to_timestamp(str(datetime.datetime.now()))
        date_end = date_start + 86399
        list_previous_type = ["yesterday", "lastWeek", "last14Days", "lastMonth"]
        query = {
            "id": {
                "$exists": True
            }
        }
        find_box = db.find_all(config.boxAI, query)
        list_box_id = [data["id"] for data in find_box]
        expected_response_lastWeek1 = count_by_weekend.response_get_static_by_week(date_start,
                                                                                   date_end,
                                                                                   list_previous_type[1],
                                                                                   date_end,
                                                                                   list_box_id)
        expected_response_lastWeek2 = count_by_weekend.response_get_static_by_week(date_start,
                                                                                   date_end,
                                                                                   list_previous_type[1],
                                                                                   date_end,
                                                                                   list_box_id)
        self.assertDictEqual(expected_response_lastWeek1, expected_response_lastWeek2)

    def test_check_collection(self):
        """Test check collection"""
        expect_result = bool
        self.assertEqual(type(db.check_collection_exist(config.boxAI)), expect_result)
        self.assertEqual(type(db.check_collection_exist(config.peopleCountingHistory)), expect_result)
        self.assertEqual(type(db.check_collection_exist(config.user)), expect_result)
        self.assertEqual(type(db.check_collection_exist(config.group)), expect_result)
        self.assertEqual(type(db.check_collection_exist(config.customerRecord)), expect_result)

    def test_count_record(self):
        """Test count record"""
        expect_result = int
        self.assertEqual(type(db.count_record(str(config.user), {"id": {"$exists": True}})), expect_result)
        self.assertEqual(type(db.count_record(str(config.boxAI), {"id": {"$exists": True}})), expect_result)
        self.assertEqual(type(db.count_record(str(config.group), {"id": {"$exists": True}})), expect_result)
        self.assertEqual(type(db.count_record(str(config.peopleCountingHistory),
                                              {"_id": {"$exists": True}})), expect_result)

    def test_find_data(self):
        """Test find all record"""
        expect_result = list
        self.assertEqual(type(list(db.find_all(str(config.user), {"id": {"$exists": True}}))), expect_result)
        self.assertEqual(type(list(db.find_all(str(config.boxAI), {"id": {"$exists": True}}))), expect_result)
        self.assertEqual(type(list(db.find_all(str(config.group), {"id": {"$exists": True}}))), expect_result)
        self.assertEqual(type(list(db.find_all(str(config.peopleCountingHistory),
                                               {"_id": {"$exists": True}}))), expect_result)

    def test_find_one(self):
        """Test find one record"""
        expect_result = dict
        self.assertEqual(type(dict(db.find_one(str(config.user), {"id": "1"}))), expect_result)

    def test_insert(self):
        """Test insert data"""
        expect_result = {
            "id": "2"
        }
        result = db.add_document("test", expect_result)
        find = db.find_one("test", {"id": "2", '_id': False})
        self.assertDictEqual(expect_result, expect_result)

    def test_update(self):
        """Test update data"""
        expect_result = {
            "id": "3"
        }
        find = db.find_one("test", {"id": "2"})
        result = db.update_document("test", find, {"id": "3"})
        self.assertDictEqual({"id": "3"}, expect_result)

    def test_delete(self):
        """Test delete data"""
        db.delete_document("test", {"id": "3"})
        self.assertEqual(type("ok"), str)


if __name__ == '__main__':
    unittest.main()
