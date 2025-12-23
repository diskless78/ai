# Go

Receive notification in other service and send notification to client

Version 0.0.1 – 2025/12/15

Chức năng hiện tại:

- Nhận thông báo qua kafka lưu lại vào mongo db

Yêu cầu:
Go >= 1.25.4
Mongodb >= 8.0

- Thông tin các biến môi trường

| Tên biến                   | Giá trị                    | Mô tả                                    |
| -------------------------- | -------------------------- | ---------------------------------------- |
| KAFKA_BROKERS              | 192.168.1.67:9094           | broker kafka                   |
| KAFKA_TOPIC                | notification-events        | topic kafka                             |
| KAFKA_GROUP_ID             | notification-service       | group kafka                                     |
| KAFKA_MAX_WORKERS                | notification-events        | topic kafka                             |
| CA_CERT                | certs/ca-cert        | Kafka cert location                          |
| CA_KEY                | certs/ca-key        | Kafka key location                    |
| CA_ROOT                | certs/ca-root       | Kafka ca root                    |
| SERVICE_PORT               | 8080                       | Port của service                        |
| MONGO_URI                         | mongodb://localhost:27017  | mongo connection string                  |
| MONGODB_NAME                      | notifications              | database name                            |
| NOTIFICATION_COLLECTION           | notifications              | collection                               |
| CAMERA_COLLECTION           | camera              | collection                               |
| INTERNAL_SECRET_KEY           | key              | internal secret key                               |
| NOTIFICATION_URL           | <http://localhost:8000>              | base url notification service                               |
| NOTIFICATION_SEND_PATH     | /api/v1/notifications/send              | path send notification                               |
| MINIO_HOST     | minio              | minio config                           |
| MINIO_ACCESS_KEY     | minio             | minio config                               |
| MINIO_SECRET_KEY     |minio             | minio config                           |
| MINIO_REGION     | minio            | minio config                               |
| MINIO_NOTIFICATION_BUCKET     | minio            | minio config                               |

Cài package:
    go mod tidy

Run dev:
    go run cmd/server/main.go

1. Copy `.env.example` to `.env` and set values.
2. `make build` then `make run` to run locally.
3. `docker build -t go-microservice-template:latest .` to build image.
4. Apply `k8s/deployment.yaml` with secrets for DB creds.x
