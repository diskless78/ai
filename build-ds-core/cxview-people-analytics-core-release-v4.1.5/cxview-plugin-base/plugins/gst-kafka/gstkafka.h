#ifndef __GST_KAFKA_H_
#define __GST_KAFKA_H_

#include "nvds_msgapi.h"
#include "nvmsgbroker.h"
#include <utils.h>
#include <dlfcn.h>

#define DEFAULT_USE_NEW_API FALSE
#define DEFAULT_CONN_STR "192.168.30.151;9092"
#define DEFAULT_CONSUME_TOPIC "TannedCung"
#define DEFAULT_PRODUCE_TOPIC "TannedCung-faceid"
#define DEFAULT_PROTOLIB "/data/lib/libnvds_kafka_proto.so"
#define DEFAULT_CONFIG_FILE "/data/config/cfg_kafka.txt"
#define DEFAULT_CONSUMER_GROUP "test-consumer-group"

#endif // __GST_ZMQ_H_
