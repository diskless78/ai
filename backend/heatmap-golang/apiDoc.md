## PATH
- **Khi gọi đến path /api/v1/zone**

## Rest API URL Config Zone All Cam

> http://192.168.30.150:5001/api/v1/zone 

1 - Post - config zone and direction of all cam - HTTP Response Code - **200**
```
    HTTP/1.1 200
    Content-Type: application/json
    Authorization: Token

    {
        "boxID": "c9042193-cbe0-4e53-9814-6350e730292e",
        "data": [
            {
                "cam_id": "214325345465867",
                "zones": [
                    {
                        "name": "alo",
                        "offset": [0.234, 0.32145, 0.345, 0.4356],
                        "location": "gate",
                        "axis": [0.2435, 0.325, 0.879, 0.87]
                    },
                    {
                        "name": "alo2",
                        "offset": [0.2435, 0.325, 0.879, 0.87],
                        "location": "shop",
                        "axis": []
                    }
                    
                ],
                "linkStream": "rtsp://aiview:eway2021@10.68.10.153:554/streaming/channels/101",
                "directionConfig": [
                    {
                        "coord": [0.43, 0.67, 0.12, 0.54]
                    }
                ]
            }
        ]
    }
```

## Rest API URL Config And Get Zone Of One Cam

> http://192.168.30.150:5001/api/v1/zone/:id 

1 - PUT - config zone and direction of one cam - HTTP Response Code: **200** 
```
    HTTP/1.1 200
    Content-Type: application/json
    Authorization: Token

    {
        "boxID": "c9042193-cbe0-4e53-9814-6350e730292e",
        "data": [
            {
                "cam_id": "214325345465867",
                "zones": [
                    {
                        "name": "alo",
                        "offset": [0.234, 0.32145, 0.345, 0.4356],
                        "location": "gate",
                        "axis": [0.2435, 0.325, 0.879, 0.87]
                    },
                    {
                        "name": "alo2",
                        "offset": [0.2435, 0.325, 0.879, 0.87],
                        "location": "shop",
                        "axis": []
                    }
                    
                ],
                "linkStream": "rtsp://aiview:eway2021@10.68.10.153:554/streaming/channels/101",
                "directionConfig": [
                    {
                        "coord": [0.43, 0.67, 0.12, 0.54]
                    }
                ]
            }
        ]
    }
```

2 - GET - get zone and direction of one cam - HTTP Response Code - **200**
```
    HTTP/1.1 200
    Content-Type: application/json
    Authorization: Token

```