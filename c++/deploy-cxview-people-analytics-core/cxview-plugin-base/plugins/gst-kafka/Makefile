CXX:= g++
SRCS:= gstkafkasink.cpp
# SRCS+= gstkafkasrc.cpp
SRCS+= gstkafkaplugin.cpp
SRCS+= /workspace/cxview-plugin-base/common/utils.cpp

INCS:= gstkafkasink.h
# INCS+= gstkafkasrc.h
INCS+= gstkafka.h

LIB:=gstkafka.so

TARGET_DEVICE = $(shell g++ -dumpmachine | cut -f1 -d -)

GST_INSTALL_DIR?=/usr/lib/x86_64-linux-gnu/gstreamer-1.0/
LIB_INSTALL_DIR?=/opt/nvidia/deepstream/deepstream-5.0/lib/

RDKAFKA_INC:=/usr/local/include/librdkafka
CFLAGS+= -fPIC -DDS_VERSION=\"5.0.0\" \
	 -I/opt/nvidia/deepstream/deepstream-5.0/sources/includes \
	 -I $(RDKAFKA_INC)

DS_LIB:=/opt/nvidia/deepstream/deepstream-5.0/lib
LIBS := -shared -Wl,-no-undefined
LIBS+= -L$(LIB_INSTALL_DIR) -L$(DS_LIB) -lgstc-1.0 -lyaml-cpp -lnvdsgst_helper -lrdkafka -lnvds_meta -lnvdsgst_meta -ldl -lnvds_msgbroker \
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