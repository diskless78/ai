#include "context.h"


ProcessContext::ProcessContext(CameraData &cam_data, bool debug) {
  this->cam_data = cam_data;
  this->debug = debug;

  // for zone analytics
  if (debug) {
    for (auto it = cam_data.zone_analytics.begin(); it != cam_data.zone_analytics.end(); ++it) {
      this->roi_objs[it->first] = std::set<int>();
    }
  }

  // for heatmap
  if (this->cam_data.is_heatmap) {
    this->normal_grid_size = this->cam_data.scale[0]*this->cam_data.scale[1];
    this->normal_grid_time = std::vector<int>(this->normal_grid_size, 0);
  }
  if (this->cam_data.is_layout) {
    this->layout_grid_size = this->cam_data.layout_scale[0]*this->cam_data.layout_scale[1];
    this->layout_grid_time = std::vector<int>(this->layout_grid_size, 0);
  }
  this->last_heatmap_refresh = std::chrono::system_clock::now();
}

ProcessContext::~ProcessContext() {
  if (this->faiss_context) delete this->faiss_context;
}

TrackObject* ProcessContext::process_track(AnalyticsData &data, std::vector<json> &payloads) {
  auto it = track_objs.find(data.obj_id);
  TrackObject *trk;
  if (it == track_objs.end()) {
    trk = new TrackObject();
    trk->obj_id = data.obj_id;
    trk->person_id = genPersonID();
    trk->last_penalty = data.now;

    // update ignore stall zone
    trk->ignore_stall.resize(data.roiStatus.size());
    trk->ignore_stall.assign(data.roiStatus.begin(), data.roiStatus.end());

    track_objs[data.obj_id] = trk;
  } else trk = it->second;
  trk->last_update = data.now;

  this->process_line(data, trk, payloads);

  this->process_roi(data, trk, payloads);

  this->process_dir(data, trk);

  return trk;
}

