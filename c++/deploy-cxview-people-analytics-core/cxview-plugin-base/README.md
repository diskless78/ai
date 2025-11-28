## Dependencies

- deepstream:5.0.1
- yaml-cpp-0.7.0: Build command = `env CFLAGS='-fPIC' CXXFLAGS='-fPIC' cmake -DCMAKE_BUILD_TYPE=Release ..`
- spdlog

## Tutorial

### Docker

```bash
docker build -t hub.cxview.ai/cxview-plugin:0.2.3-base-x86 -f docker/Dockerfile.x86 .
docker build -t hub.cxview.ai/cxview-plugin:0.2.3-base-aarch -f docker/Dockerfile.aarch .
docker run --gpus all -itd --ipc=host --net=host --privileged --name cxview-plugin-base \
  -e DISPLAY=$DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  hub.cxview.ai/cxview-plugin:0.2.3-base-x86
```

### Build
```bash
cmake -DDeepStream_DIR=/opt/nvidia/deepstream/deepstream-5.0 \
  -DPLATFORM_TEGRA=ON ..
```

### Commands
```bash
export BOOTSTRAP_SERVER=BOOTSTRAP_SERVER
export PRODUCER_TOPIC=PRODUCER_TOPIC
export BOX_ID=boxid
export PIPELINE_CONFIG="/workspace/cxview-plugin-base/config/sample.yaml"
export CONFIG='{"list_camera":[{"cam_info":{"url":"rtsp://admin:meditech123@192.168.100.90:554/","cam_id":"1"},"config":{"cf1":"v1", "udp":true}},{"cam_info":{"url":"rtsp://admin:meditech123@192.168.100.90:554/","cam_id":"3"},"config":{"cf1":"v1", "udp":true}},{"cam_info":{"url":"rtsp://admin:meditech123@192.168.100.90:554/","cam_id":"4"},"config":{"cf1":"v1", "udp":true}}]}'

gst-launch-1.0 --gst-plugin-path="/workspace/cxview-plugin-base/build" \
  periodsrc interval=60 ! superviser pipe-parser-lib="/data/lib/libcustomparser.so" pipe-parser-name="CustomParser" \
  ! kafkasink proto-lib=/workspace/cxview-plugin-base/plugins/gst-kafka/kafka_protocol_adaptor/libnvds_kafka_proto.so config=/workspace/cxview-plugin-base/plugins/gst-kafka/cfg_kafka.txt
```

### Yaml ENV support

Example: Use batch from ENV variable `export BATCHSIZE=4`

```yaml
main_pipeline: "nvstreammux name=m batched-push-timeout=40000 batch-size=$BATCHSIZE width=1920 height=1080 ! nvmultistreamtiler rows=2 columns=2 width=1920 height=1080 ! nvvideoconvert ! nveglglessink sync=false async=true"
``` 

## Env Variables Decription

### gstkafkasink

| Name             |    Default Value    |     Description      | required |
| :--------------- | :-----------------: | :------------------: | :------: |
| BOOTSTRAP_SERVER | 192.168.30.151;9092 |     kafka server     |    no    |
| HEALTHCHECK_TOPIC   |  TannedCung-faceid  | topic to send result |    no    |

### gstsuperviser

| Name            | Default Value |            Description            | required |
| :-------------- | :-----------: | :-------------------------------: | :------: |
| CONFIG          |               |         list camera, ...          |   yes    |
| PIPELINE_CONFIG |               | config for a specific application |    no    |
| BOX_ID          |               |               boxid               |   yes    |


## Features

- Giám sát camera, show main pipe fps
- Tùy chọn main pipeline cho từng app
- Không ảnh hưởng luồng thì thay đổi cam (**cần test thêm**)
- Custom parse pipeline config tùy nhu cầu (ví dụ `tests/dummy_parser`)
- PIPELINE_CONFIG có 2 cách: qua `main-pipeline-config` (property của superviser) hoặc env


## Latest update: [0.2.x] 25-08-2022

### Fixed

### Added

### Change

