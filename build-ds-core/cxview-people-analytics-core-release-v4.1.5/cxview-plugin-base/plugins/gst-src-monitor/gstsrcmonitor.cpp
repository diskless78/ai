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
 * SECTION:element-gstsrcmonitor
 *
 * The srcmonitor element does FIXME stuff.
 *
 * <refsect2>
 * <title>Example launch line</title>
 * |[
 * gst-launch-1.0 -v fakesrc ! srcmonitor ! FIXME ! fakesink
 * ]|
 * FIXME Describe what the pipeline does.
 * </refsect2>
 */

#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

#include <gst/gst.h>
#include <gst/base/gstbasetransform.h>

#include "nlohmann/json.hpp"
#include "gstsrcmonitor.h"

GST_DEBUG_CATEGORY_STATIC (gst_srcmonitor_debug_category);
#define GST_CAT_DEFAULT gst_srcmonitor_debug_category

/* prototypes */


static void gst_srcmonitor_set_property (GObject * object,
    guint property_id, const GValue * value, GParamSpec * pspec);
static void gst_srcmonitor_get_property (GObject * object,
    guint property_id, GValue * value, GParamSpec * pspec);
static void gst_srcmonitor_dispose (GObject * object);
static void gst_srcmonitor_finalize (GObject * object);

static GstCaps *gst_srcmonitor_transform_caps (GstBaseTransform * trans,
    GstPadDirection direction, GstCaps * caps, GstCaps * filter);
static GstCaps *gst_srcmonitor_fixate_caps (GstBaseTransform * trans,
    GstPadDirection direction, GstCaps * caps, GstCaps * othercaps);
static gboolean gst_srcmonitor_accept_caps (GstBaseTransform * trans,
    GstPadDirection direction, GstCaps * caps);
static gboolean gst_srcmonitor_set_caps (GstBaseTransform * trans,
    GstCaps * incaps, GstCaps * outcaps);
static gboolean gst_srcmonitor_query (GstBaseTransform * trans,
    GstPadDirection direction, GstQuery * query);
static gboolean gst_srcmonitor_decide_allocation (GstBaseTransform * trans,
    GstQuery * query);
static gboolean gst_srcmonitor_filter_meta (GstBaseTransform * trans,
    GstQuery * query, GType api, const GstStructure * params);
static gboolean gst_srcmonitor_propose_allocation (GstBaseTransform * trans,
    GstQuery * decide_query, GstQuery * query);
static gboolean gst_srcmonitor_transform_size (GstBaseTransform * trans,
    GstPadDirection direction, GstCaps * caps, gsize size, GstCaps * othercaps,
    gsize * othersize);
static gboolean gst_srcmonitor_get_unit_size (GstBaseTransform * trans,
    GstCaps * caps, gsize * size);
static gboolean gst_srcmonitor_start (GstBaseTransform * trans);
static gboolean gst_srcmonitor_stop (GstBaseTransform * trans);
static gboolean gst_srcmonitor_sink_event (GstBaseTransform * trans,
    GstEvent * event);
static gboolean gst_srcmonitor_src_event (GstBaseTransform * trans,
    GstEvent * event);
static GstFlowReturn gst_srcmonitor_prepare_output_buffer (GstBaseTransform *
    trans, GstBuffer * input, GstBuffer ** outbuf);
static gboolean gst_srcmonitor_copy_metadata (GstBaseTransform * trans,
    GstBuffer * input, GstBuffer * outbuf);
static gboolean gst_srcmonitor_transform_meta (GstBaseTransform * trans,
    GstBuffer * outbuf, GstMeta * meta, GstBuffer * inbuf);
static void gst_srcmonitor_before_transform (GstBaseTransform * trans,
    GstBuffer * buffer);
static GstFlowReturn gst_srcmonitor_transform (GstBaseTransform * trans,
    GstBuffer * inbuf, GstBuffer * outbuf);
static GstFlowReturn gst_srcmonitor_transform_ip (GstBaseTransform * trans,
    GstBuffer * buf);

enum
{
  PROP_0,
  PROP_MONITOR_DATA
};

/* pad templates */

