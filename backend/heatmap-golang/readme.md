# Heatmap

# Setup environment

Golang version: `1.17`

Run project: `go run cmd/api/*.go`


**Caution**:\
`Các mục Mongo và List collection use in this project sẽ không cần export do hiện tại chưa có môi trường cho unittest. Sẽ sử dụng default config có sẵn trong project`


**List of environment variables used in this project:**

**S3  :**

| Name   |      Value      |  Description |
|----------|:-------------|:------|
|  S3_ACCESS_KEY | 9027013B821C4614B4B65608762D89B7 |  Access key dùng cho việc authen khi connect đến s3, tương tự như user name để login |
|   S3_SECRET_KEY| 123@123@zxc.vlxx-pdfS |  Secret key dùng cho việc authen khi connect đến s3, tương tự như password để login |
|  S3_REGION | us-east-1 | Region là vùng của s3 cần kết nối đến    |
|  S3_URL |  https://s3.hcm01.cxview.ai/ |  Địa chỉ kết nối của s3  |
|  S3_CAMERA_BUCKET | camera-image |  Tên của bucket chứa các hình ảnh từ camera|


**Kafka  :**

| Name   |      Value      |  Description |
|----------|:-------------|:------|
| GROUP_ID |   123123@123Aa | Group ID dùng cho việc consume trong kafka  |
|  KAFKA_TOPIC | dev-face-id |   Topic hứng dữ liệu của heatmap từ kafka |
|  KAFKA_BROKER | 192.168.30.201:9092 | Host của kafka, broker có thể có một hoặc nhiều host   |


**Mongo:**

| Name   |      Value      |  Description |
|----------|:-------------|:------|
|  MONGO_USER | admin |   User để login vào mongo|
|  MONGO_PWD | admin123456 |  Password để login vào mongo |
|  MONGO_HOST | 192.168.30.151 | Địa chỉ để kết nối vào mongo |
|  MONGO_PORT | 27017 | Port của mongo  |
|  MONGODB_NAME | Iview | Tên của database cần kết nối đến trong mongo |
|  MONGODB_AUTH_SOURCE | admin | Tên của database được chỉ định để xác thực |

**Port:**


| Name   |      Value      |  Description |
|----------|:-------------|:------|
|  PORT | 8012 | Port để chạy project|

**Secret key:**


| Name   |      Value      |  Description |
|----------|:-------------|:------|
|  SECRET_KEY | secret-key | Secret key để giải mã token|


**List collection use in this project**


|  CollectionName | Value | Description |
|----------|:-------------|:------|
|GROUP| group| Chứa thông tin của các group, một group đại diện cho một cửa hàng | 
|BOX_AI| boxAI| Chứa các thông tin của box để chạy các module| 
|CAMERA| camera|Chứa các thông tin của của camera| 
|HEATMAP_HISTORY| heatMapHistory|Chứa các bản ghi lịch sử của heatmap| 

