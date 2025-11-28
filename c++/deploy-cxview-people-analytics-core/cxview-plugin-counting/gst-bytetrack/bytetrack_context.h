#ifndef __BYTETRACK_PLUGIN__
#define __BYTETRACK_PLUGIN__

#include "bytetrack/BYTETracker.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef struct ByteTrackPluginInitParams
{
  float track_thresh;
  float high_thresh;
  float match_thresh;
  unsigned int max_alive;
} ByteTrackPluginInitParams;

typedef struct ByteTrackPluginCtx
{
  ByteTrackPluginInitParams initParams;
  BYTETracker* mTracker;

} ByteTrackPluginCtx;

// Initialize library context
ByteTrackPluginCtx* ByteTrackPluginCtxInit(ByteTrackPluginInitParams*);

#ifdef __cplusplus
}
#endif

#endif