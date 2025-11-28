#pragma once

#include <vector>
#include <chrono>
#include <string>
#include <dlfcn.h>
#include "gstd/libgstc.h"

#include "utils.h"
#include "common.h"
#include "nlohmann/json.hpp"

#define MAIN_PIPELINE "main"
#define FAKESRC_PIPELINE "fake"
#define DEFAULT_SRC_TIMEOUT 5000000000 // timeout rtsp ns
#define FRAME_TIMEOUT 500  // Maximum number of missed frames continuous is accepted

// #define DEFAULT_TOPIC "nvdsanalytics"
// #define DEFAULT_SERVER "iedge.iview.vn;9092"
using namespace std::chrono;
using json = nlohmann::json;

typedef bool* CustomParserHandle;
typedef CustomParserHandle (*custom_parser_ptr)(std::string, std::string&);

class PipelineManager {
  public:
    custom_parser_ptr custom_parse = 0;
    const char* lib_path;
    const char* custom_parser_name;
    PipelineManager();
    // PipelineManager(char* &_lib_path, char* &_custom_parser_name, char* &_pipeline_config);
    PipelineManager(char* &_lib_path, char* &_custom_parser_name, char* &_pipeline_config);
    ~PipelineManager();

    void refresh(std::string &result, gboolean force=FALSE);

    void create_src_pipeline(int index);
    void create_udp_pipeline(int index); // only create v4l2 for the first of all cameras
    // GstcStatus udp_pipeline_change_src(std::string &pipeline_name, std::string &element_name, std::string &src_name);  
    void check_src_pipeline(int index, long long timeout=DEFAULT_SRC_TIMEOUT, gboolean verbose=FALSE);

    void create_main_pipeline();
    void remove_pipeline(const char* pipeline_name);
    void healthcheck_msgconv(std::string &result);
    
  private:

    GstClient *client;
    const char* box_id;
    CameraData g_cam_data_list[MAX_NUM_SOURCES];
    std::string main_pipeline;
    void * handle;    // handler for custom parser lib

    std::chrono::system_clock::time_point last_refresh;
    std::chrono::system_clock::time_point last_monitor_msg;

    gboolean update_monitor_data(gint* g_frame_out_list);
};