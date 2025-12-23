# Run unittest

**Run test case for testing list function people counting:**

`In your project folder run command line: python3 -m unittest -v`

## Success Response

**Content example**

```
test_calculate_percent (unit_test.test_people_counting.TestListHelperFunction) ... ok
test_calculate_percent_rate (unit_test.test_people_counting.TestListHelperFunction)
Calculate rate ... ok
test_calculate_percentage (unit_test.test_people_counting.TestListHelperFunction)
Calculate percentage ... ok
test_check_collection (unit_test.test_people_counting.TestListHelperFunction)
Test check collection ... ok
test_convert_date_time (unit_test.test_people_counting.TestListHelperFunction)
Convert special datetime to timestamp, month ... ok
test_convert_month (unit_test.test_people_counting.TestListHelperFunction)
Convert month to timestamp ... ok
test_convert_special_time (unit_test.test_people_counting.TestListHelperFunction)
Convert special time to year, number in week, date ... ok
test_count_amount_of_timestamp_by_list_zone (unit_test.test_people_counting.TestListHelperFunction)
Count amount of timestamp by list zone ... ok
test_count_by_hours (unit_test.test_people_counting.TestListHelperFunction)
Count by hours ... ok
test_count_customer_day2day (unit_test.test_people_counting.TestListHelperFunction)
Test count customer day2day ... ok
test_count_people_with_zone_area (unit_test.test_people_counting.TestListHelperFunction)
Count people version 2 ... ok
test_count_record (unit_test.test_people_counting.TestListHelperFunction)
Test count record ... ok
test_count_separated_weekend (unit_test.test_people_counting.TestListHelperFunction)
Count separated weekend ... ok
test_day_number_in_week (unit_test.test_people_counting.TestListHelperFunction)
Day number in week ... ok
test_delete (unit_test.test_people_counting.TestListHelperFunction)
Test delete data ... ok
test_encrypt_password (unit_test.test_people_counting.TestListHelperFunction)
Encrypt password ... ok
test_find_data (unit_test.test_people_counting.TestListHelperFunction)
Test find all record ... ok
test_find_one (unit_test.test_people_counting.TestListHelperFunction)
Test find one record ... ok
test_get_previous_type_first_edition (unit_test.test_people_counting.TestListHelperFunction)
Validate previous type ... ok
test_get_previous_type_second_edition (unit_test.test_people_counting.TestListHelperFunction)
Validate previous type ... ok
test_get_response_count_pc (unit_test.test_people_counting.TestListHelperFunction)
Test response count pc ... ok
test_hash_password (unit_test.test_people_counting.TestListHelperFunction)
Hash password ... ok
test_insert (unit_test.test_people_counting.TestListHelperFunction)
Test insert data ... ok
test_list_response_list_static (unit_test.test_people_counting.TestListHelperFunction) ... ok
test_list_response_static (unit_test.test_people_counting.TestListHelperFunction)
Response list static ... ok
test_response_get_static_by_week (unit_test.test_people_counting.TestListHelperFunction)
Test response static by week ... ok
test_response_get_static_by_week_2 (unit_test.test_people_counting.TestListHelperFunction)
test response static by week ... ok
test_send_message_telegram (unit_test.test_people_counting.TestListHelperFunction)
Test send message telegram ... ok
test_update (unit_test.test_people_counting.TestListHelperFunction)
Test update data ... ok
test_validate_dictionary (unit_test.test_people_counting.TestListHelperFunction)
Validate a dictionary ... ok
test_validate_number (unit_test.test_people_counting.TestListHelperFunction)
Day number in week ... ok
test_validate_standard_email (unit_test.test_people_counting.TestListHelperFunction)
Validate email with email standard regex ... ok

----------------------------------------------------------------------
Ran 32 tests in 4.464s

OK
```

## Error Response

**Content example**

```
.................E....F.........
======================================================================
ERROR: test_find_one (unit_test.test_people_counting.TestListHelperFunction)
Test find one record
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/home/hoanglm/people-counting/unit_test/test_people_counting.py", line 439, in test_find_one
    self.assertEqual(type(dict(db.find_one(str(config.user), {"id": "1", '_id': False}))), expect_result)
TypeError: 'NoneType' object is not iterable

======================================================================
FAIL: test_insert (unit_test.test_people_counting.TestListHelperFunction)
Test insert data
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/home/hoanglm/people-counting/unit_test/test_people_counting.py", line 448, in test_insert
    self.assertDictEqual(find, expect_result)
AssertionError: None is not an instance of <class 'dict'> : First argument is not a dictionary

```
