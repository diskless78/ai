# People Counting Client Services
## Count data by hour
**URL** : `http://192.168.30.151`

**ENDPOINT** : `/api/v1/people-counting/handle-report/count-by-hours`

**Method** : `GET`

**Headers**: `Authorization`

**Authorization**: `The place where you need to fill the token what the login api response above into this field`

**Auth required** : `TOKEN REQUIRED`


**Data constraints**

```args
/api/v1/people-counting/handle-report/count-by-hours?dateStart=
```

**Description**: 
```
* Kiểm tra thông tin đầu vào: 
    + Nếu dateStart rỗng => lỗi 400 bad request 

* Luồng tính toán:
    + Lấy các thông tin của user bao gồm user_id của user đó, list_box, group thuộc user đó
    + Tìm tất cả các zone với boxID nằm trong list box ở trên, location sẽ là gate
    + Tìm bản ghi trong collection tbl_history_people_counting thỏa mãn các điều kiện như sau:     
		query = {
			"data": {
				"$elemMatch": {
					"zone_id": {"$in": list_zone_id},
					"timestamp": {"$lte": int(date_end), "$gt": int(date_start)},
					"location": "gate"
				}
			}
		}
	+ Tìm số lần lặp lại của các giờ tương ứng từ 7->23h 
	+ Update số lần đó vào 1 dictionary có sẵn với các key 7->23
```

**Data example**
## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "data": {
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "11": 0,
        "12": 0,
        "13": 0,
        "14": 0,
        "15": 0,
        "16": 0,
        "17": 0,
        "18": 0,
        "19": 0,
        "20": 0,
        "21": 0,
        "22": 0,
        "23": 0
    }
}
```

## Count by weekend
**URL** : `http://192.168.30.151`

**ENDPOINT** : `/api/v1/people-counting/handle-report/get-static-by-week` 

**Method** : `GET`

**Headers**: `Authorization`

**Authorization**: `The place where you need to fill the token what the login api response above into this field`

**Auth required** : `TOKEN REQUIRED`
**Description**: 
```
* Kiểm tra thông tin đầu vào: 
    + dateStart, dateEnd rỗng => 400 bad request 
	+ type previous không nằm trong list ["yesterday", "lastWeek", "last14Days", "lastMonth"] => 400 bad request

* Luồng tính toán:
    + Lấy các thông tin của user bao gồm user_id của user đó, list_box, group thuộc user đó
    + Lấy khoảng thời gian trước đó để so sánh
	+ Lấy thông tin của collection tbl_history_people_counting của các zone từ way, gate, shop theo timestamp và timestamp trước đó
	+ Dựa vào timestamp trong object lấy ra thời gian đó thuộc ngày nào 
	+ Tính tổng số người đã đi qua zone thông qua hàm count_amount_of_timestamp_by_list_shop_zone đó nếu location của zone đó là shop :
		query = {
        "$and": [
            {
                "timestamp": {"$gte": int(date_start), "$lte": int(date_end)}
            },
            {
                "data": {
                    "$elemMatch": {
                        "zone_id": {"$in": list_zone_id},
                        "hour": {"$in": [i for i in range(7, 24)]}
                    }
                }
            }
        ]
    }
	+ Location khác shop sẽ gọi vào hàm count_amount_of_timestamp_by_list_zone :
		query = {
			"$and": [
				{
					"timestamp": {"$gte": int(date_start), "$lte": int(date_end)}
				},
				{
					"data": {
						"$elemMatch": {
							"zone_id": {"$in": list_zone_id},
							"hour": {"$in": [i for i in range(7, 24)]}
						}
					}
				}
			]
		}
	+ Append data sau khi tính toán vào ngày trong tuần tương ứng 
	+ Sau khi lấy được data sẽ tính % để so sánh data của thời gian input so với khoảng thời gian trước đó
	+ Dựa vào data phía trên sẽ lọc ra theo từng ngày vào append để lấy lượng người đi qua, đi vào, mua hàng tương ứng trong từng ngày
	+ Tính lượng khách hàng cũ mới tương tự sẽ lấy data theo từng ngày trong tuần và trả ra (Phân biệt khách hàng cũ và mới dựa trên trường newCustomer => true sẽ là mới)
	+ ngoài ra giá trị 101 đại diện cho việc kết quả tính toán ra bằng 0. Thay thế bằng 101 để có thể xử lý ở phía front end 
```
**Data constraints**
```json
192.168.30.151:5001/api/v1/people-counting/handle-report/get-static-by-week?dateStart=1622998800&dateEnd=1624122000
&previousType=yesterday
```

