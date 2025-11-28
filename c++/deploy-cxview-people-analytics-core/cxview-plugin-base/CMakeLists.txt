cmake_minimum_required(VERSION 3.9 FATAL_ERROR)

project(cxview-plugin-base LANGUAGES C CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
# set(GST_INSTALL_DIR /usr/lib/x86_64-linux-gnu/gstreamer-1.0/)

find_package(PkgConfig)
pkg_check_modules(GST REQUIRED gstreamer-1.0>=1.4
  gstreamer-base-1.0>=1.4)

if(DEFINED DeepStream_DIR)
  include_directories("${DeepStream_DIR}/sources/includes/")
  link_directories("${DeepStream_DIR}/lib")
endif(DEFINED DeepStream_DIR)
include_directories(${GST_INCLUDE_DIRS})
message(STATUS "====================${GST_LIBRARIES}")

set(CMAKE_POSITION_INDEPENDENT_CODE ON)  # -fPIC tag

include_directories(common core nvdsincludes)
aux_source_directory(common common_files)
aux_source_directory(core core_files)

add_library(utils SHARED
${common_files}
)
target_link_libraries(utils PRIVATE yaml-cpp)

aux_source_directory(plugins/gst-kafka gstkafka_files)
add_library(gstkafka SHARED
  ${gstkafka_files}
)
message(gstkafka_files "====================${gstkafka_files}")
target_link_libraries(gstkafka PRIVATE nvds_msgbroker
  utils gstc-1.0
  ${GST_LIBRARIES})
set_target_properties(gstkafka PROPERTIES INSTALL_RPATH_USE_LINK_PATH ON)

aux_source_directory(plugins/gst-superviser gstsuperviser_files)
add_library(gstsuperviser SHARED
  ${gstsuperviser_files}
  ${core_files}
)
message(gstsuperviser_files "====================${gstsuperviser_files}")
target_link_libraries(gstsuperviser PRIVATE
  utils gstc-1.0 dl
  ${GST_LIBRARIES})

aux_source_directory(plugins/gst-periodsrc periodsrc_files)
add_library(gstperiodsrc SHARED
  ${periodsrc_files}
)
message(periodsrc_files "====================${periodsrc_files}")
target_link_libraries(gstperiodsrc PRIVATE
  utils gstc-1.0
  ${GST_LIBRARIES})

aux_source_directory(plugins/gst-src-monitor srcmonitor_files)
add_library(gstsrcmonitor SHARED
  ${srcmonitor_files}
)
message(srcmonitor_files "====================${srcmonitor_files}")
target_link_libraries(gstsrcmonitor PRIVATE
  nvds_meta nvdsgst_meta
  utils
  ${GST_LIBRARIES})
set_target_properties(gstsrcmonitor PROPERTIES INSTALL_RPATH_USE_LINK_PATH ON)

if(DEFINED PLATFORM_TEGRA)
  set(GST_INSTALL_DIR /usr/lib/aarch64-linux-gnu/gstreamer-1.0/)
else()
  set(GST_INSTALL_DIR /usr/lib/x86_64-linux-gnu/gstreamer-1.0/)
endif()

install(
  TARGETS utils
  LIBRARY DESTINATION lib
)

install(
  TARGETS gstperiodsrc gstsuperviser gstkafka gstsrcmonitor
  LIBRARY DESTINATION ${GST_INSTALL_DIR}
)
