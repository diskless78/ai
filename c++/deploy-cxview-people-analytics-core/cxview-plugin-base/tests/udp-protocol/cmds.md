=== valnilla ===
gst-launch-1.0 uridecodebin source::latency=200 uri="rtsp://admin:meditech123@192.168.100.90:554/" ! nvvideoconvert! capsfilter caps=video/x-raw,format=RGBA ! nveglglessink sync=false 

== rtsp -> udpsink ==
gst-launch-1.0 uridecodebin source::latency=200 source::protocols=4 uri=rtsp://admin:meditech123@192.168.100.90:554/ ! nvvideoconvert ! nvv4l2h264enc ! rtph264pay ! udpsink port=5001 sync=false

== udpsrc -> nveglglessink ==
gst-launch-1.0 udpsrc port=5001 ! application/x-rtp,media=video,clock-rate=90000,encoding-name=H264,payload=96 ! rtph264depay ! avdec_h264 ! nvvideoconvert! capsfilter caps=video/x-raw,format=RGBA ! nveglglessink sync=false 


=====================================================

== rtsp -> udpsink ==
gst-launch-1.0 uridecodebin source::latency=200 source::protocols=4 uri=rtsp://admin:meditech123@192.168.100.90:554/ ! nvvideoconvert ! jpegenc ! rtpjpegpay ! udpsink host=localhost port=5001 sync=false

== udpsrc -> nveglglessink ==
gst-launch-1.0 udpsrc port=5001 ! application/x-rtp,encoding-name=JPEG,payload=26 ! rtpjpegdepay ! jpegdec ! nvvideoconvert! capsfilter caps=video/x-raw,format=RGBA ! nveglglessink sync=false 

================ gstd ===============================

=== rtsp -> interpipesink ===
gst-client pipeline_create src uridecodebin source::latency=200 source::protocols=4 uri=rtsp://admin:meditech123@192.168.100.90:554/ ! nvvideoconvert ! capsfilter caps="video/x-raw(memory:NVMM),format=RGBA,width=1920,height=1080" ! interpipesink sync=false async=true name=src_0

gst-client pipeline_play src

gst-client pipeline_delete src

=== interpipesrc-> udp ===
gst-client pipeline_create mid interpipesrc format=time name=interpsrc_stream_0 listen-to=src_0 is-live=true allow-renegotiation=true accept-eos-event=false stream-sync=compensate-ts ! queue ! nvvideoconvert ! x264enc tune=zerolatency ! rtph264pay ! udpsink port=5001

gst-client pipeline_play mid

gst-client pipeline_delete mid

=== rtsp -> interpipe -> udp ===
gst-launch-1.0 uridecodebin source::latency=200 source::protocols=4 uri=rtsp://admin:meditech123@192.168.100.90:554/ ! nvvideoconvert ! capsfilter caps="video/x-raw(memory:NVMM),format=RGBA,width=1920,height=1080" ! interpipesink sync=false async=true name=src_0  interpipesrc format=time name=interpsrc_stream_0 listen-to=src_0 is-live=true allow-renegotiation=true accept-eos-event=false stream-sync=compensate-ts ! queue ! nvvideoconvert ! video/x-raw ! x264enc tune=zerolatency ! rtph264pay ! udpsink port=5001

== udpsrc -> nveglglessink ==
gst-launch-1.0 udpsrc port=5001 ! application/x-rtp,media=video,clock-rate=90000,encoding-name=H265,payload=96 ! rtph265depay ! nvv4l2decoder ! nvvideoconvert ! nvegltransform ! nveglglessink sync=false

=====================================================

=== fake src -> interpipesink ===
gst-client pipeline_create fake videotestsrc is-live=true ! capsfilter caps=video/x-raw,framerate=25/1 ! nvvideoconvert ! capsfilter caps="video/x-raw(memory:NVMM),format=RGBA,width=1920,height=1080" ! interpipesink sync=false async=true name=src_fake

=== real src 1 = -> interpipesink ==
=== real src 2 = -> interpipesink ==
=== real src 3 = -> interpipesink ==

gst-client pipeline_create 0 uridecodebin source::latency=200 source::protocols=4 uri=rtsp://admin:meditech123@192.168.100.90:554/ ! nvvideoconvert ! capsfilter caps="video/x-raw(memory:NVMM),format=RGBA,width=1920,height=1080" ! interpipesink sync=false async=true name=src_0
gst-client pipeline_create 1 uridecodebin source::latency=200 source::protocols=4 uri=rtsp://admin:meditech123@192.168.100.40:554/ ! nvvideoconvert ! capsfilter caps="video/x-raw(memory:NVMM),format=RGBA,width=1920,height=1080" ! interpipesink sync=false async=true name=src_1
gst-client pipeline_create 2 uridecodebin source::latency=200 source::protocols=4 uri=rtsp://admin:meditech123@192.168.100.41:554/ ! nvvideoconvert ! capsfilter caps="video/x-raw(memory:NVMM),format=RGBA,width=1920,height=1080" ! interpipesink sync=false async=true name=src_2


=== interpipesrc stream -> udpsink  ===
gst-client pipeline_create stream_0 interpipesrc accept-eos-event=false stream-sync=passthrough-ts name=interpsrc_stream_0 listen-to=src_fake ! queue ! nvvideoconvert ! 'video/x-raw(memory:NVMM),format=NV12,width=1280,height=720' ! tee name=t ! nvv4l2h264enc insert-sps-pps=1 EnableTwopassCBR=1 control-rate=0 bitrate=2000000 vbv-size=125000 ratecontrol-enable=0  ! h264parse ! rtph264pay config-interval=1 pt=96 ! udpsink port=5001 sync=0 t. ! queue ! fakesink

