/* GStreamer
 * Copyright (C) 2022 FIXME <fixme@example.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Suite 500,
 * Boston, MA 02110-1335, USA.
 */
/**
 * SECTION:element-gstdataprocess
 *
 * The dataprocess element does FIXME stuff.
 *
 * <refsect2>
 * <title>Example launch line</title>
 * |[
 * gst-launch-1.0 -v fakesrc ! dataprocess ! FIXME ! fakesink
 * ]|
 * FIXME Describe what the pipeline does.
 * </refsect2>
 */

#ifdef HAVE_CONFIG_H
#include "config.h"
#endif
#include "gstdataprocess.h"

GST_DEBUG_CATEGORY_STATIC (gst_dataprocess_debug_category);
#define GST_CAT_DEFAULT gst_dataprocess_debug_category

/* prototypes */


static void gst_dataprocess_set_property (GObject * object,
    guint property_id, const GValue * value, GParamSpec * pspec);
static void gst_dataprocess_get_property (GObject * object,
    guint property_id, GValue * value, GParamSpec * pspec);
static void gst_dataprocess_dispose (GObject * object);
static void gst_dataprocess_finalize (GObject * object);

static gboolean gst_dataprocess_set_caps (GstBaseTransform * trans,
    GstCaps * incaps, GstCaps * outcaps);
static gboolean gst_dataprocess_start (GstBaseTransform * trans);
static gboolean gst_dataprocess_stop (GstBaseTransform * trans);
static GstFlowReturn gst_dataprocess_transform_ip (GstBaseTransform * trans,
    GstBuffer * buf);

enum
{
  PROP_0
};

/* pad templates */

static GstStaticPadTemplate gst_dataprocess_src_template =
GST_STATIC_PAD_TEMPLATE ("src",
    GST_PAD_SRC,
    GST_PAD_ALWAYS,
    GST_STATIC_CAPS_ANY
    );

static GstStaticPadTemplate gst_dataprocess_sink_template =
GST_STATIC_PAD_TEMPLATE ("sink",
    GST_PAD_SINK,
    GST_PAD_ALWAYS,
    GST_STATIC_CAPS_ANY
    );


/* class initialization */

G_DEFINE_TYPE_WITH_CODE (GstDataprocess, gst_dataprocess, GST_TYPE_BASE_TRANSFORM,
  GST_DEBUG_CATEGORY_INIT (gst_dataprocess_debug_category, "dataprocess", 0,
  "debug category for dataprocess element"));

static void
gst_dataprocess_class_init (GstDataprocessClass * klass)
{
  GObjectClass *gobject_class = G_OBJECT_CLASS (klass);
  GstBaseTransformClass *base_transform_class = GST_BASE_TRANSFORM_CLASS (klass);

  /* Setting up pads and setting metadata should be moved to
     base_class_init if you intend to subclass this class. */
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_dataprocess_src_template);
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_dataprocess_sink_template);

  gst_element_class_set_static_metadata (GST_ELEMENT_CLASS(klass),
      "FIXME Long name", "Generic", "FIXME Description",
      "FIXME <fixme@example.com>");

  gobject_class->set_property = gst_dataprocess_set_property;
  gobject_class->get_property = gst_dataprocess_get_property;
  gobject_class->dispose = gst_dataprocess_dispose;
  gobject_class->finalize = gst_dataprocess_finalize;
  base_transform_class->set_caps = GST_DEBUG_FUNCPTR (gst_dataprocess_set_caps);
  base_transform_class->start = GST_DEBUG_FUNCPTR (gst_dataprocess_start);
  base_transform_class->stop = GST_DEBUG_FUNCPTR (gst_dataprocess_stop);
  base_transform_class->transform_ip = GST_DEBUG_FUNCPTR (gst_dataprocess_transform_ip);

}

