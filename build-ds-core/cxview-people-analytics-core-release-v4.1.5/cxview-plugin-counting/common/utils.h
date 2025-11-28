#pragma once

#include <gst/gst.h>
#include <string>
#include <fstream>
#include <vector>

#include "spdlog/spdlog.h"
#include <opencv2/highgui/highgui.hpp>
#include "opencv2/opencv.hpp"
#include "nlohmann/json.hpp"
#include "common.h"

using json = nlohmann::json;
using namespace std;


void generate_ts_rfc3339 (char *buf, int buf_size);

vector<POINT> create_coords(const vector<float>& xyxy);

gboolean parse_config(CameraData* cam_data_list, char const* config);

gboolean dump_config(CameraData *g_cam_data_list, std::string cfg_file);

void l2_norm(std::vector<float> &emb);