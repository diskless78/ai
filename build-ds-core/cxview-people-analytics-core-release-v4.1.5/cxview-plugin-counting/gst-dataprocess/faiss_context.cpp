#include "faiss_context.h"


FaissContext::FaissContext(CameraData cam_data, faiss::Index* user_index) {
  this->cam_data = cam_data;

  try {
    faiss::IndexFlatL2 *default_index = new faiss::IndexFlatL2(EMB_DIM);
    faiss_client = new faiss::IndexIDMap(default_index);

    if (cam_data.is_staff_index) {
      try {
        faiss::Index* clone_index = faiss::clone_index(user_index);
        faiss_client = static_cast<faiss::IndexIDMap*>(clone_index);
        
        // Get set staff ids
        for (int i = 0; i < faiss_client->ntotal; i++) {
          uint64_t ID = faiss_client->id_map.at(i);
          staff_ids.insert(ID);
        }
      }
      catch (const faiss::FaissException &exc) {
        spdlog::error("[gstdataprocess] {}. Using the default mechanism", exc.what());
      }      
    }

    refresh_interval = (int)(cam_data.faiss_interval*30);
    overtime_storage = (int)(cam_data.faiss_interval*60);
    last_faiss_refresh = std::chrono::system_clock::now();

    spdlog::info("[gstdataprocess] CamID={}: Initialize faiss searching at threshold {}, interval {} hours",
                  cam_data.cam_id, cam_data.faiss_threshold, cam_data.faiss_interval);
  }
  catch (const faiss::FaissException &exc) {
    g_error ("%s\n", exc.what());
  }
}


FaissContext::~FaissContext() {
  delete faiss_client;
}


std::pair<uint64_t, float> FaissContext::query(std::vector<float> emb) {
  assert(emb.size());

  std::pair<uint64_t, float> data;
  const int topk = 1;
  std::vector<faiss::Index::idx_t> idxs(topk);
  std::vector<float> distances(topk);

  faiss_client->search(1, emb.data(), topk, distances.data(), idxs.data());
  data.first = idxs[0];  // person_id
  data.second = std::roundf(distances[0] * 100.f) / 100.f;

  return data;
}


void FaissContext::update_gallery(uint64_t person_id, std::vector<float> emb) {
  int topk = 1;
  std::vector<faiss::Index::idx_t> idxs(topk);
  idxs[0] = person_id;
  faiss_client->add_with_ids(topk, &emb[0], idxs.data());
}


void FaissContext::remove_gallery(uint64_t person_id) {
  int topk = 1;
  std::vector<faiss::Index::idx_t> idxs(topk);
  idxs[0] = person_id;
  faiss::IDSelectorArray ids(topk, idxs.data());
  faiss_client->remove_ids(ids);
}


void FaissContext::refresh_gallery(std::chrono::system_clock::time_point now, std::unordered_map<uint64_t, EntryObject>& entry_objs) {
  if ((std::chrono::duration_cast<std::chrono::minutes>(now - last_faiss_refresh)).count() > refresh_interval) {  
    last_faiss_refresh = now;

    for (auto it = entry_objs.begin(); it != entry_objs.end();) {
      EntryObject& entry_obj = it->second;

      if ((std::chrono::duration_cast<std::chrono::minutes>(now - entry_obj.entry_time)).count() < overtime_storage) {
        ++it; // prevent coredump when loop and remove same time
        continue;
      }
      
      uint64_t person_id = it->first;
      // Do not delete id of list ids initialization faiss database.
      if (std::find(staff_ids.begin(), staff_ids.end(), person_id) == staff_ids.end()) {
        remove_gallery(person_id);
      }
      it = entry_objs.erase(it);
    }

    spdlog::info("[gstdataprocess] CamID={}: Faiss refresh index...", cam_data.cam_id);
  }
}