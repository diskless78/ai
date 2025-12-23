import os
from dotenv import load_dotenv
from uuid import uuid4

load_dotenv()

# MONGODB
MONGO_USR = os.getenv("MONGO_USR")

MONGO_PWD = os.getenv("MONGO_PWD")

MONGO_HOST = os.getenv("MONGO_HOST")

MONGO_PORT = os.getenv("MONGO_PORT")

MONGO_AUTH_SOURCE = os.getenv("MONGO_AUTH_SOURCE")

MONGODB_NAME = os.getenv("MONGODB_NAME")

MONGO_URI = "mongodb://{}:{}@{}:{}/?authSource={}".format(
    MONGO_USR, MONGO_PWD, MONGO_HOST, MONGO_PORT, MONGO_AUTH_SOURCE)

# SECRET KEY
SECRET_KEY = os.getenv("SECRET_KEY")

# TELEGRAM BOT CONFIG
TOKEN = os.getenv("TELEGRAM_TOKEN")
TELEGRAM = 'https://api.telegram.org/bot{}/sendMessage'.format(TOKEN)
chat_id = os.getenv("TELEGRAM_CHAT_ID")

# KAFKA
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC")
KAFKA_BROKER = os.getenv("KAFKA_BROKER")
GROUP_ID = os.getenv("GROUP_ID")

# S3
S3_ACCESS_KEY = os.getenv(
    "S3_ACCESS_KEY")


S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
S3_REGION = os.getenv("S3_REGION")
S3_URL = os.getenv("S3_URL")
S3_CAMERA_BUCKET = os.getenv("S3_CAMERA_BUCKET")
S3_EMPLOYEE_BUCKET = os.getenv("S3_EMPLOYEE_BUCKET")

# Sentry
CLIENT_KEYS = os.getenv(
    "CLIENT_KEYS")

# API URL
API_URL = os.getenv("API_URL")

# LIST MONGODB COLLECTIONS USE IN THIS PROJECT

# people counting history collection
peopleCountingHistory = os.getenv(
    "peopleCountingHistory")

# camera collection
camera = os.getenv("camera")

# zone collection
zone = os.getenv("zone")

# user collection
user = os.getenv("user")

# boxAI collection
boxAI = os.getenv("boxAI")

# group collection
group = os.getenv("group")

# customer collection
customerRecord = os.getenv("customerRecord")
