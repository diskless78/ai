
from kafka import KafkaProducer, KafkaConsumer
import json
import uuid
import os
import sys
import pickle

pwd = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(1, os.path.join(pwd, ".."))

# from src import BOOTSTRAP_SERVER, CONSUMER_TOPIC
# from src.protobuf import payload_pb2
# from src.progress import Watcher

BOOTSTRAP_SERVER = "127.0.0.1:9092"
CONSUMER_TOPIC = "TannedCung"
# PRODUCER_TOPIC = "TannedCung"


total_timestamps = []
total_latency = []
total_boxes = []
total_boxes_latency = {}

def log_to_file(data, save_name):
    save_file = open(save_name, "wb")
    pickle.dump(data, save_file)
    save_file.close()

def run_consumer():
    consumer = KafkaConsumer(bootstrap_servers=BOOTSTRAP_SERVER,
                                auto_offset_reset='latest',
                                value_deserializer=lambda value: value,
                                group_id=str(uuid.uuid4()))
    consumer.subscribe(CONSUMER_TOPIC)

    for message in consumer:
        print(json.loads(message.value))
        # print(len(message.value))

if __name__ == "__main__":

    # warmup
   run_consumer()
