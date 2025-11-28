CXX:= g++
SRCS:= $(wildcard bytetrack/*.cpp) gstnvbytetrack.cpp bytetrack_context.cpp
INCS:= $(wildcard bytetrack/*.h) gstnvbytetrack.h bytetrack_context.h
LIB:=gstnvbytetrack.so

$(info INCS="$(INCS)")

TARGET_DEVICE = $(shell g++ -dumpmachine | cut -f1 -d -)
NVDS_VERSION:=5.0

LIB_INSTALL_DIR?=/opt/nvidia/deepstream/deepstream-$(NVDS_VERSION)/lib/

ifeq ($(shell uname -m), aarch64)
GST_INSTALL_DIR?=/opt/nvidia/deepstream/deepstream-$(NVDS_VERSION)/lib/gst-plugins/
else
GST_INSTALL_DIR?=/usr/lib/x86_64-linux-gnu/gstreamer-1.0/
endif

CFLAGS+= -fPIC -DDS_VERSION=\"5.0.0\" \
	 -I/opt/nvidia/deepstream/deepstream-5.0/sources/includes

LIBS := -shared -Wl,-no-undefined
LIBS+= -L$(LIB_INSTALL_DIR) -lnvdsgst_helper -lnvds_meta -lnvdsgst_meta -ldl -lpthread \
      -Wl,-rpath,$(LIB_INSTALL_DIR)

OBJS:= $(SRCS:.cpp=.o)

PKGS:= gstreamer-1.0 gstreamer-base-1.0 gstreamer-video-1.0 eigen3
ifeq ($(shell uname -m), aarch64)
PKGS+= opencv4
else
PKGS+= opencv
endif
CFLAGS+= `pkg-config --cflags $(PKGS)`
LIBS+= `pkg-config --libs $(PKGS)`

ifeq ($(shell uname -m), aarch64)
CFLAGS+=-DIS_TEGRA
LIBS+=-lcuda
endif

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