void ProcessContext::refresh(std::chrono::system_clock::time_point now, std::vector<json> &payloads) {
  // refresh faiss
  if (cam_data.is_reid) {
    faiss_context->refresh_gallery(now, this->entry_objs);
  }

  // handle lost obj
  for (auto it = track_objs.begin(); it != track_objs.end();) {
    TrackObject *trk = it->second;

    if ((std::chrono::duration_cast<std::chrono::seconds>(now - trk->last_update)).count() < TRACK_LIFE_TIMEOUT) {
      ++it; // prevent coredump when loop and remove same time
      continue;
    }

    // refresh stall data
    for (const auto& [roi_id, roi_data] : trk->roi_time) {
      json payload;

      if (roi_data->type == ENTRY) {
        // Ignore the count if this is an object that does not meet the time target in the zone
        const int DECISION_TIME_MS = TIME_TO_DECIDE_COUNT_ZONE * ONE_THOUSAND_MILLISECONDS;
        const bool is_time_valid = (roi_data->dwell_time >= DECISION_TIME_MS);
        const float DECISION_STDEV = 2.0 * HEATMAP_MUTATION_STDEV;
        const float roi_stdev = cal_stdev(roi_data->stdev_data);
        const bool is_stdev_valid = (roi_stdev >= 0.0) && (roi_stdev <= DECISION_STDEV);
        
        if (is_time_valid && is_stdev_valid) {

          payload = create_payload(trk->entry_time);
          payload["type"] = "window";
          payload["person_id"] = trk->person_id;
          payload["roi_id"] = roi_id;
          payload["dwell_time"] = roi_data->dwell_time / ONE_THOUSAND_MILLISECONDS;
          payloads.push_back(payload);

          spdlog::info("dataprocess: A new window, cam_id={}, person_id={}, score={}, entry_time={}...",
                        this->cam_data.cam_id, trk->person_id, trk->score, payload["timestamp"].get<int>());

          // printf("payload entry: %s\n", payload.dump().c_str());
        }
      } 
      else if (roi_data->type == CHECKOUT || roi_data->type == OUTSIDE || roi_data->type == STALL) {
        // Ignore the count if this is an object that does not meet the time target in the zone
        if (roi_data->dwell_time > 0) {

          payload = create_payload(now);
          payload["type"] = "stall";
          payload["person_id"] = trk->person_id;
          payload["roi_id"] = roi_id;
          payload["dwell_time"] = roi_data->dwell_time / ONE_THOUSAND_MILLISECONDS;
          payloads.push_back(payload);

          // printf("payload stall: %s\n", payload.dump().c_str());
        }
      }
      delete roi_data;
    }
    trk->roi_time.clear();

    // refresh heatmap_data
    if (cam_data.is_heatmap && trk->is_first_in_heatmap_roi) {
      // accumulate obj grid data to cam grid data
      std::transform (normal_grid_time.begin(), normal_grid_time.end(), trk->normal_grid_time.begin(), normal_grid_time.begin(), std::plus<int>());

      if (cam_data.is_layout) {
        std::transform (layout_grid_time.begin(), layout_grid_time.end(), trk->layout_grid_time.begin(), layout_grid_time.begin(), std::plus<int>());
      }
    }

    // refresh route_data
    auto& route_data = trk->route_data;
    if (route_data.size()) {
      // find route_id that with the most frequency 
      auto route = std::max_element(route_data.begin(), route_data.end(),
        [](const std::pair<std::string, int>& p1, const std::pair<std::string, int>& p2) { return p1.second < p2.second; });
      json payload = create_payload(now);
      payload["type"] = "route";
      payload["route_id"] = route->first;
      payloads.push_back(payload);
      // printf("payload route: %s\n", payload.dump().c_str());
    }

    delete it->second;
    it = track_objs.erase(it);
  }

  // summary heatmap data
  if (cam_data.is_heatmap && (std::chrono::duration_cast<std::chrono::minutes>(now - last_heatmap_refresh)).count() >= HEATMAP_REFRESH_INTERVAL) {
    // summary heatmap normal
    json payload = create_payload(now);
    payload["type"] = "heatmap";
    for (int i=0; i<normal_grid_time.size(); i++) {
      if (normal_grid_time[i] > 0) {
        int grid_x = i % this->cam_data.scale[0];
        int grid_y = i / this->cam_data.scale[0];
        json normal_hm;
        normal_hm["index"] = {grid_x, grid_y};
        normal_hm["dwell_time"] = normal_grid_time[i] / ONE_THOUSAND_MILLISECONDS;
        payload["heatmap"].push_back(normal_hm);
      }
      normal_grid_time[i] = 0;
    }
    if (payload["heatmap"].size()) {
      payloads.push_back(payload);
      // printf("payload heatmap: %s\n", payload.dump().c_str());
    }

    // summary heatmap layout
    if (cam_data.is_layout) {
      json payload = create_payload(now);
      payload["type"] = "heatmap_layout";
      for (int i=0; i<layout_grid_time.size(); i++) {
        if (layout_grid_time[i] > 0) {
          int layout_grid_x = i % this->cam_data.layout_scale[0];
          int layout_grid_y = i / this->cam_data.layout_scale[0];
          json layout_hm;
          layout_hm["index"] = {layout_grid_x, layout_grid_y};
          layout_hm["dwell_time"] = layout_grid_time[i] / ONE_THOUSAND_MILLISECONDS;
          payload["heatmap"].push_back(layout_hm);
        }
        layout_grid_time[i] = 0;
      }
      if (payload["heatmap"].size()) {
        payloads.push_back(payload);
        // printf("payload heatmap_layout: %s\n", payload.dump().c_str());
      }
    }

    last_heatmap_refresh = now;
  }
}

/*====================== Line Data ======================*/

