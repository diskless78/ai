#pragma once

#include "common.h"
#include "context_utils.h"

class FilterContext {
  public:
    FilterContext();
    ~FilterContext();
    TrackObject* update(AnalyticsData &data);
    void refresh(std::chrono::system_clock::time_point now);

  private:
    std::unordered_map<int, TrackObject*> track_objs;
};
