#pragma once

#ifndef __COMMON_H__
#define __COMMON_H__

#include <string>
#include <vector>
#include <chrono>
#include <unordered_map>
#include <opencv2/opencv.hpp>

#include "nvll_osd_struct.h"

#ifdef __cplusplus
extern "C"
{
#endif

#define FAISS_DATABASE "/external_data"
#define ANALYTICS_CONFIG_FILE "/data/configs/analytics.txt"
#define TOPIC "nvdsanalytics"
#define SERVER "iedge.iview.vn;9092"
#define MAX_NUM_SOURCES 4
#define MUXER_OUTPUT_WIDTH 1920
#define MUXER_OUTPUT_HEIGHT 1080
#define EMB_DIM 512
#define FAISS_REFRESH_INTERVAL 12.0   	    // hours
#define FAISS_DISTANCE_THRESHOLD 0.70       // faiss
#define TRACK_LIFE_TIMEOUT 15               // seconds
#define AVERAGE_TIME_TIMEOUT 0.5            // minutes
#define HEATMAP_REFRESH_INTERVAL 5 		      // minutes
#define HEATMAP_MUTATION_STDEV 10.0         // check mutation point
#define PENALTY_INTERVAL 10                 // seconds
#define HM_ROI_KEY "HM"                     // prefix added to roi_id for heatmap
#define OUT_LINE_KEY "OUT"                  // prefix added to roi_id for counting turns out
#define ONE_THOUSAND_MILLISECONDS 1000.0    // milliseconds
#define TIME_TO_DECIDE_COUNT_ZONE 3         // seconds

enum RoiType {OUTSIDE, ENTRY, CHECKOUT, STALL, IGNORE};


typedef struct _BoxData{
  float left;
  float top;
  float width;
  float height;
  float x_foot;
  float y_foot;
  float stdev;
} BoxData;


typedef struct _POINT
{
	float x;
	float y;
} POINT;


typedef struct _PolygonPoint{
  int x;
  int y;
} PolygonPoint;


typedef struct AnalyticsData
{
	std::chrono::system_clock::time_point now;
	int obj_id;

  // bbox
  NvOSD_RectParams rect_params;

  // line
  bool is_entry = false;
	std::string line_id;
  std::vector<float> emb;

	// roi
  bool is_stall = false;
	std::vector <std::string> roiStatus;
	BoxData box_data;

	// route
	std::string route_id;
} AnalyticsData;


typedef struct _RoiData
{
	/***
	last_update: 			last_update của object trong vùng cấu hình ()
	dwell_time: 		thời gian object trong vùng cấu hình
	***/
	std::chrono::system_clock::time_point last_update;
	int dwell_time = 0;  // ms
  std::vector<float> stdev_data;
	RoiType type;
} RoiData;


typedef struct _DebugMsg
{
	std::string line_msg;
	std::string roi_msg;
	std::string dir_msg;
} DebugMsg;


typedef struct _EntryObject {
	std::chrono::system_clock::time_point entry_time;
	std::string line_id;
} EntryObject;


typedef struct _TrackObject {
	uint64_t person_id;
  int obj_id;
	std::vector<POINT> list_points;
  std::chrono::system_clock::time_point last_update;
	DebugMsg text_params;  // for debug

  // counting
  float score=-1.0f;  //  reID score, default=-1.0 (not search yet)
  int obj_reid=-1;  //  person ID
	bool line_out = false;  // save last status of line of obj
	bool was_out = false;  // save last status of line of obj was go out
	int dwell_time=0;  // save time of obj if average time func is enabled
  std::string line_id;
  std::chrono::system_clock::time_point entry_time;

  // stall time
  std::vector<std::string> ignore_stall;  // ignore if obj is initialized inside stall zone
	std::unordered_map<std::string, RoiData*> roi_time;	 	 // {roi_id: ROI_DATA}
	std::chrono::system_clock::time_point last_penalty;

  // heatmap
	std::chrono::system_clock::time_point last_update_heatmap;
	std::vector<int> normal_grid_time;
  std::vector<int> layout_grid_time;
	bool is_first_in_heatmap_roi=false;
	bool is_penalty = false;
	float last_stdev = HEATMAP_MUTATION_STDEV;
	float penalty_weight = 0.0;

	// routemap
	std::unordered_map<std::string, int> route_data;	 	 // {roi_id: ROI_DATA}

} TrackObject;


typedef struct CameraData {
    float faiss_interval;
    float faiss_threshold;
    std::unordered_map<std::string, std::vector<PolygonPoint>> entry_lines;
    std::unordered_map<std::string, std::vector<PolygonPoint>> heatmap_polygon;
    std::unordered_map<std::string, RoiType> zone_analytics;
    std::string config;
    std::string cam_id;
    std::string url;
    std::vector<int> scale;  // heatmap scale: [0]-width, [1]-height
    std::string layout_id;
    std::vector<int> layout_scale;  // heatmap layout scale: [0]-width, [1]-height
    std::vector<float> layout_grid_size;
    cv::Mat matrix;
    bool is_heatmap = false;
    bool is_layout = false;
    bool is_reid = false;
    bool is_staff_index = false;
    int gender_usage;
} CameraData;


#ifdef __cplusplus
}
#endif
#endif