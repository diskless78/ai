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
 * SECTION:element-gstnvbytetrack
 *
 * The nvbytetrack element does FIXME stuff.
 *
 * <refsect2>
 * <title>Example launch line</title>
 * |[
 * gst-launch-1.0 -v fakesrc ! nvbytetrack ! FIXME ! fakesink
 * ]|
 * FIXME Describe what the pipeline does.
 * </refsect2>
 */

#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

#include <gst/gst.h>
#include <gst/base/gstbasetransform.h>
#include "gstnvbytetrack.h"

GST_DEBUG_CATEGORY_STATIC (gst_nvbytetrack_debug_category);
#define GST_CAT_DEFAULT gst_nvbytetrack_debug_category

/* prototypes */


static void gst_nvbytetrack_set_property (GObject * object,
    guint property_id, const GValue * value, GParamSpec * pspec);
static void gst_nvbytetrack_get_property (GObject * object,
    guint property_id, GValue * value, GParamSpec * pspec);
static void gst_nvbytetrack_dispose (GObject * object);
static void gst_nvbytetrack_finalize (GObject * object);

static GstCaps *gst_nvbytetrack_transform_caps (GstBaseTransform * trans,
    GstPadDirection direction, GstCaps * caps, GstCaps * filter);
static GstCaps *gst_nvbytetrack_fixate_caps (GstBaseTransform * trans,
    GstPadDirection direction, GstCaps * caps, GstCaps * othercaps);
static gboolean gst_nvbytetrack_accept_caps (GstBaseTransform * trans,
    GstPadDirection direction, GstCaps * caps);
static gboolean gst_nvbytetrack_set_caps (GstBaseTransform * trans,
    GstCaps * incaps, GstCaps * outcaps);
static gboolean gst_nvbytetrack_query (GstBaseTransform * trans,
    GstPadDirection direction, GstQuery * query);
static gboolean gst_nvbytetrack_decide_allocation (GstBaseTransform * trans,
    GstQuery * query);
static gboolean gst_nvbytetrack_filter_meta (GstBaseTransform * trans,
    GstQuery * query, GType api, const GstStructure * params);
static gboolean gst_nvbytetrack_propose_allocation (GstBaseTransform * trans,
    GstQuery * decide_query, GstQuery * query);
static gboolean gst_nvbytetrack_transform_size (GstBaseTransform * trans,
    GstPadDirection direction, GstCaps * caps, gsize size, GstCaps * othercaps,
    gsize * othersize);
static gboolean gst_nvbytetrack_get_unit_size (GstBaseTransform * trans,
    GstCaps * caps, gsize * size);
static gboolean gst_nvbytetrack_start (GstBaseTransform * trans);
static gboolean gst_nvbytetrack_stop (GstBaseTransform * trans);
static gboolean gst_nvbytetrack_sink_event (GstBaseTransform * trans,
    GstEvent * event);
static gboolean gst_nvbytetrack_src_event (GstBaseTransform * trans,
    GstEvent * event);
static GstFlowReturn gst_nvbytetrack_prepare_output_buffer (GstBaseTransform *
    trans, GstBuffer * input, GstBuffer ** outbuf);
static gboolean gst_nvbytetrack_copy_metadata (GstBaseTransform * trans,
    GstBuffer * input, GstBuffer * outbuf);
static gboolean gst_nvbytetrack_transform_meta (GstBaseTransform * trans,
    GstBuffer * outbuf, GstMeta * meta, GstBuffer * inbuf);
static void gst_nvbytetrack_before_transform (GstBaseTransform * trans,
    GstBuffer * buffer);
static GstFlowReturn gst_nvbytetrack_transform (GstBaseTransform * trans,
    GstBuffer * inbuf, GstBuffer * outbuf);
static GstFlowReturn gst_nvbytetrack_transform_ip (GstBaseTransform * trans,
    GstBuffer * buf);

enum
{
  PROP_0,
  PROP_TRACK_THRESH,
  PROP_HIGH_THRESH,
  PROP_MATCH_THRESH,
  PROP_MAX_ALIVE,
};

/* pad templates */

static GstStaticPadTemplate gst_nvbytetrack_src_template =
GST_STATIC_PAD_TEMPLATE ("src",
    GST_PAD_SRC,
    GST_PAD_ALWAYS,
    GST_STATIC_CAPS_ANY
    );

