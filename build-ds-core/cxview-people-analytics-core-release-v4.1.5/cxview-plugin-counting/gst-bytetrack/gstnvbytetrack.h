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

#ifndef _GST_NVBYTETRACK_H_
#define _GST_NVBYTETRACK_H_

#include <gst/base/gstbasetransform.h>
#include "gstnvdsmeta.h"

#include "bytetrack_context.h"

G_BEGIN_DECLS

#define GST_TYPE_NVBYTETRACK   (gst_nvbytetrack_get_type())
#define GST_NVBYTETRACK(obj)   (G_TYPE_CHECK_INSTANCE_CAST((obj),GST_TYPE_NVBYTETRACK,GstNvbytetrack))
#define GST_NVBYTETRACK_CLASS(klass)   (G_TYPE_CHECK_CLASS_CAST((klass),GST_TYPE_NVBYTETRACK,GstNvbytetrackClass))
#define GST_IS_NVBYTETRACK(obj)   (G_TYPE_CHECK_INSTANCE_TYPE((obj),GST_TYPE_NVBYTETRACK))
#define GST_IS_NVBYTETRACK_CLASS(obj)   (G_TYPE_CHECK_CLASS_TYPE((klass),GST_TYPE_NVBYTETRACK))

typedef struct _GstNvbytetrack GstNvbytetrack;
typedef struct _GstNvbytetrackClass GstNvbytetrackClass;

/* Default values for properties */
// for peoplenet
#define DEFAULT_TRACK_THRESH 0.3
#define DEFAULT_HIGH_THRESH 0.4
#define DEFAULT_MATCH_THRESH 0.8
#define DEFAULT_MAX_ALIVE 1000  // ms
#define DEFAULT_MAX_BATCH_SIZE 4

struct _GstNvbytetrack
{
  GstBaseTransform base_nvbytetrack;
  gboolean debug;

  gfloat track_thresh;
  gfloat high_thresh;
  gfloat match_thresh;
  guint max_alive;
  gint max_batch_size;
  gint num_ctx = 0;
  ByteTrackPluginCtx* bytetrack_ctx[DEFAULT_MAX_BATCH_SIZE];

};

struct _GstNvbytetrackClass
{
  GstBaseTransformClass base_nvbytetrack_class;
};

GType gst_nvbytetrack_get_type (void);

G_END_DECLS

#endif
