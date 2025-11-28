#pragma once

#include <string>
#include <iostream>
#include <locale>
#include <iomanip>
#include <gst/gst.h>
#include "yaml-cpp/yaml.h"

#include "spdlog/spdlog.h"
#include "spdlog/async.h"
#include "spdlog/sinks/stdout_color_sinks.h" // or "../stdout_sinks.h" if no colors needed
#include "spdlog/sinks/daily_file_sink.h"

#include "common.h"

void setup_logger();

gboolean parse_config(CameraData* cam_data_list, char const* config);

gboolean parse_yaml(const char* pipeline_config, std::string &main_pipeline);
