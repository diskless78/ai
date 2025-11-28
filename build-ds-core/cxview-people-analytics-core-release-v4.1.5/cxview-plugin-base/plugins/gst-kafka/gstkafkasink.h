/*
 * Copyright (c) 2018-2020, NVIDIA CORPORATION.  All rights reserved.
 *
 * NVIDIA Corporation and its licensors retain all intellectual property
 * and proprietary rights in and to this software, related documentation
 * and any modifications thereto.  Any use, reproduction, disclosure or
 * distribution of this software and related documentation without an express
 * license agreement from NVIDIA Corporation is strictly prohibited.
 *
 */

#ifndef _GST_KAFKASINK_H_
#define _GST_KAFKASINK_H_

#include <gst/base/gstbasesink.h>
#include "gstkafka.h"
#include "utils.h"

G_BEGIN_DECLS

#define GST_TYPE_KAFKASINK   (gst_kafkasink_get_type())
#define GST_KAFKASINK(obj)   (G_TYPE_CHECK_INSTANCE_CAST((obj), GST_TYPE_KAFKASINK,GstKafkaSink))
#define GST_KAFKASINK_CLASS(klass)   (G_TYPE_CHECK_CLASS_CAST((klass),GST_TYPE_KAFKASINK,GstKafkaSinkClass))
#define GST_IS_KAFKASINK(obj)   (G_TYPE_CHECK_INSTANCE_TYPE((obj),GST_TYPE_KAFKASINK))
#define GST_IS_KAFKASINK_CLASS(obj)   (G_TYPE_CHECK_CLASS_TYPE((klass),GST_TYPE_KAFKASINK))

typedef struct _GstKafkaSink GstKafkaSink;
typedef struct _GstKafkaSinkClass GstKafkaSinkClass;

typedef NvDsMsgApiHandle (*nvds_msgapi_connect_ptr)(const char *connection_str,
    nvds_msgapi_connect_cb_t connect_cb, const char *config_path);

typedef NvDsMsgApiErrorType (*nvds_msgapi_send_ptr)(NvDsMsgApiHandle conn, const char *topic,
    const uint8_t *payload, size_t nbuf);

typedef NvDsMsgApiErrorType (*nvds_msgapi_send_async_ptr)(NvDsMsgApiHandle h_ptr,
    char *topic, const uint8_t *payload, size_t nbuf,
    nvds_msgapi_send_cb_t send_callback, void *user_ptr);

typedef void (*nvds_msgapi_do_work_ptr) (NvDsMsgApiHandle h_ptr);

typedef NvDsMsgApiErrorType (*nvds_msgapi_disconnect_ptr)(NvDsMsgApiHandle conn);

struct _GstKafkaSink
{
  GstBaseSink parent;

  // GQuark dsMetaQuark;

  // Classic support via NvDsMsgApi
  gpointer libHandle;
  gchar *configFile;
  gchar *protoLib;
  gchar *connStr;
  gchar *topic;
  NvMsgBrokerClientHandle connHandle;
  /** Identifies from input cap capability if the incoming data
   * is video/audio */
  GMutex flowLock;
  GCond flowCond;
  GThread *doWorkThread;
  gboolean isRunning;
  gboolean asyncSend;
  gint pendingCbCount;
  NvDsMsgApiErrorType lastError;
  nvds_msgapi_connect_ptr nvds_msgapi_connect;
  nvds_msgapi_send_ptr nvds_msgapi_send;
  nvds_msgapi_send_async_ptr nvds_msgapi_send_async;
  nvds_msgapi_do_work_ptr nvds_msgapi_do_work;
  nvds_msgapi_disconnect_ptr nvds_msgapi_disconnect;

  // New experimental support via NvMsgBroker lib
  gboolean newAPI;
  NvMsgBrokerClientHandle newConnHandle;
  NvMsgBrokerErrorType newLastError;
};

struct _GstKafkaSinkClass
{
  GstBaseSinkClass parent_class;
};

GType gst_kafkasink_get_type (void);

G_END_DECLS

#endif