## Success Response

**Code** : `200 OK`

**Content example**
```json
{
    "data": [
        {
            "data": [
                "0.00",
                "4.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00"
            ],
            "name": "Lượng người đi qua"
        },
        {
            "data": [
                "0.00",
                "3.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00"
            ],
            "name": "Lượng người đi vào"
        },
        {
            "data": [
                "0.00",
                "2.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00"
            ],
            "name": "Lượng người mua hàng"
        },
        {
            "data": [
                101,
                75,
                101,
                101,
                101,
                101,
                101
            ],
            "name": "Tỉ lệ chuyển đổi 1"
        },
        {
            "data": [
                101,
                66.66666666666666,
                101,
                101,
                101,
                101,
                101
            ],
            "name": "Tỉ lệ chuyển đổi 2"
        },
        {
            "data": [
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            "name": "Khách hàng cũ"
        },
        {
            "data": [
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            "name": "Khách hàng mới"
        }
    ],
    "dataPercentage": [
        {
            "data": [
                "0.00",
                "101.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00"
            ],
            "name": "Lượng người đi qua"
        },
        {
            "data": [
                "0.00",
                "101.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00"
            ],
            "name": "Lượng người đi vào"
        },
        {
            "data": [
                "0.00",
                "101.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00",
                "0.00"
            ],
            "name": "Lượng người mua hàng"
        },
        {
            "data": [
                "-0.00",
                "-26.00",
                "-0.00",
                "-0.00",
                "-0.00",
                "-0.00",
                "-0.00"
            ],
            "name": "Tỉ lệ chuyển đổi 1"
        },
        {
            "data": [
                "-0.00",
                "-34.33",
                "-0.00",
                "-0.00",
                "-0.00",
                "-0.00",
                "-0.00"
            ],
            "name": "Tỉ lệ chuyển đổi 2"
        },
        {
            "data": [
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            "name": "Khách hàng cũ"
        },
        {
            "data": [
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            "name": "Khách hàng mới"
        }
    ]
}
```

## Count separate weekend
**URL** : `http://192.168.30.151`

**ENDPOINT** : `/api/v1/people-counting/handle-report/count-separate-weekend` 


**Method** : `GET`

**Headers**: `Authorization`

**Authorization**: `The place where you need to fill the token what the login api response above into this field`

**Auth required** : `TOKEN REQUIRED`
**Description**: 
```
* Kiểm tra thông tin đầu vào: 
    + dateStart, dateEnd rỗng => 400 bad request 
	+ type previous không nằm trong list ["yesterday", "lastWeek", "last14Days", "lastMonth"] => 400 bad request
* Tính toán dữ liệu:
	+ Lấy các thông tin của user bao gồm user_id của user đó, list_box, group thuộc user đó
    + Lấy khoảng thời gian trước đó để so sánh
	+ Lấy thông tin của collection tbl_history_people_counting của các zone từ way, gate theo timestamp và timestamp trước đó
	+ Dựa vào timestamp trong object lấy ra thời gian đó thuộc ngày nào
	+ Nếu data đó vào các ngày từ thứ 2 -> thứ 6 thì append vào totalWeekNormal, totalWeekNormalPrevious
	+ Data đó vào ngày thứ 7 và chủ nhật thì sẽ append vào trong totalWeekend, totalWeekendPrevious 
```
**Data constraints**
```json
{
    192.168.30.151:5001/api/v1/people-counting/handle-report/count-separate-weekend?dateStart=&dateEnd=
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "dataGate": [
        0,
        0
    ],
    "dataGatePrevious": [
        0,
        0
    ],
    "dataWay": [
        0,
        0
    ],
    "dataWayPrevious": [
        0,
        0
    ]
}
```

