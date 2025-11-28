#pragma once

#include <string>
#include <vector>
#include <random>
#include <numeric>
#include <math.h>

#include "nlohmann/json.hpp"
#include "common.h"

using json = nlohmann::json;

/*
check whether the type of the roi ID is heatmap_id
*/
bool is_heatmap_roi_id(std::string& ID);

/*
check whether the type of the line ID is line_out_id
*/
bool is_line_out_id(std::string& ID, bool rm_key);

float cal_stdev(std::vector<float>& v);

float get_stdev_obj(TrackObject* trk);

/*
transform point to layout point
*/
POINT transform_point(POINT& point, cv::Mat& matrix);

/*
*/
nlohmann::json create_payload(std::chrono::system_clock::time_point time);

bool onSegment(PolygonPoint p, PolygonPoint q, PolygonPoint r);
int orientation(PolygonPoint p, PolygonPoint q, PolygonPoint r);
bool doIntersect(PolygonPoint p1, PolygonPoint q1, PolygonPoint p2, PolygonPoint q2);
bool is_centroid_in_roi(std::vector<PolygonPoint> polygon, POINT p);
bool is_line_intersection(BoxData box, std::vector<PolygonPoint> entry_line);
uint64_t genPersonID();