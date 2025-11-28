#pragma once

#include <chrono>

using namespace std::chrono;

class FPS {
  public:
    FPS(int nframes=20);
    ~FPS();
    float update(system_clock::time_point& now);
  
  private:

    float fps_n;
    int _nframes;
    int _numFrames;
    system_clock::time_point _start_n;
};