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

#ifndef _GST_DATAPROCESS_H_
#define _GST_DATAPROCESS_H_

#include <gst/gst.h>
#include <gst/base/gstbasetransform.h>
#include <chrono>

#include "gstnvdsmeta.h"
#include "nvdsmeta_schema.h"
#include "nvds_analytics_meta.h"
#include "gstnvdsinfer.h"
#include "nvbufsurface.h"
#include "nvds_obj_encode.h"

#include "context_utils.h"
#include "utils.h"
#include "context.h"
#include "TimeRecorder.h"
#include "custom_meta.h"


G_BEGIN_DECLS

#define GST_TYPE_DATAPROCESS   (gst_dataprocess_get_type())
#define GST_DATAPROCESS(obj)   (G_TYPE_CHECK_INSTANCE_CAST((obj),GST_TYPE_DATAPROCESS,GstDataprocess))
#define GST_DATAPROCESS_CLASS(klass)   (G_TYPE_CHECK_CLASS_CAST((klass),GST_TYPE_DATAPROCESS,GstDataprocessClass))
#define GST_IS_DATAPROCESS(obj)   (G_TYPE_CHECK_INSTANCE_TYPE((obj),GST_TYPE_DATAPROCESS))
#define GST_IS_DATAPROCESS_CLASS(obj)   (G_TYPE_CHECK_CLASS_TYPE((klass),GST_TYPE_DATAPROCESS))

typedef struct _GstDataprocess GstDataprocess;
typedef struct _GstDataprocessClass GstDataprocessClass;

struct _GstDataprocess
{
  GstBaseTransform base_dataprocess;

  std::string box_id;
  CameraData *cam_data_list;
  ProcessContext* process_ctx[MAX_NUM_SOURCES];
  faiss::Index* user_index;
  gboolean debug;
};

struct _GstDataprocessClass
{
  GstBaseTransformClass base_dataprocess_class;
};

GType gst_dataprocess_get_type (void);

G_END_DECLS

#endif
