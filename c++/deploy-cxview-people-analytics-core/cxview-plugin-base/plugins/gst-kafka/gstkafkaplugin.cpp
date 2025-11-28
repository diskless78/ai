/* GStreamer
 * Copyright (C) <1999> Erik Walthinsen <omega@cse.ogi.edu>
 * Copyright (C) <2015> Mark J. Howell <m0ppy at hypgnosys dot org>
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

#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

#include "gstkafkasrc.h"
#include "gstkafkasink.h"

GST_DEBUG_CATEGORY (kafka_debug);

static gboolean
plugin_init (GstPlugin * plugin)
{
  if (!gst_element_register (plugin, "kafkasrc", GST_RANK_NONE, GST_TYPE_KAFKASRC))
    return FALSE;

  if (!gst_element_register (plugin, "kafkasink", GST_RANK_NONE,
          GST_TYPE_KAFKASINK))
    return FALSE;

  GST_DEBUG_CATEGORY_INIT (kafka_debug, "kafka", 0, "KAFKA calls");

  return TRUE;
}

#ifndef VERSION
#define VERSION "0.0.1"
#endif
#ifndef PACKAGE
#define PACKAGE "kafka"
#endif
#ifndef PACKAGE_NAME
#define PACKAGE_NAME "gstkafka"
#endif
#ifndef GST_PACKAGE_ORIGIN
#define GST_PACKAGE_ORIGIN "not yet available"
#endif


GST_PLUGIN_DEFINE (GST_VERSION_MAJOR,
    GST_VERSION_MINOR,
    kafka,
    "Transfer msg over kafka",
    plugin_init, VERSION, "LGPL", PACKAGE_NAME, GST_PACKAGE_ORIGIN)
