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
 * Free Software Foundation, Inc., 51 Franklin St, Fifth Floor,
 * Boston, MA 02110-1301, USA.
 */

#ifndef _GST_SRCMONITOR_H_
#define _GST_SRCMONITOR_H_

#include <gst/base/gstbasetransform.h>

#include "fps.h"
#include "gstnvdsmeta.h"
#include "common.h"
#include "utils.h"

G_BEGIN_DECLS

#define GST_TYPE_SRCMONITOR   (gst_srcmonitor_get_type())
#define GST_SRCMONITOR(obj)   (G_TYPE_CHECK_INSTANCE_CAST((obj),GST_TYPE_SRCMONITOR,GstSrcmonitor))
#define GST_SRCMONITOR_CLASS(klass)   (G_TYPE_CHECK_CLASS_CAST((klass),GST_TYPE_SRCMONITOR,GstSrcmonitorClass))
#define GST_IS_SRCMONITOR(obj)   (G_TYPE_CHECK_INSTANCE_TYPE((obj),GST_TYPE_SRCMONITOR))
#define GST_IS_SRCMONITOR_CLASS(obj)   (G_TYPE_CHECK_CLASS_TYPE((klass),GST_TYPE_SRCMONITOR))

typedef struct _GstSrcmonitor GstSrcmonitor;
typedef struct _GstSrcmonitorClass GstSrcmonitorClass;

struct _GstSrcmonitor
{
  GstBaseTransform base_srcmonitor;

  gchar *monitor_data;
  FPS fps;
  CameraData *g_cam_data_list;
  gint g_frame_out_list[MAX_NUM_SOURCES]={0};
  std::chrono::system_clock::time_point last_update;
};

struct _GstSrcmonitorClass
{
  GstBaseTransformClass base_srcmonitor_class;
};

GType gst_srcmonitor_get_type (void);

G_END_DECLS

#endif
