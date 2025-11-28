#pragma once

#include <faiss/IndexFlat.h>
#include <faiss/MetaIndexes.h>
#include <faiss/impl/AuxIndexStructures.h>
#include <faiss/index_io.h>
#include <faiss/clone_index.h>

#include <gst/gst.h>
#include <iostream>
#include <unordered_map>
#include <set>
#include <chrono>
#include "spdlog/spdlog.h"
#include "common.h"


class FaissContext {
  public:
    FaissContext(CameraData cam_data, faiss::Index* user_index);
    ~FaissContext();

    std::set<uint64_t> staff_ids;  // list of staff ids initialization faiss database
    std::chrono::system_clock::time_point last_faiss_refresh;

    std::pair<uint64_t, float> query(std::vector<float> emb);
    void update_gallery(uint64_t person_id, std::vector<float> emb);
    void remove_gallery(uint64_t person_id);
    void refresh_gallery(std::chrono::system_clock::time_point now, std::unordered_map<uint64_t, EntryObject>& entry_objs);

  private:
    faiss::IndexIDMap* faiss_client;
    CameraData cam_data;

    int refresh_interval = 0;
    int overtime_storage = 0;
};