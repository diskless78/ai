#pragma once

#include <deque>
#include <fstream>
#include <gst/gst.h>

#include "nlohmann/json.hpp"
#include "common.h"
#include "spdlog/spdlog.h"
#include "context_utils.h"
#include "faiss_context.h"


class ProcessContext {
  public:
    ProcessContext(CameraData &cam_data, bool debug);
    ~ProcessContext();

    CameraData cam_data;
    FaissContext* faiss_context;
    TrackObject* process_track(AnalyticsData &data, std::vector<json> &payloads);
    void refresh(std::chrono::system_clock::time_point now, std::vector<json> &payloads);

    // for debug
    std::unordered_map<std::string, std::set<int>> roi_objs; // for debug zone analytics
  
  private:
    void process_line(AnalyticsData &data, TrackObject* trk, std::vector<json> &payloads);

    void process_roi(AnalyticsData &data, TrackObject* trk, std::vector<json> &payloads);

    void process_dir(AnalyticsData &data, TrackObject* trk);

    bool debug;
    std::unordered_map<int, TrackObject*> track_objs;

    // for line
    std::unordered_map<uint64_t, EntryObject> entry_objs;  // obj_id: time ,store the entry time of the objs, free when faiss free

    // for roi
    std::vector<int> normal_grid_time;
    std::vector<int> layout_grid_time;
    int normal_grid_size = 0, layout_grid_size = 0;
    std::chrono::system_clock::time_point last_heatmap_refresh;
};