void ProcessContext::process_line(AnalyticsData &data, TrackObject* trk, std::vector<json> &payloads) {
  if (data.line_id.empty()) return;

  std::string& line_msg = trk->text_params.line_msg;
  trk->obj_reid = trk->obj_id;
  trk->line_id = data.line_id;
  trk->line_out = is_line_out_id(data.line_id, false);
  trk->entry_time = data.now;
  trk->dwell_time = 0.0; // A conditional trick to distinguish the counting type
  int entry_timestamp = std::chrono::duration_cast<std::chrono::seconds>(trk->entry_time.time_since_epoch()).count();

  // Satisfy the counting condition if lines of box intersects the entry line
  // if (!is_line_intersection(data.box_data, this->cam_data.entry_lines[data.line_id])) {
  //   if (debug) {
  //     spdlog::warn("dataprocess: An entry is filtered by condiational interection");
  //   }
  //   return;
  // }

  /***
   * was_out: Avoid with customer or staff standing around the line
   * and going out does not apply reid
  ***/

  if (!trk->line_out) {
    if (trk->was_out) {
      spdlog::info("dataprocess: An entry was out, cam_id={}, person_id={}, score={:02.2f}, entry_time={}...",
                      this->cam_data.cam_id, trk->person_id, trk->score, entry_timestamp);
      return;
    }
    // This is entry counting
    line_msg = "\nentry";

    if (this->cam_data.is_reid) {
      std::pair<uint64_t, float> reid_info = this->faiss_context->query(data.emb); // <obj_id, score>
      trk->score = reid_info.second;

      if (trk->score >= this->cam_data.faiss_threshold) {
        this->faiss_context->update_gallery(trk->person_id, data.emb);
        // Store entry object when using reid for remove the object timeout in db
        this->entry_objs[trk->person_id] = EntryObject{data.now, data.line_id};

        spdlog::info("dataprocess: A new entry, cam_id={}, person_id={}, score={:02.2f}, entry_time={}...",
                      this->cam_data.cam_id, trk->person_id, trk->score, entry_timestamp);

        line_msg += " | " + std::to_string(trk->score);
        
      } else {
        trk->person_id = reid_info.first;
        entry_timestamp = std::chrono::duration_cast<std::chrono::seconds>(
          this->entry_objs[trk->person_id].entry_time.time_since_epoch()).count();
        spdlog::info("dataprocess: An entry is filtered, cam_id={}, person_id={}, score={:02.2f}, entry_time={}...",
                      this->cam_data.cam_id, trk->person_id, trk->score, entry_timestamp);

        line_msg += " | " + std::to_string(trk->score);
        
        return;
      }

      
    } else {
      // If camera not using reid feature
      spdlog::info("dataprocess: A new entry, cam_id={}, person_id={}, score={:02.2f}, entry_time={}...",
                      this->cam_data.cam_id, trk->person_id, trk->score, entry_timestamp);
    }
  }
  else {
    if (trk->was_out) {
      spdlog::info("dataprocess: An exit is filtered, cam_id={}, person_id={}, score={:02.2f}, entry_time={}...",
                      this->cam_data.cam_id, trk->person_id, trk->score, entry_timestamp);
      return;
    }
    // This is exit counting
    line_msg = "\nexit";
    trk->was_out = true;
    trk->dwell_time = -1.0;
    trk->line_out = is_line_out_id(trk->line_id, true); // remove prefix key OUT_LINE_KEY of line_id
    spdlog::info("dataprocess: A new exit, cam_id={}, person_id={}, score={:02.2f}, entry_time={}...",
                      this->cam_data.cam_id, trk->person_id, trk->score, entry_timestamp);
  }

  // Get entry payload
  json payload = create_payload(trk->entry_time);
  payload["type"] = "entry";
  payload["person_id"] = trk->person_id;
  payload["line_id"] = trk->line_id;
  payload["dwell_time"] = trk->dwell_time;
  payloads.push_back(payload);
  // printf("payload entry: %s\n", payload.dump().c_str());
}

/*====================== Roi Data ======================*/

