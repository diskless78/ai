/*
 * Copyright (c) 2018-2020 NVIDIA CORPORATION.  All rights reserved.
 *
 * NVIDIA Corporation and its licensors retain all intellectual property
 * and proprietary rights in and to this software, related documentation
 * and any modifications thereto.  Any use, reproduction, disclosure or
 * distribution of this software and related documentation without an express
 * license agreement from NVIDIA Corporation is strictly prohibited.
 *
 */

#include <gst/gst.h>
#include <gst/base/gstbasesink.h>
#include "gstkafkasink.h"
#include <string>
#include <iostream>

GST_DEBUG_CATEGORY_STATIC (gst_kafkasink_debug_category);
#define GST_CAT_DEFAULT gst_kafkasink_debug_category

static void gst_kafkasink_set_property (GObject * object,
    guint property_id, const GValue * value, GParamSpec * pspec);
static void gst_kafkasink_get_property (GObject * object,
    guint property_id, GValue * value, GParamSpec * pspec);
static void gst_kafkasink_finalize (GObject * object);

static gboolean gst_kafkasink_set_caps (GstBaseSink * sink, GstCaps * caps);
static gboolean gst_kafkasink_start (GstBaseSink * sink);
static gboolean gst_kafkasink_stop (GstBaseSink * sink);
static GstFlowReturn gst_kafkasink_render (GstBaseSink * sink,
    GstBuffer * buffer);

/**********************************************
 * Experimental functions to support libnvds_msgbroker
 */
static void kafkasink_connect_callback (NvMsgBrokerClientHandle h_ptr,
    NvMsgBrokerErrorType status);
static void kafkasink_send_callback (void *data, NvMsgBrokerErrorType status);
static gboolean new_gst_kafkasink_start (GstBaseSink * sink);
static gboolean new_gst_kafkasink_stop (GstBaseSink * sink);
static GstFlowReturn new_gst_kafkasink_render (GstBaseSink * sink, GstBuffer * buf);
/**********************************************
 * Legacy functions to support NvDsMsgApi
 */
static gboolean legacy_gst_kafkasink_start (GstBaseSink * sink);
static gboolean legacy_gst_kafkasink_stop (GstBaseSink * sink);
static GstFlowReturn legacy_gst_kafkasink_render (GstBaseSink * sink, GstBuffer * buf);

static void
nvds_msgapi_connect_callback (NvDsMsgApiHandle h_ptr, NvDsMsgApiEventType ds_evt)
{

}

static void
nvds_msgapi_send_callback (void *data, NvDsMsgApiErrorType status)
{
  GstKafkaSink *self = (GstKafkaSink *) data;

  g_mutex_lock (&self->flowLock);
  self->pendingCbCount--;
  self->lastError = status;

  if (status != NVDS_MSGAPI_OK) {
    GST_ERROR_OBJECT (self, "error(%d) in sending data", status);
  }
  g_mutex_unlock (&self->flowLock);
}

enum
{
  PROP_0,
  PROP_CONNECTION_STRING,
  PROP_CONFIG_FILE,
  PROP_PROTOCOL_LIBRARY,
  PROP_NEW_API
  // PROP_TOPIC,
};

static GstStaticPadTemplate gst_kafkasink_sink_template =
GST_STATIC_PAD_TEMPLATE ("sink",
    GST_PAD_SINK,
    GST_PAD_ALWAYS,
    GST_STATIC_CAPS_ANY);

G_DEFINE_TYPE_WITH_CODE (GstKafkaSink, gst_kafkasink, GST_TYPE_BASE_SINK,
    GST_DEBUG_CATEGORY_INIT (gst_kafkasink_debug_category, "kafkasink", 0,
        "debug category for nvmsgbroker element"));

