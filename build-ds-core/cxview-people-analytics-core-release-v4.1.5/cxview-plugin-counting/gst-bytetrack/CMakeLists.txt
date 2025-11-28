cmake_minimum_required(VERSION 3.9 FATAL_ERROR)

project(gst-bytetrack LANGUAGES C CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(GST_INSTALL_DIR /usr/lib/x86_64-linux-gnu/gstreamer-1.0/)

include_directories(/usr/local/include/eigen3)

find_package(PkgConfig)
pkg_check_modules(GST REQUIRED gstreamer-1.0>=1.4
  gstreamer-base-1.0>=1.4)