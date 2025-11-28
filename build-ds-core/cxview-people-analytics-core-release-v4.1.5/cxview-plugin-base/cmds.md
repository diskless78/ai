export PIPELINE_CONFIG="/workspace/cxview-plugin-base/config/sample.yaml"
export CONFIG='{"list_camera":[{"cam_info":{"url":"rtsp://admin:meditech123@192.168.100.40:554/","cam_id":"1"},"config":{"cf1":"v1"}},{"cam_info":{"url":"rtsp://admin:meditech123@192.168.100.90:554/","cam_id":"3"},"config":{"cf1":"v1"}},{"cam_info":{"url":"rtsp://admin:meditech123@192.168.100.41:554/","cam_id":"4"},"config":{"cf1":"v1"}}]}'
export BOX_ID="Hi123"

gst-launch-1.0 --gst-plugin-load="/workspace/cxview-plugin-base/build/libgstperiodsrc.so,/workspace/cxview-plugin-base/build/libgstsuperviser.so,/workspace/cxview-plugin-base/build/libgstkafka.so" periodsrc interval=60 ! superviser ! kafkasink proto-lib=/workspace/cxview-plugin-base/plugins/gst-kafka/kafka_protocol_adaptor/libnvds_kafka_proto.so config=/workspace/cxview-plugin-base/plugins/gst-kafka/cfg_kafka.txt


export BOOTSTRAP_SERVER="192.168.100.89;9092"
export PRODUCER_TOPIC=TannedCung
export CONFIG_KAFKA=/workspace/cxview-plugin-base/plugins/gstkafka/cfg_kafka.txt

export PROTO_LIB=/workspace/search-v3/core/kafka_protocol_adaptor/libnvds_kafka_proto.so
