// Copyright (C) 2019-2020 Zilliz. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance
// with the License. You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed under the License
// is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
// or implied. See the License for the specific language governing permissions and limitations under the License.

#include <iostream>
#include "spdlog/spdlog.h"

#include "TimeRecorder.h"

namespace milvus_sdk {

TimeRecorder::TimeRecorder(const std::string& title) : title_(title) {
    start_ = std::chrono::system_clock::now();
}

TimeRecorder::~TimeRecorder() {
    std::chrono::system_clock::time_point end = std::chrono::system_clock::now();
    int64_t span = (std::chrono::duration_cast<std::chrono::milliseconds>(end - start_)).count();
    if (span > 0) spdlog::info("{} {}ms", title_, span);
}

}  // namespace milvus_sdk
