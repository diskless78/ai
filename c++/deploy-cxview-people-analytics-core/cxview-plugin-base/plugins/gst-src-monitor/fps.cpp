#include "fps.h"

FPS::FPS(int nframes) {
  this->_nframes = nframes;
  this->fps_n = 0.;
  this->_numFrames = 0;
  this->_start_n = std::chrono::system_clock::now();
}

FPS::~FPS() {}

float FPS::update(system_clock::time_point& now) {
  if ((this->_numFrames % _nframes) == 0) {
    int total_miliseconds = duration_cast<milliseconds>(now - this->_start_n).count();
    if (total_miliseconds > 0) {
      this->fps_n = this->_nframes * 1000. / (float) total_miliseconds;
    }

    this->_start_n = std::chrono::system_clock::now();
  }
  this->_numFrames += 1;

  return this->fps_n;
}