static gpointer
gst_kafkasink_do_work (gpointer data)
{
  GstKafkaSink *self = (GstKafkaSink *) data;

  while (self->isRunning) {
    g_mutex_lock (&self->flowLock);
    while (self->isRunning && self->pendingCbCount <= 0) {
      g_cond_wait (&self->flowCond, &self->flowLock);
    }
    g_mutex_unlock (&self->flowLock);

    if (!self->isRunning) {
      return NULL;
    }

    self->nvds_msgapi_do_work (self->connHandle);
    // wait 10ms.
    g_usleep (10 * 1000);
  }
  return self;
}

static void
gst_kafkasink_class_init (GstKafkaSinkClass * klass)
{
  GObjectClass *gobject_class = G_OBJECT_CLASS (klass);
  GstBaseSinkClass *base_sink_class = GST_BASE_SINK_CLASS (klass);

  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS (klass),
      &gst_kafkasink_sink_template);

  gst_element_class_set_static_metadata (GST_ELEMENT_CLASS (klass),
      "Message Broker", "Sink/Metadata",
      "Sends payload metadata to remote server",
      "NVIDIA Corporation. Post on Deepstream for Tesla forum for any queries "
      "@ https://devtalk.nvidia.com/default/board/209/");

  gobject_class->set_property = gst_kafkasink_set_property;
  gobject_class->get_property = gst_kafkasink_get_property;
  gobject_class->finalize = gst_kafkasink_finalize;
  // base_sink_class->set_caps = GST_DEBUG_FUNCPTR (gst_kafkasink_set_caps);
  base_sink_class->start = GST_DEBUG_FUNCPTR (gst_kafkasink_start);
  base_sink_class->stop = GST_DEBUG_FUNCPTR (gst_kafkasink_stop);
  base_sink_class->render = GST_DEBUG_FUNCPTR (gst_kafkasink_render);

  g_object_class_install_property (gobject_class, PROP_PROTOCOL_LIBRARY,
      g_param_spec_string ("proto-lib", "Protocol library name",
      "Name of protocol adaptor library with absolute path.",
      NULL, (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

  g_object_class_install_property (gobject_class, PROP_CONNECTION_STRING,
      g_param_spec_string ("conn-str", "connection string",
      "connection string of backend server (e.g. foo.bar.com;80;dsapp1)",
      NULL, (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

  g_object_class_install_property (gobject_class, PROP_CONFIG_FILE,
      g_param_spec_string ("config", "configuration file name",
      "Name of configuration file with absolute path.",
      NULL, (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

  // g_object_class_install_property (gobject_class, PROP_TOPIC,
  //    g_param_spec_string ("topic", "topic name", "Name of the message topic",
  //    NULL, (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

  // g_object_class_install_property (gobject_class, PROP_COMPONENT_ID,
  //     g_param_spec_uint ("comp-id", "Component Id ",
  //     "By default this element operates on all NvDsPayload type meta\n"
  //     "\t\t\tBut it can be restricted to a specific NvDsPayload meta\n"
  //     "\t\t\thaving this component id",
  //     0, G_MAXUINT, 0,
  //     (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

  g_object_class_install_property (gobject_class, PROP_NEW_API,
      g_param_spec_boolean ("new-api", "Use new libnvds_msgbroker API",
      "Use new libnvds_msgbroker API",
        DEFAULT_USE_NEW_API, G_PARAM_READWRITE));
}

static void
gst_kafkasink_init (GstKafkaSink * self)
{
  // self->dsMetaQuark = g_quark_from_static_string (NVDS_META_STRING);
  self->libHandle = NULL;
  self->connHandle = NULL;
  self->connStr = g_strdup(DEFAULT_CONN_STR);
  self->topic = g_strdup(DEFAULT_PRODUCE_TOPIC);
  self->protoLib = g_strdup(DEFAULT_PROTOLIB);
  self->configFile = g_strdup(DEFAULT_CONFIG_FILE);
  self->isRunning = FALSE;
  self->pendingCbCount = 0;
  self->asyncSend = TRUE;
  self->lastError = NVDS_MSGAPI_OK;
  self->newAPI = DEFAULT_USE_NEW_API;
  self->newConnHandle = NULL;
  self->newLastError = NV_MSGBROKER_API_OK;

  g_mutex_init (&self->flowLock);
  g_cond_init (&self->flowCond);
}

void
gst_kafkasink_set_property (GObject * object, guint property_id,
    const GValue * value, GParamSpec * pspec)
{
  GstKafkaSink *self = GST_KAFKASINK (object);

  GST_DEBUG_OBJECT (self, "set_property");

  switch (property_id) {
    case PROP_CONFIG_FILE:
      if (self->configFile)
        g_free (self->configFile);
      self->configFile = (gchar *) g_value_dup_string (value);
      break;
    case PROP_CONNECTION_STRING:
      if (self->connStr)
        g_free (self->connStr);
      self->connStr = (gchar *) g_value_dup_string (value);
      break;
    case PROP_PROTOCOL_LIBRARY:
      if (self->protoLib)
        g_free (self->protoLib);
      self->protoLib = (gchar *) g_value_dup_string (value);
      break;
    // case PROP_TOPIC:
    //   if (self->topic)
    //     g_free (self->topic);
    //   self->topic = (gchar *) g_value_dup_string (value);
    //   g_strstrip (self->topic);
    //   if (!g_strcmp0 (self->topic, "")) {
    //     g_free (self->topic);
    //     self->topic = NULL;
    //   }
      break;
    // case PROP_COMPONENT_ID:
    //   self->compId = g_value_get_uint (value);
    //   break;
    case PROP_NEW_API:
      self->newAPI = g_value_get_boolean (value);
      break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_kafkasink_get_property (GObject * object, guint property_id,
    GValue * value, GParamSpec * pspec)
{
  GstKafkaSink *self = GST_KAFKASINK (object);

  GST_DEBUG_OBJECT (self, "get_property");

  switch (property_id) {
    case PROP_CONFIG_FILE:
      g_value_set_string (value, self->configFile);
      break;
    case PROP_CONNECTION_STRING:
      g_value_set_string (value, self->connStr);
      break;
    case PROP_PROTOCOL_LIBRARY:
      g_value_set_string (value, self->protoLib);
      break;
    // case PROP_TOPIC:
    //   g_value_set_string (value, self->topic);
    //   break;
    // case PROP_COMPONENT_ID:
    //   g_value_set_uint (value, self->compId);
    //   break;
    case PROP_NEW_API:
      g_value_set_boolean (value, self->newAPI);
      break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_kafkasink_finalize (GObject * object)
{
  GstKafkaSink *self = GST_KAFKASINK (object);

  GST_DEBUG_OBJECT (self, "finalize");

  if (self->configFile)
    g_free (self->configFile);

  if (self->connStr)
    g_free (self->connStr);

  if (self->topic)
    g_free (self->topic);
    

  if (self->protoLib)
    g_free (self->protoLib);

  g_mutex_clear(&self->flowLock);
  g_cond_clear(&self->flowCond);

  G_OBJECT_CLASS (gst_kafkasink_parent_class)->finalize (object);
}

// static gboolean
// gst_kafkasink_set_caps (GstBaseSink * sink, GstCaps * caps)
// {
//   GstKafkaSink *nvmsgbroker = GST_KAFKASINK (sink);

//   GST_DEBUG_OBJECT (nvmsgbroker, "set_caps");

//   return TRUE;
// }

static gboolean
gst_kafkasink_start (GstBaseSink * sink)
{
  GstKafkaSink *self = GST_KAFKASINK (sink);
  // setup_logger();

  // set config
  gchar const* connStr = g_getenv("BOOTSTRAP_SERVER");
  if (connStr) self->connStr = g_strdup(connStr);
    else self->connStr = g_strdup(DEFAULT_CONN_STR);
  // spdlog::info("BOOTSTRAP_SERVER={}...", self->connStr);

  gchar const* topic = g_getenv("HEALTHCHECK_TOPIC");
  if (topic) self->topic = g_strdup(topic);
    else self->topic = g_strdup(DEFAULT_PRODUCE_TOPIC);
  // spdlog::info("PRODUCER_TOPIC={}...", self->topic);

  if (self->newAPI)
    return new_gst_kafkasink_start(sink);
  else
    return legacy_gst_kafkasink_start(sink);
}

static gboolean
legacy_gst_kafkasink_start (GstBaseSink * sink)
{
  GstKafkaSink *self = GST_KAFKASINK (sink);
  gchar *error;
  gchar *temp = NULL;

  GST_DEBUG_OBJECT (self, "start");

  if (!self->protoLib) {
    GST_ELEMENT_ERROR (self, RESOURCE, NOT_FOUND, (NULL),
                       ("No protocol adaptor library provided"));
    return FALSE;
  }

  temp = g_strrstr (self->connStr, ";");
  if (temp)
    if(!self->topic)
      self->topic = g_strdup (temp+1);

  self->libHandle = dlopen(self->protoLib, RTLD_LAZY);
  if (!self->libHandle) {
    GST_ELEMENT_ERROR (self, LIBRARY, INIT, (NULL),
                       ("unable to open shared library"));
    return FALSE;
  }

  dlerror();    /* Clear any existing error */

  self->nvds_msgapi_connect = (nvds_msgapi_connect_ptr) dlsym (self->libHandle, "nvds_msgapi_connect");
  self->nvds_msgapi_send = (nvds_msgapi_send_ptr) dlsym (self->libHandle, "nvds_msgapi_send");
  self->nvds_msgapi_disconnect = (nvds_msgapi_disconnect_ptr) dlsym (self->libHandle, "nvds_msgapi_disconnect");
  if (self->asyncSend) {
    self->nvds_msgapi_send_async = (nvds_msgapi_send_async_ptr) dlsym (self->libHandle, "nvds_msgapi_send_async");
    self->nvds_msgapi_do_work = (nvds_msgapi_do_work_ptr) dlsym (self->libHandle, "nvds_msgapi_do_work");
  }

  if ((error = dlerror()) != NULL) {
    GST_ELEMENT_ERROR (self, LIBRARY, FAILED, (NULL),
                       ("%s", error));
    return FALSE;
  }

  self->connHandle = self->nvds_msgapi_connect (self->connStr,
                               (nvds_msgapi_connect_cb_t) kafkasink_connect_callback,
                               self->configFile);
  // std::cout << "protoLib: " << self->protoLib << std::endl;
  // std::cout << "self->connStr: " << self->connStr << std::endl;
  // std::cout << "self->configFile: " << self->configFile << std::endl;

  if (!self->connHandle) {
    if (self->libHandle) {
      dlclose (self->libHandle);
      self->libHandle = NULL;
    }
    GST_ELEMENT_ERROR (self, LIBRARY, SETTINGS, (NULL),
                       ("unable to connect to broker library"));
    return FALSE;
  }

  self->isRunning = TRUE;
  if (self->asyncSend) {
    self->doWorkThread = g_thread_new ("doWork_thread",
                                       gst_kafkasink_do_work, (gpointer) self);
  }

  return TRUE;
}

static gboolean
gst_kafkasink_stop (GstBaseSink * sink)
{
  GstKafkaSink *self = GST_KAFKASINK (sink);

  if (self->newAPI)
    return new_gst_kafkasink_stop(sink);
  else
    return legacy_gst_kafkasink_stop(sink);
}

static gboolean
legacy_gst_kafkasink_stop (GstBaseSink * sink)
{
  GstKafkaSink *self = GST_KAFKASINK (sink);
  NvDsMsgApiErrorType err;

  GST_DEBUG_OBJECT (self, "stop");

  self->isRunning = FALSE;

  if (self->asyncSend) {
    g_cond_signal (&self->flowCond);
    g_thread_join (self->doWorkThread);
  }
  if (self->nvds_msgapi_disconnect) {
    err = self->nvds_msgapi_disconnect (self->connHandle);
    if (err != NVDS_MSGAPI_OK)
      GST_ERROR_OBJECT (self, "error(%d) in disconnect", err);
    self->connHandle = NULL;
  }

  if (self->libHandle) {
    dlclose (self->libHandle);
    self->libHandle = NULL;
  }
  return TRUE;
}

static GstFlowReturn
gst_kafkasink_render (GstBaseSink * sink, GstBuffer * buf)
{
  GstKafkaSink *self = GST_KAFKASINK (sink);

  if (self->newAPI)
    return new_gst_kafkasink_render(sink, buf);
  else
    return legacy_gst_kafkasink_render(sink, buf);
}

static GstFlowReturn
legacy_gst_kafkasink_render (GstBaseSink * sink, GstBuffer * buf)
{
  GstKafkaSink *self = GST_KAFKASINK (sink);
  GstMapInfo in_map_info;
  // NvDsMeta *meta = NULL;
  // NvDsBatchMeta *batch_meta = NULL;
  // GstMeta *gstMeta = NULL;
  // gpointer state = NULL;
  NvDsMsgApiErrorType err;
  // NvDsPayload *payload;
  GST_DEBUG_OBJECT (self, "legacy_render");

  // while ((gstMeta = gst_buffer_iterate_meta (buf, &state))) {
  //   if (gst_meta_api_type_has_tag (gstMeta->info->api, self->dsMetaQuark)) {
  //     meta = (NvDsMeta *) gstMeta;
  //     if (meta->meta_type == NVDS_BATCH_GST_META) {
  //       batch_meta = (NvDsBatchMeta *) meta->meta_data;
  //       break;
  //     }
  //   }
  // }

  // if (batch_meta) 

  if (!gst_buffer_map (buf, &in_map_info, GST_MAP_READ)) {
    return GST_FLOW_ERROR;
  }
  // std::string a((const char*)in_map_info.data, in_map_info.size);

  // std::string a = "asdf";
  if (in_map_info.size<=0) return GST_FLOW_OK;
  // else g_print("-----------> size")
  if (self->asyncSend) {
    g_mutex_lock (&self->flowLock);
    err = self->nvds_msgapi_send_async (self->connHandle, self->topic,
                                        (uint8_t *) in_map_info.data,
                                        in_map_info.size,
                                        nvds_msgapi_send_callback, self);

    if (err != NVDS_MSGAPI_OK) {
      GST_ELEMENT_ERROR (self, LIBRARY, FAILED, (NULL),
                          ("failed to send the message. err(%d)", err));

      g_mutex_unlock (&self->flowLock);
      return GST_FLOW_ERROR;
    }
    self->pendingCbCount++;
    // spdlog::info("self->pendingCbCount: {}", self->pendingCbCount);
    g_cond_signal (&self->flowCond);
    g_mutex_unlock (&self->flowLock);
  } else {
    err = self->nvds_msgapi_send (self->connHandle, self->topic,
                                  (uint8_t *) in_map_info.data,
                                  in_map_info.size);

    if (err != NVDS_MSGAPI_OK) {
      GST_ELEMENT_ERROR (self, LIBRARY, FAILED, (NULL),
                          ("failed to send the message. err(%d)", err));

      return GST_FLOW_ERROR;
    }
  }
  if (in_map_info.data)
    gst_buffer_unmap (buf, &in_map_info);
  return GST_FLOW_OK;
}

// static gboolean
// plugin_init (GstPlugin * plugin)
// {
//   return gst_element_register (plugin, "kafkasink", GST_RANK_PRIMARY,
//       GST_TYPE_KAFKASINK);
// }

/**********************************************
 * Experimental support for libnvds_msgbroker
 */

static void
kafkasink_connect_callback (NvMsgBrokerClientHandle h_ptr, NvMsgBrokerErrorType status)
{

}

static void
kafkasink_send_callback (void *data, NvMsgBrokerErrorType status)
{
  GstKafkaSink *self = (GstKafkaSink *) data;

  self->newLastError = status;

  if (status != NV_MSGBROKER_API_OK) {
    GST_DEBUG_OBJECT (self, "gstmsgbroker send callback: error(%d) in sending data", status);
  }
}

static gboolean
new_gst_kafkasink_start (GstBaseSink * sink)
{
  GstKafkaSink *self = GST_KAFKASINK (sink);

  GST_DEBUG_OBJECT (self, "start");

  if (!self->protoLib) {
    GST_ELEMENT_ERROR (self, RESOURCE, NOT_FOUND, (NULL),
                       ("No protocol adaptor library provided"));
    return FALSE;
  }

  self->newConnHandle = nv_msgbroker_connect (self->connStr, self->protoLib,
                               kafkasink_connect_callback,
                               self->configFile);
  if (!self->newConnHandle) {
    GST_ELEMENT_ERROR (self, LIBRARY, SETTINGS, (NULL),
                       ("unable to connect to nvmsgbroker library"));
    return FALSE;
  }

  return TRUE;
}

static gboolean
new_gst_kafkasink_stop (GstBaseSink * sink)
{
  GstKafkaSink *self = GST_KAFKASINK (sink);
  NvMsgBrokerErrorType err;

  GST_DEBUG_OBJECT (self, "stop");

  err = nv_msgbroker_disconnect (self->newConnHandle);
  if (err != NV_MSGBROKER_API_OK) {
      GST_ERROR_OBJECT (self, "error(%d) in disconnect", err);
      self->newConnHandle = NULL;
  }

  return TRUE;
}

static GstFlowReturn
new_gst_kafkasink_render (GstBaseSink * sink, GstBuffer * buf)
{
  GstKafkaSink *self = GST_KAFKASINK (sink);
  GstMapInfo in_map_info;
  // NvDsMeta *meta = NULL;
  // NvDsBatchMeta *batch_meta = NULL;
  // GstMeta *gstMeta = NULL;
  // gpointer state = NULL;
  NvMsgBrokerErrorType err;
  // NvDsPayload *payload;

  GST_DEBUG_OBJECT (self, "new_render");

  // while ((gstMeta = gst_buffer_iterate_meta (buf, &state))) {
  //   if (gst_meta_api_type_has_tag (gstMeta->info->api, self->dsMetaQuark)) {
  //     meta = (NvDsMeta *) gstMeta;
  //     if (meta->meta_type == NVDS_BATCH_GST_META) {
  //       batch_meta = (NvDsBatchMeta *) meta->meta_data;
  //       break;
  //     }
  //   }
  // }

  // if (batch_meta) {
  if (!gst_buffer_map (buf, &in_map_info, GST_MAP_READ)) {
    return GST_FLOW_ERROR;
  }

  NvMsgBrokerClientMsg msg;
  msg.topic = self->topic;
  msg.payload = (void *) in_map_info.data;
  msg.payload_len = in_map_info.size;
  err = nv_msgbroker_send_async (self->newConnHandle, msg,
                                        kafkasink_send_callback, self);
  if (in_map_info.data)
    gst_buffer_unmap (buf, &in_map_info);

  if (err != NV_MSGBROKER_API_OK) {
    GST_ERROR_OBJECT (self, "gstmsgbroker send callback: error(%d) in sending data", err);
  }
  return GST_FLOW_OK;
}

// #define PACKAGE "kafkasink"

// GST_PLUGIN_DEFINE (GST_VERSION_MAJOR,
//     GST_VERSION_MINOR,
//     kafkasink,
//     "kafkasink",
//     plugin_init, "0.0", "Proprietary", "kafkasink", "http://notavailable.com")
