## Dependencies
- deepstream:5.0.1
- spdlog
- openblas
- faiss
- opencv
- eigen3

### Docker

### Build
```bash
mkdir build && cd build
cmake -DDeepStream_DIR=/opt/nvidia/deepstream/deepstream-5.0 -DPLATFORM_TEGRA=ON ..
make && make install
```

### Commands
```bash
export BOOTSTRAP_SERVER="192.168.101.52;9092"
export PRODUCER_TOPIC="test"
export COUNTING_TOPIC="nvdsanalytics"
export BOX_ID="1"
export PIPELINE_CONFIG="/workspace/data/pipelines/peoplecounting_v1.yaml"
export CONFIG='{"list_camera":[{"cam_info":{"url":"rtsp://guest:hd19012019@14.241.236.171:2551","cam_id":"1"},"config":{"direction":[],"zone":[{"ID":"scid-2551a","coord":[0.445,0.285,0.754,0.364],"axis":[0.625,0.26,0.558,0.444]},{"ID":"scid-2551b","coord":[0.298,0.458,0.752,0.632],"axis":[0.447,0.674,0.534,0.453]}],"heatmap":{},"layout":{}}}]}'
```

### Debug mode

```bash
export DEBUG=1
export URI=/workspace/videos/lamer.mp4
dump_config
gst-launch-1.0 -e nvstreammux name=m batched-push-timeout=40000 batch-size=4 width=1928 height=1084 \
  ! nvinfer config-file-path=/workspace/data/configs/pgie_x86.txt ! yoloxparser ! nvbytetrack ! nvdsanalytics config-file=/data/configs/analytics.txt \
  ! datafilter ! nvinfer config-file-path=/workspace/data/configs/sgie_x86.txt ! dataprocess ! queue ! nvmultistreamtiler rows=1 columns=1 width=1280 height=720 \
  ! nvvideoconvert ! nvdsosd ! nvvideoconvert ! nvv4l2h264enc ! h264parse ! mp4mux ! filesink location=$(dirname "${URI}")/$(basename -s .mp4 $URI)_AI.mp4 \
  uridecodebin source::latency=200 uri=file://$URI ! progressreport update-freq=10 ! m.sink_0
```

Functions:

- obj text params debug
- frame text params debug
- reID frame debug

## Env Variables Decription

| Name             |    Default Value    |     Description      | required |
| :--------------- | :-----------------: | :------------------: | :------: |
| BOOTSTRAP_SERVER | 192.168.30.151;9092 |     kafka server     |    yes   |
| HEALTHCHECK_TOPIC   |  TannedCung-faceid  | topic to send result |    no    |
| COUNTING_TOPIC   |  TannedCung-faceid  | topic to send gateway|    yes   |
| BOX_ID           |  test               | ID of Box            |    yes   |
| PIPELINE_CONFIG  |  sample.yaml        | path to pipeline     |    no   |
| CONFIG           |                     | config               |    yes   |



## Config description
[v4.1.1](https://git.cxview.ai/hoang.nguyentien/cxview-people-analytics-box-configure/-/wikis/%5Bv4.1.1%5D-People-Counting-Core-Box-Configure)

## Payload description
[v4.1.5](https://git.cxview.ai/hoang.nguyentien/cxview-people-analytics-payloads/-/wikis/%5Bv4.1.5%5D-People-Counting-Core-Box-Payload)


## Latest Changelogs
- 4.1.5
