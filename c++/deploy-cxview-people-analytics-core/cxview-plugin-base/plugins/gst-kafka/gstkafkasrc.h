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

#ifndef _GST_KAFKASRC_H_
#define _GST_KAFKASRC_H_

#include <gst/base/gstbasesrc.h>
#include "gstkafka.h"

G_BEGIN_DECLS

#define GST_TYPE_KAFKASRC   (gst_kafkasrc_get_type())
#define GST_KAFKASRC(obj)   (G_TYPE_CHECK_INSTANCE_CAST((obj),GST_TYPE_KAFKASRC,GstKafkasrc))
#define GST_KAFKASRC_CLASS(klass)   (G_TYPE_CHECK_CLASS_CAST((klass),GST_TYPE_KAFKASRC,GstKafkasrcClass))
#define GST_IS_KAFKASRC(obj)   (G_TYPE_CHECK_INSTANCE_TYPE((obj),GST_TYPE_KAFKASRC))
#define GST_IS_KAFKASRC_CLASS(obj)   (G_TYPE_CHECK_CLASS_TYPE((klass),GST_TYPE_KAFKASRC))

typedef struct _GstKafkasrc GstKafkasrc;
typedef struct _GstKafkasrcClass GstKafkasrcClass;
typedef NvDsMsgApiHandle (*nvds_msgapi_connect_ptr)(const char *connection_str,
    nvds_msgapi_connect_cb_t connect_cb, const char *config_path);
typedef NvDsMsgApiErrorType (*nvds_msgapi_disconnect_ptr)(NvDsMsgApiHandle conn);

typedef NvDsMsgApiErrorType (*msgapi_subscribe_ptr)(NvDsMsgApiHandle conn, char **topics, int num_topics, char * group_id,  nvds_msgapi_subscribe_request_cb_t  cb, void *user_ctx);

struct _GstKafkasrc
{
  GstBaseSrc base_kafkasrc;

  NvMsgBrokerClientHandle connHandle; // -
  gpointer libHandle;                 // -
  gchar *connStr;                     // -
  gchar *topic;                       // -
  gchar *groupId;                       // -
  gchar *protoLib;                    // -
  gchar *configFile;                  // -

  GMutex flowLock;                    // -
  GCond flowCond;                     // -
  GQueue *consume_queue;              // -

  guint consumed_cnt;

  gboolean isRunning;
  // gint pendingCbCount;
  // NvDsMsgApiErrorType lastError;
  nvds_msgapi_connect_ptr nvds_msgapi_connect;
  nvds_msgapi_disconnect_ptr nvds_msgapi_disconnect;
  msgapi_subscribe_ptr msgapi_subscribe;

  // New experimental support via NvMsgBroker lib
  gboolean newAPI;
  // NvMsgBrokerClientHandle newConnHandle;
  // NvMsgBrokerErrorType newLastError;
};

struct _GstKafkasrcClass
{
  GstBaseSrcClass base_kafkasrc_class;
};

GType gst_kafkasrc_get_type (void);

G_END_DECLS

#endif
