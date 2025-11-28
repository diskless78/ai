# Build deploy

## X86
### Base
```bash
docker build -t hub.cxview.ai/deepstream-people:0.1-base-x86 -f deploy/Dockerfile.base.x86 .
```

### Application
```bash
docker build -t hub.cxview.ai/ds-core:x.x.x -f deploy/Dockerfile.x86 .
```

### Run image (for deverlop)
```bash
docker run --runtime nvidia -itd --ipc=host --net=host --privileged --name ds-core -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix -v /path/to/project/:/workspace hub.cxview.ai/deepstream-people:0.1-base-x86
```

## Box
### Base
```bash
docker build -t hub.cxview.ai/deepstream-people:0.1.0-base-aarch -f deploy/Dockerfile.base.aarch .
```

### Application
```bash
docker build -t hub.cxview.ai/ds-core:x.x.x -f deploy/Dockerfile.aarch .
```

### Run image (for deverlop)
```bash
docker run --runtime nvidia -itd --ipc=host --net=host --name ds-test \
   -e BOX_ID="" \
   -e CONFIG='' \
   -e BOOTSTRAP_SERVER="" \
   -e PRODUCER_TOPIC="" \
   -e COUNTING_TOPIC="" \
   hub.cxview.ai/ds-core:x.x.x
```