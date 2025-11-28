GStreamer 1.14.5 - Custom build rtspsrc plugin
Add new property: select-stream-id

## Build from source
```
git clone https://github.com/GStreamer/gst-plugins-good.git
git checkout 1.14.5
```

### Install
```
git clone https://git.cxview.ai/hoang.nguyentien/cxview-gst-plugins-good
```

### Dependencies
```
apt-get update && apt-get install -y python3-pip python3-setuptools python3-wheel ninja-build
pip3 install meson
```

### Build
```
meson build
ninja -C build

!update only rtspsrc
cp build/gst/rtsp/libgstrtsp.so /usr/lib/$(uname -m)-linux-gnu/gstreamer-1.0/
```

### Check
```
ls /usr/lib/$(uname -m)-linux-gnu/gstreamer-1.0/libgstrtsp.so
gst-inspect-1.0 rtspsrc
```

### Example
```
gst-launch-1.0 \
  uridecodebin uri=rtsp://bigchaiphong:genviet123@bigchaiphong.cameraddns.net:554/streaming/channels/101 source::latency=200 source::protocols=4 source::select-stream-id=0 ! m.sink_0 \
  nvstreammux name=m batch-size=1 width=1928 height=1084 \
  ! nvmultistreamtiler rows=1 columns=1 width=1280 height=720 ! nvvideoconvert ! nvdsosd ! nveglglessink sync=false async=true
```
