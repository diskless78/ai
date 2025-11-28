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
 * SECTION:element-gstdatafilter
 *
 * The datafilter element does FIXME stuff.
 *
 * <refsect2>
 * <title>Example launch line</title>
 * |[
 * gst-launch-1.0 -v fakesrc ! datafilter ! FIXME ! fakesink
 * ]|
 * FIXME Describe what the pipeline does.
 * </refsect2>
 */

#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

#include <gst/gst.h>
#include <gst/base/gstbasetransform.h>
#include "spdlog/spdlog.h"

#include "gstdatafilter.h"
#include "custom_meta.h"
#include "utils.h"


GST_DEBUG_CATEGORY_STATIC (gst_datafilter_debug_category);
#define GST_CAT_DEFAULT gst_datafilter_debug_category

/* prototypes */


static void gst_datafilter_set_property (GObject * object,
    guint property_id, const GValue * value, GParamSpec * pspec);
static void gst_datafilter_get_property (GObject * object,
    guint property_id, GValue * value, GParamSpec * pspec);
static void gst_datafilter_dispose (GObject * object);
static void gst_datafilter_finalize (GObject * object);
static gboolean gst_datafilter_start (GstBaseTransform * trans);
static gboolean gst_datafilter_stop (GstBaseTransform * trans);
static GstFlowReturn gst_datafilter_transform_ip (GstBaseTransform * trans,
    GstBuffer * buf);

enum
{
  PROP_0
};

/* pad templates */

static GstStaticPadTemplate gst_datafilter_src_template =
GST_STATIC_PAD_TEMPLATE ("src",
    GST_PAD_SRC,
    GST_PAD_ALWAYS,
    GST_STATIC_CAPS_ANY
    );

static GstStaticPadTemplate gst_datafilter_sink_template =
GST_STATIC_PAD_TEMPLATE ("sink",
    GST_PAD_SINK,
    GST_PAD_ALWAYS,
    GST_STATIC_CAPS_ANY
    );


/* class initialization */

G_DEFINE_TYPE_WITH_CODE (GstDatafilter, gst_datafilter, GST_TYPE_BASE_TRANSFORM,
  GST_DEBUG_CATEGORY_INIT (gst_datafilter_debug_category, "datafilter", 0,
  "debug category for datafilter element"));

static void
gst_datafilter_class_init (GstDatafilterClass * klass)
{
  GObjectClass *gobject_class = G_OBJECT_CLASS (klass);
  GstBaseTransformClass *base_transform_class = GST_BASE_TRANSFORM_CLASS (klass);

  /* Setting up pads and setting metadata should be moved to
     base_class_init if you intend to subclass this class. */
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_datafilter_src_template);
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_datafilter_sink_template);

  gst_element_class_set_static_metadata (GST_ELEMENT_CLASS(klass),
      "FIXME Long name", "Generic", "FIXME Description",
      "FIXME <fixme@example.com>");

  gobject_class->set_property = gst_datafilter_set_property;
  gobject_class->get_property = gst_datafilter_get_property;
  gobject_class->dispose = gst_datafilter_dispose;
  gobject_class->finalize = gst_datafilter_finalize;
  base_transform_class->start = GST_DEBUG_FUNCPTR (gst_datafilter_start);
  base_transform_class->stop = GST_DEBUG_FUNCPTR (gst_datafilter_stop);
  base_transform_class->transform_ip = GST_DEBUG_FUNCPTR (gst_datafilter_transform_ip);
}

static void
gst_datafilter_init (GstDatafilter *datafilter)
{
}