## List static
**URL** : `http://192.168.30.151`

**ENDPOINT** : `/api/v1/people-counting/handle-report/list-static` 


**Method** : `GET`

**Headers**: `Authorization`

**Authorization**: `The place where you need to fill the token what the login api response above into this field`

**Auth required** : `TOKEN REQUIRED`
**Description**: 
```
* Kiểm tra thông tin đầu vào: 
    + dateStart, dateEnd rỗng => 400 bad request 
	+ type previous không nằm trong list ["yesterday", "lastWeek", "last14Days", "lastMonth"] => 400 bad request
* Tính toán dữ liệu:
	+ Lấy các thông tin của user bao gồm user_id của user đó, list_box, group thuộc user đó
    + Lấy khoảng thời gian trước đó để so sánh
	+ Lấy thông tin của các zone có location là gate, way, shop theo timestamp, box phía trên
	+ Tính toán tỉ lệ phần trăm của location gate chia location way và shop chia cho gate 
	+ Extend data để trả ra response dựa theo backend cũ 


```
**Data constraints**
```json
{
    192.168.30.151:5001/api/v1/people-counting/handle-report/list-static?dateStart=&dateEnd=
}
```


## Success Response

**Code** : `200 OK`

**Content example**
```json 
{
    "data": [
        {
            "increase": false,
            "percentage": 100.0,
            "total": 0,
            "totalPrevious": 7
        },
        {
            "increase": false,
            "percentage": 100.0,
            "total": 0,
            "totalPrevious": 6
        },
        {
            "increase": true,
            "percentage": 85714186.57142857,
            "total": 100000001,
            "totalPrevious": 116.66666666666667
        },
        {
            "increase": true,
            "percentage": 100000001,
            "total": 100000001,
            "totalPrevious": 0.0
        },
        {
            "increase": true,
            "percentage": 100000001,
            "total": 0,
            "totalPrevious": 0
        },
        {
            "increase": true,
            "percentage": 100000001,
            "total": 0,
            "totalPrevious": 0
        },
        {
            "increase": true,
            "percentage": 100000001,
            "total": 0,
            "totalPrevious": 0
        },
        {
            "rushHour": 9,
            "total": 11
        }
    ]
}
```
## Count people by date range
**URL** : `http://192.168.30.151`

**ENDPOINT** : `/api/v1/people-counting/handle-report/count-people-by-date-range?dateStart=&dateEnd=` 


**Method** : `GET`

**Headers**: `Authorization`

**Authorization**: `The place where you need to fill the token what the login api response above into this field`

**Auth required** : `TOKEN REQUIRED`
**Description**: 
```
* Kiểm tra thông tin đầu vào: 
    + dateStart, dateEnd rỗng, khoảng cách giữa 2 ngày quá 15 ngày=> 400 bad request 
* Tính toán dữ liệu:
	+ Lấy các thông tin của user bao gồm user_id của user đó, list_box, group thuộc user đó
    + Lấy tất cả những người vào cửa hàng trong khoảng thời gian trên
	+ Đếm số người trong cửa hàng theo từng ngày
	+ Trả về một mảng chứa số lượng người trong cửa hàng theo từng ngày 


```
**Data constraints**
```json
{
    192.168.30.151:5001/api/v1/people-counting/handle-report/count-people-by-date-range?dateStart=&dateEnd=
}
```


## Success Response

**Code** : `200 OK`

**Content example**
```json 
{
    {
        "data": [
            0,
            2,
            17,
            2,
            11,
            10,
            0,
            0
        ]
    }
}
```

## Count average by group
**URL** : `http://192.168.30.151`

**ENDPOINT** : `/api/v1/people-counting/handle-report/count-average-by-group?dateStart=&dateEnd=` 


**Method** : `GET`

**Headers**: `Authorization`

**Authorization**: `The place where you need to fill the token what the login api response above into this field`

