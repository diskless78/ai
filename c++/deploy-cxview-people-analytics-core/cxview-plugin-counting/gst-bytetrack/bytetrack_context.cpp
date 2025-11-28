#include "bytetrack_context.h"

ByteTrackPluginCtx* ByteTrackPluginCtxInit(ByteTrackPluginInitParams* initParams)
{
  ByteTrackPluginCtx* ctx = new ByteTrackPluginCtx;
  ctx->initParams = *initParams;

  ctx->mTracker = new BYTETracker(
    ctx->initParams.track_thresh, ctx->initParams.high_thresh, ctx->initParams.match_thresh, 
    ctx->initParams.max_alive, 30
  );

  return ctx;
}