static void
gst_dataprocess_init (GstDataprocess *dataprocess)
{
  GstBaseTransform *btrans = GST_BASE_TRANSFORM (dataprocess);

  /* We will not be generating a new buffer. Just adding / updating
   * metadata. */
  gst_base_transform_set_in_place (GST_BASE_TRANSFORM (btrans), TRUE);
  /* We do not want to change the input caps. Set to passthrough. transform_ip
   * is still called. */
  gst_base_transform_set_passthrough (GST_BASE_TRANSFORM (btrans), TRUE);

  // TODO: property in cmakelists
  if (g_getenv("DEBUG")) {
    dataprocess->debug = TRUE;
    spdlog::info("data_process: Debug=TRUE...\n");
  } else {
    dataprocess->debug = FALSE;
    spdlog::info("data_process: Debug=FALSE...\n");
  }

  const char* box_id = g_getenv("BOX_ID");
  g_assert(box_id);
  dataprocess->box_id.assign(box_id);

  // Faiss
  const char* USER_ID = getenv("USER_ID");
  int BUFSIZE = 1000;
  char *faiss_index_path = new char[BUFSIZE];
  snprintf (faiss_index_path, BUFSIZE, "%s/%s.index", FAISS_DATABASE, USER_ID);
  std::ifstream f(faiss_index_path);

  if (!f.is_open() || !USER_ID) {
    spdlog::error("[gstdataprocess] Cannot loaded index file or USER_ID is NULL. Using the default mechanism");
  }
  else {
    try {
      dataprocess->user_index = faiss::read_index(faiss_index_path, faiss::IO_FLAG_MMAP);
      spdlog::info("[gstdataprocess] UserID={}: Loaded index file. Using the custom mechanism", USER_ID);
    }
    catch (const faiss::FaissException &exc) {
      spdlog::error("[gstdataprocess] {}", exc.what());
    }
  }
  f.close();
  delete[] faiss_index_path;   
}

