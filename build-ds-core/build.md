ZuHeFSBPusuj&3U

# cxview-base
apt update
apt install -y cmake build-essential git pkg-config
sudo apt install -y libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev
sudo apt install libyaml-cpp-dev

git clone --branch v0.2.3 --single-branch https://gitlab.cxview.local/MDT_AI_PROJECT/cxview-plugin-base.git

cd cxview-plugin-base
docker login -u admin -p 'CxViewAdmin@2025' harbor.cxview.local
docker build -t harbor.cxview.local/platform/cxview-plugin-base:v0.2.3-x86 -f docker/Dockerfile.x86 .
docker push harbor.cxview.local/platform/cxview-plugin-base:v0.2.3-x86

# people counting

docker run --runtime nvidia -it -v "$(pwd)":/workspace   --name cxview-plugin-building   harbor.cxview.local/platform/cxview-plugin-base:v0.2.3-x86  /bin/bash

docker exec -it 2de0a2b81bb9 /bin/bash

# Build YOLOX C++
cd /workspace/cxview-plugin-counting/yolox/cpp
mkdir build && cd build

# DPLATFORM_TEGRA=OFF is for x86 build

cmake \
 -DDeepStream_DIR=/opt/nvidia/deepstream/deepstream-5.0 \
 -DPLATFORM_TEGRA=OFF \
 -DCMAKE_BUILD_TYPE=Release \
 -DCUDA_TOOLKIT_ROOT_DIR=/usr/local/cuda-10.2 \
 -DCMAKE_CUDA_FLAGS="-std=c++14 --expt-extended-lambda" \
 ..

make -j$(nproc)


# Build gst-bytetrack
cd /workspace/cxview-plugin-counting/gst-bytetrack
make -j4
make install


# Update the GStreamer plugin cache
gst-inspect-1.0 --rebuild-registry
# Verify the plugin is installed
gst-inspect-1.0 nvbytetrack

gst-launch-1.0 --gst-plugin-load=/research/object_tracking/git/gst-bytetrack/gstnvbytetrack.so fakesrc ! nvbytetrack ! fakesink

# Build gst-datafilter
make clean
make -j$(nproc)
make install

# Build core_app
cd /workspace/

mkdir build_app && cd build_app

cmake -DDeepStream_DIR=/opt/nvidia/deepstream/deepstream-5.0 ..
make -j$(nproc)
make install

