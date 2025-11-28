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

#ifndef _GST_DATAFILTER_H_
#define _GST_DATAFILTER_H_

#include <gst/base/gstbasetransform.h>

#include "gstnvdsmeta.h"
#include "nvdsmeta_schema.h"
#include "nvds_analytics_meta.h"
#include "nvdsmeta.h"
#include "nvbufsurface.h"
#include "nvds_obj_encode.h"

#include "common.h"

G_BEGIN_DECLS

#define GST_TYPE_DATAFILTER   (gst_datafilter_get_type())
#define GST_DATAFILTER(obj)   (G_TYPE_CHECK_INSTANCE_CAST((obj),GST_TYPE_DATAFILTER,GstDatafilter))
#define GST_DATAFILTER_CLASS(klass)   (G_TYPE_CHECK_CLASS_CAST((klass),GST_TYPE_DATAFILTER,GstDatafilterClass))
#define GST_IS_DATAFILTER(obj)   (G_TYPE_CHECK_INSTANCE_TYPE((obj),GST_TYPE_DATAFILTER))
#define GST_IS_DATAFILTER_CLASS(obj)   (G_TYPE_CHECK_CLASS_TYPE((klass),GST_TYPE_DATAFILTER))

typedef struct _GstDatafilter GstDatafilter;
typedef struct _GstDatafilterClass GstDatafilterClass;


struct _GstDatafilter
{
  GstBaseTransform base_datafilter;

  gboolean debug;
  NvDsObjEncCtxHandle obj_ctx_handle;  // for saving obj img (debug mode)
  // CameraData g_cam_data_list[MAX_NUM_SOURCES];
  CameraData *cam_data_list;
};

struct _GstDatafilterClass
{
  GstBaseTransformClass base_datafilter_class;
};

GType gst_datafilter_get_type (void);

G_END_DECLS

#endif