static GstStaticPadTemplate gst_nvbytetrack_sink_template =
GST_STATIC_PAD_TEMPLATE ("sink",
    GST_PAD_SINK,
    GST_PAD_ALWAYS,
    GST_STATIC_CAPS_ANY
    );


/* class initialization */

G_DEFINE_TYPE_WITH_CODE (GstNvbytetrack, gst_nvbytetrack, GST_TYPE_BASE_TRANSFORM,
  GST_DEBUG_CATEGORY_INIT (gst_nvbytetrack_debug_category, "nvbytetrack", 0,
  "debug category for nvbytetrack element"));

static void
gst_nvbytetrack_class_init (GstNvbytetrackClass * klass)
{
  GObjectClass *gobject_class = G_OBJECT_CLASS (klass);
  GstBaseTransformClass *base_transform_class = GST_BASE_TRANSFORM_CLASS (klass);

  /* Setting up pads and setting metadata should be moved to
     base_class_init if you intend to subclass this class. */
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_nvbytetrack_src_template);
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_nvbytetrack_sink_template);

  gst_element_class_set_static_metadata (GST_ELEMENT_CLASS(klass),
      "FIXME Long name", "Generic", "FIXME Description",
      "FIXME <fixme@example.com>");

  gobject_class->set_property = gst_nvbytetrack_set_property;
  gobject_class->get_property = gst_nvbytetrack_get_property;
  gobject_class->dispose = gst_nvbytetrack_dispose;
  gobject_class->finalize = gst_nvbytetrack_finalize;
  // base_transform_class->transform_caps = GST_DEBUG_FUNCPTR (gst_nvbytetrack_transform_caps);
  // base_transform_class->fixate_caps = GST_DEBUG_FUNCPTR (gst_nvbytetrack_fixate_caps);
  // base_transform_class->accept_caps = GST_DEBUG_FUNCPTR (gst_nvbytetrack_accept_caps);
  // base_transform_class->set_caps = GST_DEBUG_FUNCPTR (gst_nvbytetrack_set_caps);
  // base_transform_class->query = GST_DEBUG_FUNCPTR (gst_nvbytetrack_query);
  // base_transform_class->decide_allocation = GST_DEBUG_FUNCPTR (gst_nvbytetrack_decide_allocation);
  // base_transform_class->filter_meta = GST_DEBUG_FUNCPTR (gst_nvbytetrack_filter_meta);
  // base_transform_class->propose_allocation = GST_DEBUG_FUNCPTR (gst_nvbytetrack_propose_allocation);
  // base_transform_class->transform_size = GST_DEBUG_FUNCPTR (gst_nvbytetrack_transform_size);
  // base_transform_class->get_unit_size = GST_DEBUG_FUNCPTR (gst_nvbytetrack_get_unit_size);
  base_transform_class->start = GST_DEBUG_FUNCPTR (gst_nvbytetrack_start);
  base_transform_class->stop = GST_DEBUG_FUNCPTR (gst_nvbytetrack_stop);
  // base_transform_class->sink_event = GST_DEBUG_FUNCPTR (gst_nvbytetrack_sink_event);
  // base_transform_class->src_event = GST_DEBUG_FUNCPTR (gst_nvbytetrack_src_event);
  // base_transform_class->prepare_output_buffer = GST_DEBUG_FUNCPTR (gst_nvbytetrack_prepare_output_buffer);
  // base_transform_class->copy_metadata = GST_DEBUG_FUNCPTR (gst_nvbytetrack_copy_metadata);
  // base_transform_class->transform_meta = GST_DEBUG_FUNCPTR (gst_nvbytetrack_transform_meta);
  // base_transform_class->before_transform = GST_DEBUG_FUNCPTR (gst_nvbytetrack_before_transform);
  // base_transform_class->transform = GST_DEBUG_FUNCPTR (gst_nvbytetrack_transform);
  base_transform_class->transform_ip = GST_DEBUG_FUNCPTR (gst_nvbytetrack_transform_ip);

  g_object_class_install_property (gobject_class, PROP_TRACK_THRESH,
      g_param_spec_float ("track-thresh", "track_thresh",
          "",
          0, 1.0, DEFAULT_TRACK_THRESH,
          (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));
  
  g_object_class_install_property (gobject_class, PROP_HIGH_THRESH,
      g_param_spec_float ("high-thresh", "high_thresh",
          "",
          0, 1.0, DEFAULT_HIGH_THRESH,
          (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));
  
  g_object_class_install_property (gobject_class, PROP_MATCH_THRESH,
      g_param_spec_float ("match-thresh", "match_thresh",
          "",
          0, 1.0, DEFAULT_MATCH_THRESH,
          (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));
  
  g_object_class_install_property (gobject_class, PROP_MAX_ALIVE,
      g_param_spec_uint ("max-alive", "Max Alive Time",
          "Max amount of time tracker is kept alive without detection in miliseconds",
          0, 300000, DEFAULT_MAX_ALIVE,
          (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));
}

static void
gst_nvbytetrack_init (GstNvbytetrack *nvbytetrack)
{
  GstBaseTransform *btrans = GST_BASE_TRANSFORM (nvbytetrack);

  /* We will not be generating a new buffer. Just adding / updating
   * metadata. */
  gst_base_transform_set_in_place (GST_BASE_TRANSFORM (btrans), TRUE);
  /* We do not want to change the input caps. Set to passthrough. transform_ip
   * is still called. */
  gst_base_transform_set_passthrough (GST_BASE_TRANSFORM (btrans), TRUE);

  /* Initialize all property variables to default values */
  nvbytetrack->max_batch_size = DEFAULT_MAX_BATCH_SIZE;
  nvbytetrack->track_thresh = DEFAULT_TRACK_THRESH;
  nvbytetrack->high_thresh = DEFAULT_HIGH_THRESH;
  nvbytetrack->match_thresh = DEFAULT_MATCH_THRESH;
  nvbytetrack->max_alive = DEFAULT_MAX_ALIVE;

  if (g_getenv("DEBUG")) {
    nvbytetrack->debug = TRUE;
    g_print("INFO: (nvbytetrack) Debug=TRUE...\n");
  } else {
    nvbytetrack->debug = FALSE;
    g_print("INFO: (nvbytetrack) Debug=FALSE...\n");
  }
    
}

void
gst_nvbytetrack_set_property (GObject * object, guint property_id,
    const GValue * value, GParamSpec * pspec)
{
  GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (object);

  GST_DEBUG_OBJECT (nvbytetrack, "set_property");

  switch (property_id) {
    case PROP_TRACK_THRESH:
      nvbytetrack->track_thresh = g_value_get_float (value);
      break;
    case PROP_HIGH_THRESH:
      nvbytetrack->high_thresh = g_value_get_float (value);
      break;
    case PROP_MATCH_THRESH:
      nvbytetrack->match_thresh = g_value_get_float (value);
      break;
    case PROP_MAX_ALIVE:
      nvbytetrack->max_alive = g_value_get_uint (value);
      break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_nvbytetrack_get_property (GObject * object, guint property_id,
    GValue * value, GParamSpec * pspec)
{
  GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (object);

  GST_DEBUG_OBJECT (nvbytetrack, "get_property");

  switch (property_id) {
    case PROP_TRACK_THRESH:
      g_value_set_float(value, nvbytetrack->track_thresh);
      break;
    case PROP_HIGH_THRESH:
      g_value_set_float(value, nvbytetrack->high_thresh);
      break;
    case PROP_MATCH_THRESH:
      g_value_set_float(value, nvbytetrack->match_thresh);
      break;
    case PROP_MAX_ALIVE:
      g_value_set_uint (value, nvbytetrack->max_alive);
      break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_nvbytetrack_dispose (GObject * object)
{
  GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (object);

  GST_DEBUG_OBJECT (nvbytetrack, "dispose");

  /* clean up as possible.  may be called multiple times */

  G_OBJECT_CLASS (gst_nvbytetrack_parent_class)->dispose (object);
}

void
gst_nvbytetrack_finalize (GObject * object)
{
  GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (object);

  GST_DEBUG_OBJECT (nvbytetrack, "finalize");

  /* clean up object here */

  G_OBJECT_CLASS (gst_nvbytetrack_parent_class)->finalize (object);
}

// static GstCaps *
// gst_nvbytetrack_transform_caps (GstBaseTransform * trans, GstPadDirection direction,
//     GstCaps * caps, GstCaps * filter)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);
//   GstCaps *othercaps;

//   GST_DEBUG_OBJECT (nvbytetrack, "transform_caps");

//   othercaps = gst_caps_copy (caps);

//   /* Copy other caps and modify as appropriate */
//   /* This works for the simplest cases, where the transform modifies one
//    * or more fields in the caps structure.  It does not work correctly
//    * if passthrough caps are preferred. */
//   if (direction == GST_PAD_SRC) {
//     /* transform caps going upstream */
//   } else {
//     /* transform caps going downstream */
//   }

//   if (filter) {
//     GstCaps *intersect;

//     intersect = gst_caps_intersect (othercaps, filter);
//     gst_caps_unref (othercaps);

//     return intersect;
//   } else {
//     return othercaps;
//   }
// }

// static GstCaps *
// gst_nvbytetrack_fixate_caps (GstBaseTransform * trans, GstPadDirection direction,
//     GstCaps * caps, GstCaps * othercaps)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "fixate_caps");

//   return NULL;
// }

// static gboolean
// gst_nvbytetrack_accept_caps (GstBaseTransform * trans, GstPadDirection direction,
//     GstCaps * caps)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "accept_caps");

//   return TRUE;
// }

static gboolean
gst_nvbytetrack_set_caps (GstBaseTransform * trans, GstCaps * incaps,
    GstCaps * outcaps)
{
  GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

  GST_DEBUG_OBJECT (nvbytetrack, "set_caps");

  return TRUE;
}

// static gboolean
// gst_nvbytetrack_query (GstBaseTransform * trans, GstPadDirection direction,
//     GstQuery * query)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "query");

//   return TRUE;
// }

// /* decide allocation query for output buffers */
// static gboolean
// gst_nvbytetrack_decide_allocation (GstBaseTransform * trans, GstQuery * query)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "decide_allocation");

//   return TRUE;
// }

// static gboolean
// gst_nvbytetrack_filter_meta (GstBaseTransform * trans, GstQuery * query, GType api,
//     const GstStructure * params)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "filter_meta");

//   return TRUE;
// }

// /* propose allocation query parameters for input buffers */
// static gboolean
// gst_nvbytetrack_propose_allocation (GstBaseTransform * trans,
//     GstQuery * decide_query, GstQuery * query)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "propose_allocation");

//   return TRUE;
// }

// /* transform size */
// static gboolean
// gst_nvbytetrack_transform_size (GstBaseTransform * trans, GstPadDirection direction,
//     GstCaps * caps, gsize size, GstCaps * othercaps, gsize * othersize)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "transform_size");

//   return TRUE;
// }

// static gboolean
// gst_nvbytetrack_get_unit_size (GstBaseTransform * trans, GstCaps * caps,
//     gsize * size)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "get_unit_size");

//   return TRUE;
// }

/* states */
static gboolean
gst_nvbytetrack_start (GstBaseTransform * trans)
{
  GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

  GST_DEBUG_OBJECT (nvbytetrack, "start");

  return TRUE;
}

static gboolean
gst_nvbytetrack_stop (GstBaseTransform * trans)
{
  GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

  GST_DEBUG_OBJECT (nvbytetrack, "stop");

  return TRUE;
}

// /* sink and src pad event handlers */
// static gboolean
// gst_nvbytetrack_sink_event (GstBaseTransform * trans, GstEvent * event)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "sink_event");

//   return GST_BASE_TRANSFORM_CLASS (gst_nvbytetrack_parent_class)->sink_event (
//       trans, event);
// }

// static gboolean
// gst_nvbytetrack_src_event (GstBaseTransform * trans, GstEvent * event)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "src_event");

//   return GST_BASE_TRANSFORM_CLASS (gst_nvbytetrack_parent_class)->src_event (
//       trans, event);
// }

// static GstFlowReturn
// gst_nvbytetrack_prepare_output_buffer (GstBaseTransform * trans, GstBuffer * input,
//     GstBuffer ** outbuf)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "prepare_output_buffer");

//   return GST_FLOW_OK;
// }

// /* metadata */
// static gboolean
// gst_nvbytetrack_copy_metadata (GstBaseTransform * trans, GstBuffer * input,
//     GstBuffer * outbuf)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "copy_metadata");

//   return TRUE;
// }

// static gboolean
// gst_nvbytetrack_transform_meta (GstBaseTransform * trans, GstBuffer * outbuf,
//     GstMeta * meta, GstBuffer * inbuf)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "transform_meta");

//   return TRUE;
// }

// static void
// gst_nvbytetrack_before_transform (GstBaseTransform * trans, GstBuffer * buffer)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "before_transform");

// }

// /* transform */
// static GstFlowReturn
// gst_nvbytetrack_transform (GstBaseTransform * trans, GstBuffer * inbuf,
//     GstBuffer * outbuf)
// {
//   GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);

//   GST_DEBUG_OBJECT (nvbytetrack, "transform");

//   return GST_FLOW_OK;
// }

static GstFlowReturn
gst_nvbytetrack_transform_ip (GstBaseTransform * trans, GstBuffer * buf)
{
  GstNvbytetrack *nvbytetrack = GST_NVBYTETRACK (trans);
  NvDsBatchMeta *batch_meta = gst_buffer_get_nvds_batch_meta(buf);

  GST_DEBUG_OBJECT (nvbytetrack, "transform_ip");

  if (batch_meta) {
    NvDsFrameMeta *frame_meta = NULL;
    NvDsObjectMeta *obj_meta = NULL;
    NvDsMetaList *l_frame = NULL;
    NvDsMetaList *l_obj = NULL;
    // NvDsUserMeta *user_meta = NULL;
    // NvDsUserMeta *user_custom_meta = NULL;
    // NvDsInferTensorMeta *meta = NULL;
    // NvDsInferLayerInfo *infor = NULL;
    // float *outputCoverageBuffer = NULL;
    // CustomMeta *custom_meta = NULL;

    for (NvDsMetaList *l_frame = batch_meta->frame_meta_list; l_frame != NULL; l_frame = l_frame->next) {
      frame_meta = (NvDsFrameMeta *)l_frame->data;
      int batch_id = (int) frame_meta->source_id;


      if (!nvbytetrack->bytetrack_ctx[batch_id]) {
        ByteTrackPluginInitParams init_params = {
          nvbytetrack->track_thresh,
          nvbytetrack->high_thresh,
          nvbytetrack->match_thresh,
          nvbytetrack->max_alive
        };
        nvbytetrack->bytetrack_ctx[batch_id] = ByteTrackPluginCtxInit (&init_params);
        nvbytetrack->num_ctx++;
        GST_INFO_OBJECT (nvbytetrack, "[ByteTrack] Created context %d!!!\n", batch_id);
      }

      vector<Object> detections;
      detections.reserve(frame_meta->num_obj_meta);
      for (NvDsMetaList * l_obj = frame_meta->obj_meta_list; l_obj != NULL; l_obj=l_obj->next) {
        obj_meta = (NvDsObjectMeta *) l_obj->data;
        // obj_meta->object_id = 0;
        NvOSD_RectParams & rect_params = obj_meta->rect_params;

        Object detector;
        detector.obj_meta = obj_meta;
        detector.label = obj_meta->class_id;
        detector.prob = obj_meta->confidence;
        detector.rect.x = rect_params.left;
        detector.rect.y = rect_params.top;
        detector.rect.width = rect_params.width;
        detector.rect.height = rect_params.height;

        detections.push_back(detector);
      }

      // TODO: Check if interval pgie
      if (detections.size() == 0) continue;
      vector<STrack> output_stracks = nvbytetrack->bytetrack_ctx[batch_id]->mTracker->update(detections, frame_meta);

      if (nvbytetrack->debug) {
        // write track_id to text_params
        for (NvDsMetaList * l_obj = frame_meta->obj_meta_list; l_obj != NULL; l_obj=l_obj->next) {
          obj_meta = (NvDsObjectMeta *) l_obj->data;
          NvOSD_TextParams & text_params = obj_meta->text_params;
          auto tmp = std::string(text_params.display_text);
          g_free(text_params.display_text);
          text_params.display_text = g_strdup_printf("%s-%d", tmp.c_str(), obj_meta->object_id);
        }
      }
    }
  }

  return GST_FLOW_OK;
}

static gboolean
plugin_init (GstPlugin * plugin)
{

  /* FIXME Remember to set the rank if it's an element that is meant
     to be autoplugged by decodebin. */
  return gst_element_register (plugin, "nvbytetrack", GST_RANK_NONE,
      GST_TYPE_NVBYTETRACK);
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
    nvbytetrack,
    "FIXME plugin description",
    plugin_init, VERSION, "LGPL", PACKAGE_NAME, GST_PACKAGE_ORIGIN)

