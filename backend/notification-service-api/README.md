# Notification API Service

Receive notification in other service and send notification to client

Version 0.0.1 – 2025/12/15

Chức năng hiện tại:

- Gửi thông báo đến client thông qua SSE

- Yêu cầu:
Python >= 3.12
Mongodb >= 8.0

- Thông tin các biến môi trường

| Tên biến                          | Giá trị                    | Mô tả                                    |
| --------------------------------- | -------------------------- | ---------------------------------------- |
| PORT                              | 8000                       | port chạy service                        |
| SECRET_KEY                        | SECRET_KEY                 | jwt secret key                           |
| MONGO_URI                         | mongodb://localhost:27017  | mongo connection string                  |
| MONGODB_NAME                      | notifications              | database name                            |
| NOTIFICATION_COLLECTION           | notifications              | collection                               |
| GOOGLE_APPLICATION_CREDENTIALS    | ./creds/cert.json          | firebase config                          |
| INTERNAL_SECRET_KEY    | key          | internal secret key                           |
| REDIS_HOST    | 127.0.0.1          | redis config                          |
| REDIS_PORT    | 6379          | redis config                          |
| REDIS_DATABASE    | 0          | redis config                          |
| REDIS_PASSWORD    | password         | redis config                          |
| MINIO_HOST     | minio              | minio config                           |
| MINIO_ACCESS_KEY     | minio             | minio config                               |
| MINIO_SECRET_KEY     |minio             | minio config                           |
| MINIO_REGION     | minio            | minio config                               |
| MINIO_NOTIFICATION_BUCKET     | minio            | minio config                               |

**DEV**
python3 -m venv env
source env/bin/activate

**Install python packages requirements**:\
pip3 install -r requirements.txt

**Start app**
uvicorn app.main:app --reload --port 8000

**Automatically create file 'requirements.txt'**
pip freeze > requirements.txt

window:

Tạo môi trường ảo
python -m venv venv
Kích hoạt môi trường ảo
venv\Scripts\activate

# Run test

pytest