void ProcessContext::process_roi(AnalyticsData &data, TrackObject* trk, std::vector<json> &payloads) {
  // update box data
  // foot centroid
  BoxData& box = data.box_data;
  POINT centroid_p;
  centroid_p.x = box.left + box.width/2;
  centroid_p.y = box.top + box.height;

  trk->is_penalty = false;
  trk->last_stdev = HEATMAP_MUTATION_STDEV;
  int penalty_span = std::chrono::duration_cast<std::chrono::milliseconds>(data.now - trk->last_penalty).count();
  if (penalty_span >= PENALTY_INTERVAL * ONE_THOUSAND_MILLISECONDS) {
    float stdev = get_stdev_obj(trk);
    if (stdev < HEATMAP_MUTATION_STDEV) {
      trk->is_penalty = true;
      trk->penalty_weight = fmin(1.0, trk->penalty_weight + 0.1);
      stdev *= trk->penalty_weight;
    }
    trk->last_stdev = stdev;
    trk->last_penalty = data.now;
    trk->list_points.erase(trk->list_points.begin());
  }
  trk->list_points.push_back(centroid_p);

  std::string& roi_msg = trk->text_params.roi_msg;
  roi_msg = "";
  bool heatmap_accumulated = false;

  for (int i=0; i<data.roiStatus.size(); i++) {
    std::string &roi_id = data.roiStatus[i], roi_label = "";

    // Check if the ROI ID belongs to a heatmap roi
    bool is_heatmap_roi = is_heatmap_roi_id(roi_id);

    // Check if the object was initialized in this ROI
    bool is_ignore = std::find(trk->ignore_stall.begin(),
                              trk->ignore_stall.end(),
                              roi_id) != trk->ignore_stall.end();
    // process heatmap
    if (is_heatmap_roi) {
      if (heatmap_accumulated) continue; // ignore duplicate accumulate heatmap
      heatmap_accumulated = true;

      if (!is_centroid_in_roi(cam_data.heatmap_polygon[roi_id], centroid_p))
        continue;
      // firts init
      if (!trk->is_first_in_heatmap_roi) {
        trk->is_first_in_heatmap_roi = true;
        trk->last_update_heatmap = data.now;
        trk->normal_grid_time = std::vector<int>(this->normal_grid_size, 0);
        trk->layout_grid_time = std::vector<int>(this->layout_grid_size, 0);

      } else {
        int delta_time = std::chrono::duration_cast<std::chrono::milliseconds>(data.now - trk->last_update_heatmap).count();
        // obj goes out of the roi, reset accumulate
        if (delta_time > ONE_THOUSAND_MILLISECONDS) continue;

        // HEATMAP NORMAL
        // convert to grid point, (-1) to prevent grid point outsize
        int grid_x = (int) ((centroid_p.x-1) / MUXER_OUTPUT_WIDTH * cam_data.scale[0]);
        int grid_y = (int) ((centroid_p.y-1) / MUXER_OUTPUT_HEIGHT * cam_data.scale[1]);
        int grid_time_ind = grid_y*cam_data.scale[0] + grid_x;
        // Increase dwell time but if was penalty then decrease it
        if (trk->normal_grid_time[grid_time_ind] < 0)
          trk->normal_grid_time[grid_time_ind] = 0;
        trk->normal_grid_time[grid_time_ind] += (!trk->is_penalty) ? delta_time : (-delta_time);

        // HEATMAP LAYOUT
        int layout_grid_x;
        int layout_grid_y;
        if (this->cam_data.is_layout) {
          POINT layout_p = transform_point(centroid_p, cam_data.matrix);
          // convert to grid point
          layout_grid_x = (int) (layout_p.x / cam_data.layout_grid_size[0]);
          layout_grid_y = (int) (layout_p.y / cam_data.layout_grid_size[1]);
          // update data
          if (layout_grid_x < 0 || layout_grid_x >= cam_data.layout_scale[0]
            || layout_grid_y < 0 || layout_grid_y >= cam_data.layout_scale[1]) {
              spdlog::error("dataprocess: centroid_p.x={}, centroid_p.y={} is located outside the layout grid...", centroid_p.x, centroid_p.y);
            }
          else {
            trk->layout_grid_time[layout_grid_y*cam_data.layout_scale[0] + layout_grid_x] += delta_time;
          }
        }

        if (debug) {
          float stdev_obj = get_stdev_obj(trk);
          roi_msg = "\nHM-stdev: " + std::to_string(stdev_obj) + "px";
          
          // send realtime heatmap data for debug
          json payload = create_payload(data.now);
          payload["type"] = "heatmap_debug";
          json normal_hm;
          normal_hm["index"] = {grid_x, grid_y};
          normal_hm["dwell_time"] = trk->normal_grid_time[grid_time_ind] / ONE_THOUSAND_MILLISECONDS;
          payload["heatmap"].push_back(normal_hm);
          payloads.push_back(payload);

          // send realtime heatmap layout data for debug
          if (this->cam_data.is_layout) {
            json payload = create_payload(data.now);
            payload["type"] = "heatmap_layout_debug";
            json layout_hm;
            layout_hm["index"] = {layout_grid_x, layout_grid_y};
            layout_hm["dwell_time"] = trk->layout_grid_time[layout_grid_y*cam_data.layout_scale[0] + layout_grid_x] / ONE_THOUSAND_MILLISECONDS;
            payload["heatmap"].push_back(layout_hm);
            payloads.push_back(payload);
          }
        }

        // trk->last_update_heatmap = data.now;
      }
    }

    // process both stall and heatmap (roi data)
    RoiData* roi_data = nullptr;
    auto it = trk->roi_time.find(roi_id);
    if (it == trk->roi_time.end()) {
      // If object first in the roi
      roi_data = new RoiData();
      trk->roi_time[roi_id] = roi_data;

      if (is_heatmap_roi) {
        roi_data->type = STALL;
      } else {
        RoiType roi_type = cam_data.zone_analytics[roi_id];

        switch (roi_type)
        {
        case ENTRY:
          trk->entry_time = data.now;
          roi_data->type = ENTRY;
          roi_data->stdev_data.push_back(trk->last_stdev);

          if (is_ignore) {
            roi_data->type = IGNORE;
          }
          break;
        case OUTSIDE:
          roi_data->type = OUTSIDE;
          if (is_ignore) {
            roi_data->type = IGNORE;
          }
          break;
        case CHECKOUT:
          roi_data->type = CHECKOUT;
          break;
        
        default:
          break;
        }
      }
    } else {
      // Handle time in roi
      roi_data = it->second;
      int delta_time = std::chrono::duration_cast<std::chrono::milliseconds>(data.now - roi_data->last_update).count();
      // Object has moved out of the ROI and return
      if (delta_time > ONE_THOUSAND_MILLISECONDS) continue;

      switch (roi_data->type)
      {
      case CHECKOUT:
        roi_label = "checkout";
        // If the object is ignored, reset dwell time
        if (is_ignore) {
          roi_data->dwell_time = 0;
          trk->ignore_stall.clear();
        }
        break;
      case STALL:
        roi_label = "stall";
        // Increase dwell time but if was penalty then decrease it
        if (roi_data->dwell_time < 0)
          roi_data->dwell_time = 0;
        delta_time = (!trk->is_penalty) ? delta_time : (-delta_time);
        break;
      case OUTSIDE:
        roi_label = "outside";
        if (debug) {
          roi_objs[roi_id].insert(trk->obj_id);
        }
        break;
      case ENTRY:
        roi_label = "entry";
        if (trk->last_stdev != HEATMAP_MUTATION_STDEV)
          roi_data->stdev_data.push_back(trk->last_stdev);

        if (debug) {
          const int DECISION_TIME_MS = TIME_TO_DECIDE_COUNT_ZONE * ONE_THOUSAND_MILLISECONDS;
          const bool is_time_valid = (roi_data->dwell_time >= DECISION_TIME_MS);
          const float DECISION_STDEV = 2.0 * HEATMAP_MUTATION_STDEV;
          trk->last_stdev = cal_stdev(roi_data->stdev_data);
          const bool is_stdev_valid = (trk->last_stdev >= 0.0) && (trk->last_stdev <= DECISION_STDEV);

          if (is_time_valid && is_stdev_valid) {
            roi_objs[roi_id].insert(trk->obj_id);
          }
        }
        break;
      case IGNORE:
        roi_label = "ignore";
        break;
      
      default:
        break;
      }

      // Update dwell time
      roi_data->dwell_time += (roi_data->type == IGNORE) ? 0 : delta_time;

      roi_msg += "\n" + roi_label + ": " + std::to_string(roi_data->dwell_time) + ", " + std::to_string(trk->last_stdev);
    }
  }

  // always update obj timestamp every frame
  trk->last_update_heatmap = data.now;

  for (auto &it : trk->roi_time)
    it.second->last_update = data.now;
}

/*====================== Direction ======================*/

void ProcessContext::process_dir(AnalyticsData &data, TrackObject* trk) {
  if (data.route_id.size()==0) return;

  std::string& dir_msg = trk->text_params.dir_msg;
  std::string& route_id = data.route_id;

  auto it = trk->route_data.find(route_id);
  if (it != trk->route_data.end()) it->second++;
  else trk->route_data[route_id] = 1;

  dir_msg = "\nRoute: ";
  for (auto i : trk->route_data) {
    dir_msg += i.first + "=" + std::to_string(i.second) + ", ";
  }
}