void
gst_datafilter_set_property (GObject * object, guint property_id,
    const GValue * value, GParamSpec * pspec)
{
  GstDatafilter *datafilter = GST_DATAFILTER (object);

  GST_DEBUG_OBJECT (datafilter, "set_property");

  switch (property_id) {
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_datafilter_get_property (GObject * object, guint property_id,
    GValue * value, GParamSpec * pspec)
{
  GstDatafilter *datafilter = GST_DATAFILTER (object);

  GST_DEBUG_OBJECT (datafilter, "get_property");

  switch (property_id) {
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_datafilter_dispose (GObject * object)
{
  GstDatafilter *datafilter = GST_DATAFILTER (object);

  GST_DEBUG_OBJECT (datafilter, "dispose");

  /* clean up as possible.  may be called multiple times */

  G_OBJECT_CLASS (gst_datafilter_parent_class)->dispose (object);
}

void
gst_datafilter_finalize (GObject * object)
{
  GstDatafilter *datafilter = GST_DATAFILTER (object);

  GST_DEBUG_OBJECT (datafilter, "finalize");

  /* clean up object here */

  G_OBJECT_CLASS (gst_datafilter_parent_class)->finalize (object);
}

/* states */
static gboolean
gst_datafilter_start (GstBaseTransform * trans)
{
  GstDatafilter *datafilter = GST_DATAFILTER (trans);

  spdlog::info("Initialize Data Filter...");

	if (g_getenv("DEBUG")) {
    datafilter->debug = TRUE;
		datafilter->obj_ctx_handle = nvds_obj_enc_create_context ();
    spdlog::info("datafilter: Debug=TRUE...\n");
  } else {
    datafilter->debug = FALSE;
    spdlog::info("datafilter: Debug=FALSE...\n");
  }

	// Parse source data from env config
	gchar const *config = g_getenv("CONFIG");
  if (!config)
  {
    spdlog::error("[gstdatafilter] CONFIG NULL...");
    return FALSE;
  }
  datafilter->cam_data_list = new CameraData[MAX_NUM_SOURCES];
	if (!parse_config(datafilter->cam_data_list, config))
	{
		spdlog::error("[gstdatafilter] parse config failed...");
    return FALSE;
	}

  GST_DEBUG_OBJECT (datafilter, "start");

  return TRUE;
}

static gboolean
gst_datafilter_stop (GstBaseTransform * trans)
{
  GstDatafilter *datafilter = GST_DATAFILTER (trans);

	if (datafilter->debug) nvds_obj_enc_destroy_context (datafilter->obj_ctx_handle);

	delete []datafilter->cam_data_list;

  GST_DEBUG_OBJECT (datafilter, "stop");

  return TRUE;
}

static GstFlowReturn
gst_datafilter_transform_ip (GstBaseTransform * trans, GstBuffer * buf)
{
  GstDatafilter *datafilter = GST_DATAFILTER (trans);

  GST_DEBUG_OBJECT (datafilter, "transform_ip");

  NvDsBatchMeta *batch_meta = gst_buffer_get_nvds_batch_meta(buf);
	GstMapInfo inmap = GST_MAP_INFO_INIT;
  if (!gst_buffer_map (buf, &inmap, GST_MAP_READ)) {
    GST_ERROR ("input buffer mapinfo failed");
    return GST_FLOW_ERROR;
  }
  NvBufSurface *ip_surf = (NvBufSurface *) inmap.data;
  gst_buffer_unmap (buf, &inmap);

	for (NvDsMetaList * l_frame = batch_meta->frame_meta_list; l_frame != NULL; l_frame = l_frame->next) {
    NvDsFrameMeta *frame_meta = (NvDsFrameMeta *)l_frame->data;
    int batch_id = (int) frame_meta->source_id;
		CameraData cam_data = datafilter->cam_data_list[batch_id];

		for (NvDsMetaList * l_obj = frame_meta->obj_meta_list; l_obj != NULL; l_obj=l_obj->next) {
			NvDsObjectMeta *obj_meta = (NvDsObjectMeta *)(l_obj->data);
			gboolean is_entry = FALSE;

			for (NvDsMetaList * l_user = obj_meta->obj_user_meta_list; l_user != NULL; l_user = l_user->next) {
				NvDsUserMeta *user_meta = (NvDsUserMeta *) l_user->data;

				if (user_meta->base_meta.meta_type != NVDS_USER_OBJ_META_NVDSANALYTICS) continue;
				NvDsAnalyticsObjInfo *analytic_meta = (NvDsAnalyticsObjInfo *)user_meta->user_meta_data;
				if (analytic_meta->lcStatus.size() > 0) {
					is_entry = TRUE;
				}
			}

			// backup box
			BoxData *box_meta = (BoxData *) g_malloc0 (sizeof (BoxData));
			box_meta->left = obj_meta->rect_params.left;
			box_meta->top = obj_meta->rect_params.top;
			box_meta->width = obj_meta->rect_params.width;
			box_meta->height = obj_meta->rect_params.height;
			NvDsUserMeta *user_box_meta = nvds_acquire_user_meta_from_pool (batch_meta);
			user_box_meta->user_meta_data = (void *) box_meta;
			user_box_meta->base_meta.meta_type = NVDS_GST_CUSTOM_META;
			user_box_meta->base_meta.copy_func = (NvDsMetaCopyFunc) box_meta_copy_func;
			user_box_meta->base_meta.release_func = (NvDsMetaReleaseFunc) box_meta_free_func;
			nvds_add_user_meta_to_obj(obj_meta, user_box_meta);

			// ignore sgie if not entry
			if (!is_entry || !cam_data.is_reid) {
				obj_meta->rect_params.left = 0;
				obj_meta->rect_params.top = 0;
				obj_meta->rect_params.width = 0;
				obj_meta->rect_params.height = 0;
			} else if (cam_data.is_reid && datafilter->debug) {
				NvDsObjEncUsrArgs userData = { 0 };
				/* To be set by user */
				userData.saveImg = false;
				userData.attachUsrMeta = true;
				/*Main Function Call */
				nvds_obj_enc_process (datafilter->obj_ctx_handle, &userData, ip_surf, obj_meta, frame_meta);
			}
		}
	}

	if (datafilter->debug) nvds_obj_enc_finish (datafilter->obj_ctx_handle);

  return GST_FLOW_OK;
}

static gboolean
plugin_init (GstPlugin * plugin)
{

  /* FIXME Remember to set the rank if it's an element that is meant
     to be autoplugged by decodebin. */
  return gst_element_register (plugin, "datafilter", GST_RANK_NONE,
      GST_TYPE_DATAFILTER);
}

/* FIXME: these are normally defined by the GStreamer build system.
   If you are creating an element to be included in gst-plugins-*,
   remove these, as they're always defined.  Otherwise, edit as
   appropriate for your external plugin package. */
#ifndef VERSION
#define VERSION "0.0.1"
#endif
#ifndef PACKAGE
#define PACKAGE "datafiler"
#endif
#ifndef PACKAGE_NAME
#define PACKAGE_NAME "gstdatafiler"
#endif
#ifndef GST_PACKAGE_ORIGIN
#define GST_PACKAGE_ORIGIN "http://FIXME.org/"
#endif

GST_PLUGIN_DEFINE (GST_VERSION_MAJOR,
    GST_VERSION_MINOR,
    datafilter,
    "FIXME plugin description",
    plugin_init, VERSION, "LGPL", PACKAGE_NAME, GST_PACKAGE_ORIGIN)

