CXX:= g++
SRCS:= gstdatafilter.cpp 							\
	 /workspace/includes/utility.cpp
		
INCS:= $(wildcard *.h)
LIB:=libnvdsgst_datafilter.so

NVDS_VERSION:=5.0

CFLAGS+= -fPIC -std=c++11 -DDS_VERSION=\"5.0.0\" 		\
		-I /workspace/cxview-plugin-base/common		 	\
		-I /workspace/cxview-plugin-base/nvdsincludes   \
		-I /workspace/metadata						 	\
		-I /workspace/includes					 	 	\


GST_INSTALL_DIR?=/opt/nvidia/deepstream/deepstream-$(NVDS_VERSION)/lib/gst-plugins/
LIB_INSTALL_DIR?=/opt/nvidia/deepstream/deepstream-$(NVDS_VERSION)/lib/

LIBS := -shared -Wl,-no-undefined \
	# -L/usr/local/cuda-$(CUDA_VER)/lib64/ -lcudart

LIBS+= -L$(LIB_INSTALL_DIR) -lnvdsgst_meta -lnvds_meta \
       -Wl,-rpath,$(LIB_INSTALL_DIR)

OBJS:= $(SRCS:.cpp=.o)

PKGS:= glib-2.0 gobject-2.0 gstreamer-1.0 gstreamer-base-1.0 gstreamer-video-1.0
ifeq ($(shell uname -m), aarch64)
PKGS+= opencv4
else
PKGS+= opencv
endif
CFLAGS+=$(shell pkg-config --cflags $(PKGS))
LIBS+=$(shell pkg-config --libs $(PKGS))

ifeq ($(shell uname -m), aarch64)
CFLAGS+=-DIS_TEGRA
LIBS+=-lcuda
endif

all: $(LIB)

%.o: %.cpp $(INCS) Makefile
	$(CXX) -c -o $@ $(CFLAGS) $<

$(LIB): $(OBJS) $(DEP) Makefile
	$(CXX) -o $@ $(OBJS) $(LIBS)

install: $(LIB)
	cp -rv $(LIB) $(GST_INSTALL_DIR)

clean:
	rm -rf $(OBJS) $(LIB)