**Auth required** : `TOKEN REQUIRED`
**Description**: 
```
* Kiểm tra thông tin đầu vào: 
    + dateStart, dateEnd rỗng, khoảng cách giữa 2 ngày quá 15 ngày=> 400 bad request 
* Tính toán dữ liệu:
	+ Lấy các thông tin của user bao gồm user_id của user đó, list_box, group thuộc user đó
    + Lấy tất cả những người vào cửa hàng, mua hàng, đi qua trong khoảng thời gian trên và lấy theo từng group id
	+ Tính trung bình số người đi qua, số người vào mua, thời gian mua hàng trung mình, tỉ lệ chuyển đổi 1 
	+ Trả về một mảng chứa các giá trị trung bình theo tên group 


```
**Data constraints**
```json
{
    192.168.30.151:5001/api/v1/people-counting/handle-report/count-average-by-group?dateStart=&dateEnd=
}
```


## Success Response

**Code** : `200 OK`

**Content example**
```json 
{
    "data": [
        {
            "averageTime": 30.0,
            "comeIn": 0.3333333333333333,
            "name": "G14",
            "passer": 0.3333333333333333,
            "rate": 100.0
        },
        {
            "averageTime": 0,
            "comeIn": 0,
            "name": "test02",
            "passer": 0,
            "rate": 100000001
        },
        {
            "averageTime": 0,
            "comeIn": 0,
            "name": "G20",
            "passer": 0,
            "rate": 100000001
        },
        {
            "averageTime": 0,
            "comeIn": 0,
            "name": "test1",
            "passer": 0,
            "rate": 100000001
        },
        {
            "averageTime": 0,
            "comeIn": 0,
            "name": "lultv",
            "passer": 0,
            "rate": 100000001
        },
        {
            "averageTime": 0,
            "comeIn": 0,
            "name": "mtbmz",
            "passer": 0,
            "rate": 100000001
        },
        {
            "averageTime": 0,
            "comeIn": 0,
            "name": "HOANGDEPCHAI",
            "passer": 0,
            "rate": 100000001
        }
    ]
}
```

## List static Overall
**URL** : `http://192.168.30.151`

**ENDPOINT** : `/api/v1/people-counting/handle-report/list-static-overall` 


**Method** : `GET`

**Headers**: `Authorization`

**Authorization**: `The place where you need to fill the token what the login api response above into this field`

**Auth required** : `TOKEN REQUIRED`
**Description**: 
```
* Kiểm tra thông tin đầu vào: 
    + dateStart rỗng => 400 bad request 
	+ type previous không nằm trong list ["yesterday", "lastWeek", "last14Days", "lastMonth"] => 400 bad request
* Tính toán dữ liệu:
    + Giá trị của dateEnd = timestamp của thời gian hiện tại
	+ Lấy các thông tin của user bao gồm user_id của user đó, list_box, group thuộc user đó
    + Lấy khoảng thời gian trước đó để so sánh
	+ Lấy thông tin của các zone có location là gate, way, shop theo timestamp, box phía trên
	+ Tính toán tỉ lệ phần trăm của location gate chia location way và shop chia cho gate 
	+ Extend data để trả ra response dựa theo backend cũ 


```
**Data constraints**
```json
{
    192.168.30.151:5001/api/v1/people-counting/handle-report/list-static-overall?dateStart=
}
```


## Success Response

**Code** : `200 OK`

**Content example**
```json 
{
    "data": [
        {
            "increase": false,
            "percentage": 100.0,
            "total": 0,
            "totalPrevious": 7
        },
        {
            "increase": false,
            "percentage": 100.0,
            "total": 0,
            "totalPrevious": 6
        },
        {
            "increase": true,
            "percentage": 85714186.57142857,
            "total": 100000001,
            "totalPrevious": 116.66666666666667
        },
        {
            "increase": true,
            "percentage": 100000001,
            "total": 100000001,
            "totalPrevious": 0.0
        },
        {
            "increase": true,
            "percentage": 100000001,
            "total": 0,
            "totalPrevious": 0
        },
        {
            "increase": true,
            "percentage": 100000001,
            "total": 0,
            "totalPrevious": 0
        },
        {
            "increase": true,
            "percentage": 100000001,
            "total": 0,
            "totalPrevious": 0
        },
        {
            "rushHour": 9,
            "total": 11
        }
    ]
}
```