gst-client pipeline_create stream_1 interpipesrc accept-eos-event=false stream-sync=restart-ts name=interpsrc_stream_1 listen-to=src_fake ! queue ! nvvideoconvert ! 'video/x-raw(memory:NVMM),width=1280,height=720,interlace-mode=progressive' ! tee name=t ! nvv4l2h265enc EnableTwopassCBR=1 control-rate=0 bitrate=2000000 vbv-size=125000 ! h265parse ! rtph265pay config-interval=1 pt=96 ! udpsink port=5002 sync=0 t. ! queue ! fakesink sync=0
gst-client pipeline_create stream_2 interpipesrc accept-eos-event=false stream-sync=restart-ts name=interpsrc_stream_2 listen-to=src_0 ! queue ! nvvideoconvert ! 'video/x-raw(memory:NVMM),width=1280,height=720,interlace-mode=progressive' ! tee name=t ! nvv4l2h264enc EnableTwopassCBR=1 control-rate=0 bitrate=2000000 vbv-size=125000 ! h264parse ! rtph264pay config-interval=1 pt=96 ! udpsink port=5003 sync=0 t. ! queue ! fakesink sync=0

=== interpipesrc main -> any sinks === 
gst-client pipeline_create main nvstreammux name=m batched-push-timeout=40000 batch-size=4 width=1928 height=1084 ! nvvideoconvert ! nvmultistreamtiler rows=2 columns=2 width=1920 height=1080 ! nvvideoconvert ! nveglglessink sync=false async=true \
    interpipesrc accept-eos-event=false stream-sync=restart-ts name=interpipesrc0 listen-to=src_fake ! m.sink_0 \
    interpipesrc accept-eos-event=false stream-sync=restart-ts name=interpipesrc1 listen-to=src_fake ! m.sink_1 \
    interpipesrc accept-eos-event=false stream-sync=restart-ts name=interpipesrc2 listen-to=src_fake ! m.sink_2

gst-client pipeline_play fake

gst-client pipeline_play 0
gst-client pipeline_play 1
gst-client pipeline_play 2

gst-client pipeline_play stream_0
gst-client pipeline_play stream_1
gst-client pipeline_play stream_2

gst-client pipeline_play main

gst-client pipeline_delete fake
gst-client pipeline_delete 1
gst-client pipeline_delete stream_0
gst-client pipeline_delete stream_1
gst-client pipeline_delete stream_2

gst-client pipeline_delete main

gst-client pipeline_stop stream_0
gstd-client element_set stream_0 interpsrc_stream_0 listen-to src_0
gst-client pipeline_play stream_0

gstd-client element_set main interpipesrc1 listen-to src_1
gstd-client element_set main interpipesrc2 listen-to src_2


----- switch udp -----
gst-client pipeline_stop stream_1
gstd-client element_set stream_0 interpsrc_stream_0 listen-to src_0
gstd-client element_set stream_1 interpsrc_stream_1 listen-to src_1
gstd-client element_set stream_2 interpsrc_stream_2 listen-to src_2
gst-client pipeline_play stream_1


====================== Jetson ===================

=== rtsp -> udp ===
gst-launch-1.0 uridecodebin source::latency=200 uri="rtsp://admin:meditech123@192.168.100.41:554/" ! nvvideoconvert ! 'video/x-raw(memory:NVMM),format=NV12,width=1280,height=720' ! tee name=t ! nvv4l2h265enc insert-sps-pps=1 EnableTwopassCBR=1 control-rate=0 bitrate=4000000 vbv-size=250000 ! h265parse ! rtph265pay config-interval=1 pt=96 ! udpsink port=5003 sync=0 t. ! queue ! fakesink

=== udp -> sink ===
gst-launch-1.0 udpsrc port=5001 ! 'application/x-rtp,encoding-name=H265,payload=96' ! rtph265depay ! avdec_h265 ! nvvideoconvert ! nvegltransform ! nveglglessink sync=0

>>> nvv4l2h265enc caps
video/x-raw(memory:NVMM), width=(int)1280, height=(int)720, interlace-mode=(string)progressive, pixel-aspect-ratio=(fraction)1/1, framerate=(fraction)25/1, format=(string)NV12

>>> h265parse caps
/GstPipeline:pipeline0/GstH265Parse:h265parse0.GstPad:src: caps = video/x-h265, stream-format=(string)hvc1, alignment=(string)au, profile=(string)main, width=(int)1280, height=(int)720, pixel-aspect-ratio=(fraction)1/1, framerate=(fraction)25/1, interlace-mode=(string)progressive, colorimetry=(string)bt709, chroma-site=(string)mpeg2, chroma-format=(string)4:2:0, bit-depth-luma=(uint)8, bit-depth-chroma=(uint)8, parsed=(boolean)true, tier=(string)main, level=(string)3.1, codec_data=(buffer)0101400000000000000000005df000fcfdf8f800000f03200001001840010c01ffff0140000003000003000003000003005dac0921000100214201010140000003000003000003000003005da00280802e1f1396b7908444b82022000100074401c073c0cc90