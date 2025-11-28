CXX:= g++
SRCS:= gstsuperviser.cpp
SRCS+= /workspace/cxview-plugin-base/common/utils.cpp
SRCS+= /workspace/cxview-plugin-base/core/pipeline.cpp
INCS:= gstsuperviser.h
LIB:=gstsuperviser.so

TARGET_DEVICE = $(shell g++ -dumpmachine | cut -f1 -d -)

GST_INSTALL_DIR?=/usr/lib/x86_64-linux-gnu/gstreamer-1.0/
LIB_INSTALL_DIR?=/opt/nvidia/deepstream/deepstream-5.0/lib/

RDKAFKA_INC:=/usr/local/include/librdkafka
YAML_INC:=/usr/local/include/yaml-cpp
GSTD_INC:=/usr/local/include/gstd


CFLAGS+= -fPIC -DDS_VERSION=\"5.0.0\" \
	 -I/opt/nvidia/deepstream/deepstream-5.0/sources/includes \
	 -I $(RDKAFKA_INC) -I $(YAML_INC) -I $(GSTD_INC)

DS_LIB:=/opt/nvidia/deepstream/deepstream-5.0/lib
LIBS := -shared -Wl,-no-undefined
LIBS+= -L$(LIB_INSTALL_DIR) -L$(DS_LIB)-lnvdsgst_helper -lyaml-cpp -lrdkafka -lnvds_meta -lnvdsgst_meta -ldl -lnvds_msgbroker -lgstc-1.0 \
       -Wl,-rpath,$(LIB_INSTALL_DIR)

OBJS:= $(SRCS:.cpp=.o)

PKGS:= gstreamer-1.0 gstreamer-base-1.0
CFLAGS+= `pkg-config --cflags $(PKGS)`
LIBS+= `pkg-config --libs $(PKGS)`

DS_INC:=/opt/nvidia/deepstream/deepstream-5.0/sources/includes/
CM_INC:=/workspace/cxview-plugin-base/common
PL_INC:=/workspace/cxview-plugin-base/core
CFLAGS+= -I $(DS_INC)
CFLAGS+= -I $(CM_INC)
CFLAGS+= -I $(PL_INC)

all: $(LIB)

%.o: %.cpp $(INCS) Makefile
	@echo $(CFLAGS)
	$(CXX) -c -o $@ $(CFLAGS) $<

$(LIB): $(OBJS) $(DEP) Makefile
	$(CXX) -o $@ $(OBJS) $(LIBS)

install: $(LIB)
	cp -rv $(LIB) $(GST_INSTALL_DIR)

clean:
	rm -rf $(OBJS) $(LIB)