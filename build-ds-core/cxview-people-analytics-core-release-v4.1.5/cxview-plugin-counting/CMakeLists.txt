cmake_minimum_required(VERSION 3.9 FATAL_ERROR)

project(cxview-plugin-counting LANGUAGES C CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(OpenCV REQUIRED)
find_package(PkgConfig)
pkg_check_modules(GST REQUIRED gstreamer-1.0>=1.4
  gstreamer-base-1.0>=1.4)

include_directories(${OpenCV_INCLUDE_DIRS})
include_directories(${GST_INCLUDE_DIRS})
if(DEFINED DeepStream_DIR)
  include_directories("${DeepStream_DIR}/sources/includes/")
  link_directories("${DeepStream_DIR}/lib")
endif(DEFINED DeepStream_DIR)
message(STATUS "====================${GST_LIBRARIES}")

set(CMAKE_POSITION_INDEPENDENT_CODE ON)  # -fPIC tag

include_directories(common)

aux_source_directory(common common_files)
add_library(counting_utils SHARED
${common_files}
)
target_link_libraries(counting_utils PRIVATE ${OpenCV_LIBS})

aux_source_directory(gst-datafilter gstdatafilter_files)
add_library(gstdatafilter SHARED
  ${gstdatafilter_files}
)
message(gstdatafilter_files "====================${gstdatafilter_files}")
target_link_libraries(gstdatafilter PRIVATE
  nvds_meta nvdsgst_meta nvds_batch_jpegenc
  counting_utils
  ${GST_LIBRARIES})
set_target_properties(gstdatafilter PROPERTIES INSTALL_RPATH_USE_LINK_PATH ON)

aux_source_directory(gst-dataprocess gstdataprocess_files)
add_library(gstdataprocess SHARED
  ${gstdataprocess_files}
)
message(gstdataprocess_files "====================${gstdataprocess_files}")
target_link_libraries(gstdataprocess PRIVATE
  ${GST_LIBRARIES} ${OpenCV_LIBS}
  nvds_meta nvdsgst_meta
  counting_utils
  faiss)
set_target_properties(gstdataprocess PROPERTIES INSTALL_RPATH_USE_LINK_PATH ON)

add_executable(dump_config tools/dump_config.cpp)
target_link_libraries(dump_config counting_utils
  ${OpenCV_LIBS} ${GST_LIBRARIES})

if(DEFINED PLATFORM_TEGRA)
  set(GST_INSTALL_DIR /usr/lib/aarch64-linux-gnu/gstreamer-1.0/)
else()
  set(GST_INSTALL_DIR /usr/lib/x86_64-linux-gnu/gstreamer-1.0/)
endif()

install(
  TARGETS counting_utils
  LIBRARY DESTINATION lib
)

install(
  TARGETS dump_config gstdatafilter gstdataprocess
  RUNTIME DESTINATION bin
  LIBRARY DESTINATION ${GST_INSTALL_DIR}
)