static GstStaticPadTemplate gst_srcmonitor_src_template =
GST_STATIC_PAD_TEMPLATE ("src",
    GST_PAD_SRC,
    GST_PAD_ALWAYS,
    GST_STATIC_CAPS_ANY
    );

static GstStaticPadTemplate gst_srcmonitor_sink_template =
GST_STATIC_PAD_TEMPLATE ("sink",
    GST_PAD_SINK,
    GST_PAD_ALWAYS,
    GST_STATIC_CAPS_ANY
    );


/* class initialization */

G_DEFINE_TYPE_WITH_CODE (GstSrcmonitor, gst_srcmonitor, GST_TYPE_BASE_TRANSFORM,
  GST_DEBUG_CATEGORY_INIT (gst_srcmonitor_debug_category, "srcmonitor", 0,
  "debug category for srcmonitor element"));

static void
gst_srcmonitor_class_init (GstSrcmonitorClass * klass)
{
  GObjectClass *gobject_class = G_OBJECT_CLASS (klass);
  GstBaseTransformClass *base_transform_class = GST_BASE_TRANSFORM_CLASS (klass);

  /* Setting up pads and setting metadata should be moved to
     base_class_init if you intend to subclass this class. */
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_srcmonitor_src_template);
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_srcmonitor_sink_template);

  gst_element_class_set_static_metadata (GST_ELEMENT_CLASS(klass),
      "FIXME Long name", "Generic", "FIXME Description",
      "FIXME <fixme@example.com>");

  gobject_class->set_property = gst_srcmonitor_set_property;
  gobject_class->get_property = gst_srcmonitor_get_property;
  gobject_class->dispose = gst_srcmonitor_dispose;
  gobject_class->finalize = gst_srcmonitor_finalize;
  base_transform_class->set_caps = GST_DEBUG_FUNCPTR (gst_srcmonitor_set_caps);
  base_transform_class->start = GST_DEBUG_FUNCPTR (gst_srcmonitor_start);
  base_transform_class->stop = GST_DEBUG_FUNCPTR (gst_srcmonitor_stop);
  base_transform_class->transform_ip = GST_DEBUG_FUNCPTR (gst_srcmonitor_transform_ip);

  g_object_class_install_property (gobject_class, PROP_MONITOR_DATA,
      g_param_spec_string ("monitor-data", "src monitor data (json)",
      "Use for save src monitor data (json).",
      MONITOR_DEFAULT_DATA, (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

}

static void
gst_srcmonitor_init (GstSrcmonitor *srcmonitor)
{
  srcmonitor->monitor_data = g_strdup(MONITOR_DEFAULT_DATA);
}

void
gst_srcmonitor_set_property (GObject * object, guint property_id,
    const GValue * value, GParamSpec * pspec)
{
  GstSrcmonitor *srcmonitor = GST_SRCMONITOR (object);

  GST_DEBUG_OBJECT (srcmonitor, "set_property");

  switch (property_id) {
    case PROP_MONITOR_DATA:
      if (srcmonitor->monitor_data)
        g_free (srcmonitor->monitor_data);
      srcmonitor->monitor_data = (gchar *) g_value_dup_string (value);
      break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_srcmonitor_get_property (GObject * object, guint property_id,
    GValue * value, GParamSpec * pspec)
{
  GstSrcmonitor *srcmonitor = GST_SRCMONITOR (object);

  GST_DEBUG_OBJECT (srcmonitor, "get_property");

  switch (property_id) {
    case PROP_MONITOR_DATA:
      g_value_set_string (value, srcmonitor->monitor_data);
      break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_srcmonitor_dispose (GObject * object)
{
  GstSrcmonitor *srcmonitor = GST_SRCMONITOR (object);

  GST_DEBUG_OBJECT (srcmonitor, "dispose");

  /* clean up as possible.  may be called multiple times */

  G_OBJECT_CLASS (gst_srcmonitor_parent_class)->dispose (object);
}

void
gst_srcmonitor_finalize (GObject * object)
{
  GstSrcmonitor *srcmonitor = GST_SRCMONITOR (object);

  GST_DEBUG_OBJECT (srcmonitor, "finalize");

  if (srcmonitor->monitor_data)
    g_free (srcmonitor->monitor_data);

  /* clean up object here */
  delete []srcmonitor->g_cam_data_list;

  G_OBJECT_CLASS (gst_srcmonitor_parent_class)->finalize (object);
}

static gboolean
gst_srcmonitor_set_caps (GstBaseTransform * trans, GstCaps * incaps,
    GstCaps * outcaps)
{
  GstSrcmonitor *srcmonitor = GST_SRCMONITOR (trans);

  GST_DEBUG_OBJECT (srcmonitor, "set_caps");

  return TRUE;
}

/* states */
static gboolean
gst_srcmonitor_start (GstBaseTransform * trans)
{
  GstSrcmonitor *srcmonitor = GST_SRCMONITOR (trans);

  GST_DEBUG_OBJECT (srcmonitor, "start");

  const char* config = g_getenv("CONFIG");
  g_assert(config);
  srcmonitor->g_cam_data_list = new CameraData[MAX_NUM_SOURCES];
  if (!parse_config(srcmonitor->g_cam_data_list, config)) {
    spdlog::error("gstsrcmonitor: Can not parse config. Exiting...");
    g_assert(FALSE);
  }

  srcmonitor->fps = FPS();
  srcmonitor->last_update = std::chrono::system_clock::now();

  return TRUE;
}

static gboolean
gst_srcmonitor_stop (GstBaseTransform * trans)
{
  GstSrcmonitor *srcmonitor = GST_SRCMONITOR (trans);

  GST_DEBUG_OBJECT (srcmonitor, "stop");

  return TRUE;
}

static GstFlowReturn
gst_srcmonitor_transform_ip (GstBaseTransform * trans, GstBuffer * buf)
{
  GstSrcmonitor *srcmonitor = GST_SRCMONITOR (trans);

  GST_DEBUG_OBJECT (srcmonitor, "transform_ip");

  std::chrono::system_clock::time_point now = std::chrono::system_clock::now();
  float _fps = srcmonitor->fps.update(now);

  for (gint source_id = 0; source_id < MAX_NUM_SOURCES; source_id++)
	{
    CameraData& cam_data = srcmonitor->g_cam_data_list[source_id];
		if (!cam_data.url.length())
			continue;
		srcmonitor->g_frame_out_list[source_id] += 1;
	}

  NvDsBatchMeta *batch_meta = 
    gst_buffer_get_nvds_batch_meta (buf);
  /* Iterate each frame metadata in batch */
  for (NvDsMetaList * l_frame = batch_meta->frame_meta_list; l_frame != NULL; l_frame = l_frame->next) {
    NvDsFrameMeta *frame_meta = (NvDsFrameMeta *)(l_frame->data);
		srcmonitor->g_frame_out_list[(int)frame_meta->source_id] = 0;
  }

  if ((std::chrono::duration_cast<std::chrono::seconds>(now - srcmonitor->last_update)).count() > REFRESH_INTERVAL*60) {
    srcmonitor->last_update = now;

    // write data to plugin property
    spdlog::info("gstsrcmonitor: FPS={}. updating monitor data to property...", _fps);
    nlohmann::json data;
    data["data"] = nlohmann::json::array();
    for (gint source_id = 0; source_id < MAX_NUM_SOURCES; source_id++)
    {
      CameraData& cam_data = srcmonitor->g_cam_data_list[source_id];
      if (!cam_data.url.length()) data["data"].push_back(-1);
      else data["data"].push_back(srcmonitor->g_frame_out_list[source_id]);
    }
    srcmonitor->monitor_data = g_strdup(data.dump().c_str());
  }

  return GST_FLOW_OK;
}

static gboolean
plugin_init (GstPlugin * plugin)
{

  /* FIXME Remember to set the rank if it's an element that is meant
     to be autoplugged by decodebin. */
  return gst_element_register (plugin, "srcmonitor", GST_RANK_NONE,
      GST_TYPE_SRCMONITOR);
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
    srcmonitor,
    "FIXME plugin description",
    plugin_init, VERSION, "LGPL", PACKAGE_NAME, GST_PACKAGE_ORIGIN)