void
gst_dataprocess_set_property (GObject * object, guint property_id,
    const GValue * value, GParamSpec * pspec)
{
  GstDataprocess *dataprocess = GST_DATAPROCESS (object);

  GST_DEBUG_OBJECT (dataprocess, "set_property");

  switch (property_id) {
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_dataprocess_get_property (GObject * object, guint property_id,
    GValue * value, GParamSpec * pspec)
{
  GstDataprocess *dataprocess = GST_DATAPROCESS (object);

  GST_DEBUG_OBJECT (dataprocess, "get_property");

  switch (property_id) {
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_dataprocess_dispose (GObject * object)
{
  GstDataprocess *dataprocess = GST_DATAPROCESS (object);

  GST_DEBUG_OBJECT (dataprocess, "dispose");

  /* clean up as possible.  may be called multiple times */

  G_OBJECT_CLASS (gst_dataprocess_parent_class)->dispose (object);
}

void
gst_dataprocess_finalize (GObject * object)
{
  GstDataprocess *dataprocess = GST_DATAPROCESS (object);

  GST_DEBUG_OBJECT (dataprocess, "finalize");

  /* clean up object here */

  G_OBJECT_CLASS (gst_dataprocess_parent_class)->finalize (object);
}

static gboolean
gst_dataprocess_set_caps (GstBaseTransform * trans, GstCaps * incaps,
    GstCaps * outcaps)
{
  GstDataprocess *dataprocess = GST_DATAPROCESS (trans);

  GST_DEBUG_OBJECT (dataprocess, "set_caps");

  return TRUE;
}

/* states */
static gboolean
gst_dataprocess_start (GstBaseTransform * trans)
{
  GstDataprocess *dataprocess = GST_DATAPROCESS (trans);

  GST_DEBUG_OBJECT (dataprocess, "start");

  // Parse source data from env config
	gchar const *config = g_getenv("CONFIG");
  if (!config)
  {
    spdlog::error("[gstdataprocess] CONFIG NULL...");
    return FALSE;
  }
  dataprocess->cam_data_list = new CameraData[MAX_NUM_SOURCES];
	if (!parse_config(dataprocess->cam_data_list, config))
	{
		spdlog::error("[gstdataprocess] parse config failed...");
    return FALSE;
	}

  return TRUE;
}

static gboolean
gst_dataprocess_stop (GstBaseTransform * trans)
{
  GstDataprocess *dataprocess = GST_DATAPROCESS (trans);

  GST_DEBUG_OBJECT (dataprocess, "stop");

  delete dataprocess->user_index;
  delete []dataprocess->cam_data_list;

  for (int i=0; i<MAX_NUM_SOURCES; i++) {
    if (dataprocess->process_ctx[i]) {
      delete dataprocess->process_ctx[i];
      spdlog::info("[gstdataprocess] Free context {}...", i);
    }
  }

  return TRUE;
}

static GstFlowReturn
gst_dataprocess_transform_ip (GstBaseTransform * trans, GstBuffer * buf)
{
  GstDataprocess *dataprocess = GST_DATAPROCESS (trans);

  GST_DEBUG_OBJECT (dataprocess, "transform_ip");

  // for debug
  static int entry[MAX_NUM_SOURCES] = {0};
  static int entry_filtered[MAX_NUM_SOURCES] = {0};
  static int exit[MAX_NUM_SOURCES] = {0};

  NvDsBatchMeta *batch_meta = gst_buffer_get_nvds_batch_meta(buf);
  std::chrono::system_clock::time_point now = std::chrono::system_clock::now();

  for (NvDsMetaList * l_frame = batch_meta->frame_meta_list; l_frame != NULL; l_frame = l_frame->next) {
    NvDsFrameMeta *frame_meta = (NvDsFrameMeta *)l_frame->data;
    std::vector<json> payloads;
    NvDsObjEncOutParams *enc_jpeg_image = NULL;  // for debug
    int batch_id = (int) frame_meta->source_id;
    CameraData cam_data = dataprocess->cam_data_list[batch_id];
    ProcessContext* process_ctx = dataprocess->process_ctx[batch_id];

    if (!process_ctx) {
      process_ctx = new ProcessContext (cam_data, dataprocess->debug);
      dataprocess->process_ctx[batch_id] = process_ctx;
      if (cam_data.is_reid) {
        process_ctx->faiss_context = new FaissContext(cam_data, dataprocess->user_index);
      }

      spdlog::info("[gstdataprocess] Created context {}...", batch_id);
    }

    for (NvDsMetaList * l_obj = frame_meta->obj_meta_list; l_obj != NULL; l_obj=l_obj->next) {
      NvDsObjectMeta *obj_meta = (NvDsObjectMeta *)(l_obj->data);

      AnalyticsData data;
      data.obj_id = obj_meta->object_id;
      data.now = now;

      for (NvDsMetaList * l_user = obj_meta->obj_user_meta_list; l_user != NULL; l_user = l_user->next) {
        NvDsUserMeta *user_meta = (NvDsUserMeta *) l_user->data;

        // restore box
        if (user_meta->base_meta.meta_type == NVDS_GST_CUSTOM_META)  {
          BoxData *box_meta = (BoxData *)user_meta->user_meta_data;
          obj_meta->rect_params.left = box_meta->left;
          obj_meta->rect_params.top = box_meta->top;
          obj_meta->rect_params.width = box_meta->width;
          obj_meta->rect_params.height = box_meta->height;
          data.box_data = *box_meta;

        } else if (user_meta->base_meta.meta_type == NVDS_USER_OBJ_META_NVDSANALYTICS) {
          NvDsAnalyticsObjInfo *analytic_meta = (NvDsAnalyticsObjInfo *)user_meta->user_meta_data;

          // update line data
          if (analytic_meta->lcStatus.size()) {
            data.line_id = analytic_meta->lcStatus[0];
          }

          // update roi data
          if (analytic_meta->roiStatus.size()) {
            data.roiStatus.resize(analytic_meta->roiStatus.size());
            data.roiStatus.assign(analytic_meta->roiStatus.begin(), analytic_meta->roiStatus.end());
          }

          // update route data
          data.route_id = analytic_meta->dirStatus;

        } else if (user_meta->base_meta.meta_type == NVDSINFER_TENSOR_OUTPUT_META) {
          // get embedding
          NvDsInferTensorMeta *meta = (NvDsInferTensorMeta *) user_meta->user_meta_data;
          // sgie gie-unique-id=2
          if (meta->unique_id != 2) continue;

          NvDsInferLayerInfo *info = &meta->output_layers_info[0];
          info->buffer = meta->out_buf_ptrs_host[0];
          NvDsInferDimsCHW dims;
          getDimsCHWFromDims (dims, meta->output_layers_info[0].inferDims);
          unsigned int emb_dim = dims.c;
          float *outputCoverageBuffer = (float *) meta->output_layers_info[0].buffer;
          std::vector<float> emb(outputCoverageBuffer, outputCoverageBuffer + emb_dim);
          l2_norm(emb);
          data.emb.resize(emb.size());
          data.emb.assign(emb.begin(), emb.end());

        } else if (user_meta->base_meta.meta_type == NVDS_CROP_IMAGE_META) {
          enc_jpeg_image = (NvDsObjEncOutParams *) user_meta->user_meta_data;
        }
      }

      milvus_sdk::TimeRecorder* rc;
      if (dataprocess->debug) rc = new milvus_sdk::TimeRecorder("[gstdataprocess] Object process:");
      TrackObject* trk = process_ctx->process_track(data, payloads);
      if (dataprocess->debug) delete rc;

      // debug counting: write count frame
      /*
      debug when:
        - reid on
        - data.line_id.size() > 0
        - line_id is not line_out or (lineout and delta_time>0)
      */
      if (dataprocess->debug && data.line_id.size()) {
        if (cam_data.is_reid) {
          char fileNameString[FILE_NAME_SIZE];
          int timestamp = std::chrono::duration_cast<std::chrono::seconds>(trk->entry_time.time_since_epoch()).count();
          
          snprintf (fileNameString, FILE_NAME_SIZE, "%ld_%.3f_%d.jpg",
            trk->person_id, trk->score, timestamp);
          /* Write to File */
          FILE *file;
          file = fopen (fileNameString, "wb");
          fwrite (enc_jpeg_image->outBuffer, sizeof (uint8_t),
              enc_jpeg_image->outLen, file);
          fclose (file);
        }

        if (!(trk->was_out || trk->line_out)) {
          entry[batch_id]++;
          if (trk->score >= cam_data.faiss_threshold) {
            entry_filtered[batch_id]++;
          }
        } else if (trk->was_out && (trk->dwell_time == -1.0)) {
          exit[batch_id]++;
        }
      }

      // Draw for object meta
      NvOSD_TextParams &text_params = obj_meta->text_params;
      std::string tmp;
      tmp.assign(text_params.display_text, strlen(text_params.display_text));
      g_free(text_params.display_text);
      std::string debug_msg;
      if (trk->text_params.line_msg.size()) debug_msg += trk->text_params.line_msg;
      if (trk->text_params.roi_msg.size()) debug_msg += trk->text_params.roi_msg;
      if (trk->text_params.dir_msg.size()) debug_msg += trk->text_params.dir_msg;
      text_params.display_text = g_strdup_printf("%s%s", tmp.c_str(), debug_msg.c_str());
      text_params.font_params.font_size /= 1.2;
    }

    if (dataprocess->debug) {
      std::string debug_string = "entry: " 
        + std::to_string(entry[batch_id])
        + ", entry_filtered: "
        + std::to_string(entry_filtered[batch_id])
        + ", exit: "
        + std::to_string(exit[batch_id])
        + " | zone: ";

      for (auto it = process_ctx->roi_objs.begin();
                it != process_ctx->roi_objs.end(); it++) {
        std::string debug_roi = it->first + "=" + std::to_string(it->second.size()) + ", ";
        debug_string += debug_roi;
      }

      // Draw for frame meta
      NvDsDisplayMeta *display_meta = nvds_acquire_display_meta_from_pool(batch_meta);
      NvOSD_TextParams *text_frame_params = &display_meta->text_params[0];
      display_meta->num_labels = 1;
      text_frame_params->display_text = g_strdup (debug_string.c_str());
      text_frame_params->x_offset = 10;
      text_frame_params->y_offset = 100;
      text_frame_params->font_params.font_name = "Mono";
      text_frame_params->font_params.font_size = 15;
      text_frame_params->font_params.font_color = (NvOSD_ColorParams) {1, 1, 1, 1};
      text_frame_params->set_bg_clr = 1;
      text_frame_params->text_bg_clr = (NvOSD_ColorParams) {0, 0, 0, 1};

      nvds_add_display_meta_to_frame(frame_meta, display_meta);
    }

    process_ctx->refresh(now, payloads);

    if (payloads.size()==0) continue;

    json overall_payload;
    overall_payload["box_id"] = dataprocess->box_id;
    overall_payload["cam_id"] = cam_data.cam_id;
    overall_payload["layout_id"] = cam_data.layout_id;
    overall_payload["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(now.time_since_epoch()).count();
    overall_payload["user_id"] = "";
    overall_payload["data"] = payloads;
    NvDsEventMsgMeta *msg_meta = (NvDsEventMsgMeta *) g_malloc0 (sizeof (NvDsEventMsgMeta));
    auto msg = overall_payload.dump();
    // g_print("overall_payload: %s\n", msg.c_str());
    msg_meta->extMsg = g_strdup(msg.c_str());
    msg_meta->extMsgSize = (gint) msg.size();
    NvDsUserMeta *user_event_meta = nvds_acquire_user_meta_from_pool (batch_meta);
    if (user_event_meta) {
      user_event_meta->user_meta_data = (void *) msg_meta;
      user_event_meta->base_meta.meta_type = NVDS_EVENT_MSG_META;
      user_event_meta->base_meta.copy_func = (NvDsMetaCopyFunc) msg_meta_copy_func;
      user_event_meta->base_meta.release_func = (NvDsMetaReleaseFunc) msg_meta_free_func;
      nvds_add_user_meta_to_frame(frame_meta, user_event_meta);
    } else {
      spdlog::error("Error in attaching event meta to buffer");
    }
    
  }
  return GST_FLOW_OK;

}

static gboolean
plugin_init (GstPlugin * plugin)
{

  /* FIXME Remember to set the rank if it's an element that is meant
     to be autoplugged by decodebin. */
  return gst_element_register (plugin, "dataprocess", GST_RANK_NONE,
      GST_TYPE_DATAPROCESS);
}

/* FIXME: these are normally defined by the GStreamer build system.
   If you are creating an element to be included in gst-plugins-*,
   remove these, as they're always defined.  Otherwise, edit as
   appropriate for your external plugin package. */
#ifndef VERSION
#define VERSION "0.0.FIXME"
#endif
#ifndef PACKAGE
#define PACKAGE "FIXME_package"
#endif
#ifndef PACKAGE_NAME
#define PACKAGE_NAME "FIXME_package_name"
#endif
#ifndef GST_PACKAGE_ORIGIN
#define GST_PACKAGE_ORIGIN "http://FIXME.org/"
#endif

GST_PLUGIN_DEFINE (GST_VERSION_MAJOR,
    GST_VERSION_MINOR,
    dataprocess,
    "FIXME plugin description",
    plugin_init, VERSION, "LGPL", PACKAGE_NAME, GST_PACKAGE_ORIGIN)

