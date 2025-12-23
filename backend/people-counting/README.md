# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0] - 2021-07-07

### Add

- Add list functions to consume topic and handle data from kafka
- Change data structure in peopleCountingHistory collection
- Change all collection to environment variables
- Add threading to running multithreading between list api report and list functions handle data from kafka
- Add auxiliary functions to easily communicate with datetime, list, dictionary
- Add sentry to easily manage error 
- Add unittest for helper function communicate with datetime, list, dictionary and parse json data
- Update new version api report people counting
- Optimize query, parse, calculate data in insert record, report api 
- Edit the code according to the standards of pylint
- Make the code cleaner than older version
- Update new method in pymongo to ignore some warning from mongo
- Add list function display log detail from http api
- Disabled use_reloader to fix insert duplicate peopleCountingHistory
### Fix
- Not yet
### Remove
- Old data structure in peopleCountingHistory collection
- Remove old version of list api report in people counting 


## [2.0] - 2021-08-13

### Add

- Add endpoint get list static overall
- Add endpoint get static average by group
- Change response api get list static, count by hour

### Fix
- [CXVIEW-42](https://cxviews.atlassian.net/browse/CXVIEW-42)
- [CXVIEW-39](https://cxviews.atlassian.net/browse/CXVIEW-39)
- [CXVIEW-40](https://cxviews.atlassian.net/browse/CXVIEW-40)
- [CXVIEW-64](https://cxviews.atlassian.net/browse/CXVIEW-64)
- [CXVIEW-65](https://cxviews.atlassian.net/browse/CXVIEW-65)
- [CXVIEW-68](https://cxviews.atlassian.net/browse/CXVIEW-68)
- [CXVIEW-76](https://cxviews.atlassian.net/browse/CXVIEW-76)
### Remove

# Setup environments
**Python require version**:` >= 3.5.6`

**Install python packages requirements**:\
`In your project folder run command line: pip3 install -r /your-folder/your-path/requirements.txt`

**Config**:\
`Create file .env following the file env-example`

**Caution**:\
`Các mục Mongo và List collection use in this project sẽ không cần export do hiện tại chưa có môi trường cho unittest. Sẽ sử dụng default config có sẵn trong project`


**List of environment variables used in this project:**\


**Kafka:**

| Name   |      Value      |  Description |
|----------|:-------------|:------|
| GROUP_ID |   123123@123Aa | Group ID dùng cho việc consume trong kafka  |
|  KAFKA_TOPIC | gate-tz |   Topic hứng dữ liệu từ kafka |
|  KAFKA_BROKER | localhost:9092 | Host của kafka, broker có thể có một hoặc nhiều host   |


**Sentry:**

| Name   |      Value      |  Description |
|----------|:-------------|:------|
| CLIENT_KEYS  | https://739b4420625f4dfc95c4c8408d2617b4@o620853.ingest.sentry.io/5751719 |  Sentry Client key(dsn), cái này dùng cho việc nói với sentry nơi mà nó cần gửi các event đến  |


**Mongo:**

| Name   |      Value      |  Description |
|----------|:-------------|:------|
|  MONGO_USR | admin |   User để login vào mongo|
|  MONGO_PWD | admin123456 |  Password để login vào mongo |
|  MONGO_HOST | 192.168.30.151 | Địa chỉ để kết nối vào mongo |
|  MONGO_PORT | 27017 | Port của mongo  |
|  MONGODB_NAME | hoangml_db | Tên của database cần kết nối đến trong mongo |
|  MONGO_AUTH_SOURCE | admin | Tên của database được chỉ định để xác thực |


**Port:**
|  PORT | 5001 | Port để chạy project|


**Secret key:**

| Name   |      Value      |  Description |
|----------|:-------------|:------|
|  SECRET_KEY | secret-key |   Secret key để giải mã token|


**List collection use in this project**


|  CollectionName | Value | Description |
|----------|:-------------|:------|
|peopleCountingHistory|peopleCountingHistory| Chứa các bản ghi lịch sử  đếm người của people counting|
|camera| camera| Chứa dữ liệu của các camera| 
|zone| zone| Chứa dữ liệu của các zone| 
|user| user| Chứa các thông tin của người dùng| 
|customerRecord| customerRecord| Chứa các thông tin nhận diện khách hàng| 
|boxAI| boxAI| Chứa các thông tin của box để chạy các module| 
|group| group| Chứa các thông tin của các group nhằm phục vụ cho việc phân quyền và quản lý người dùng|


**Example command export env**:
```
export CLIENT_KEYS="https://739b4420625f4dfc95c4c8408d2617b4@o620853.ingest.sentry.io/5751719"&& export MONGODB_NAME=Iview && export KAFKA_TOPIC="gate-tz" && export KAFKA_BROKER="localhost:9092" && export GROUP_ID="123123@123Aa" && export API_URL ="http://localhost:5001/api/v1/" && export peopleCountingHistory="peopleCountingHistory" && export camera="camera" && export zone="zone" && export user="user" && export boxAI="boxAI" && export group="group" && export customerRecord="customerRecord" && export PORT=5001
```

**Run project**:
`In your project folder run command line: python3 /your-folder/your-path/src/main.py`

