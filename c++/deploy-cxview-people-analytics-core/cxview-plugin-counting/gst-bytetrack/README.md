# Updates!!

**2022/11/23**: Update max-alive property: use time instead number of frames, default = 1000ms
**2022/12/08**: Fix [#1](/../../issues/1)


# Install

```bash
make -j4
make install
```

# Tutorial

`gst-launch-1.0 --gst-plugin-load=/research/object_tracking/git/gst-bytetrack/gstnvbytetrack.so fakesrc ! nvbytetrack ! fakesink`

## Debug mode

`export DEBUG=1`

- write track_id to text_params

# Note

default params were setup for peoplenet