/* GStreamer
 * Copyright (C) 2021 FIXME <fixme@example.com>
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

#ifndef _GST_PERIODSRC_H_
#define _GST_PERIODSRC_H_

#include <gst/base/gstbasesrc.h>
#include "utils.h"

G_BEGIN_DECLS

#define DEFAULT_INTERVAL 2

#define GST_TYPE_PERIODSRC   (gst_periodsrc_get_type())
#define GST_PERIODSRC(obj)   (G_TYPE_CHECK_INSTANCE_CAST((obj),GST_TYPE_PERIODSRC,GstPeriodsrc))
#define GST_PERIODSRC_CLASS(klass)   (G_TYPE_CHECK_CLASS_CAST((klass),GST_TYPE_PERIODSRC,GstPeriodsrcClass))
#define GST_IS_PERIODSRC(obj)   (G_TYPE_CHECK_INSTANCE_TYPE((obj),GST_TYPE_PERIODSRC))
#define GST_IS_PERIODSRC_CLASS(obj)   (G_TYPE_CHECK_CLASS_TYPE((klass),GST_TYPE_PERIODSRC))

typedef struct _GstPeriodsrc GstPeriodsrc;
typedef struct _GstPeriodsrcClass GstPeriodsrcClass;

struct _GstPeriodsrc
{
  GstBaseSrc base_periodsrc;
  gint32 interval;
};

struct _GstPeriodsrcClass
{
  GstBaseSrcClass base_periodsrc_class;
};

GType gst_periodsrc_get_type (void);

G_END_DECLS

#endif
