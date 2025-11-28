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
 * Free Software Foundation, Inc., 51 Franklin Street, Suite 500,
 * Boston, MA 02110-1335, USA.
 */
/**
 * SECTION:element-gstkafkasrc
 *
 * The kafkasrc element does FIXME stuff.
 *
 * <refsect2>
 * <title>Example launch line</title>
 * |[
 * gst-launch-1.0 -v fakesrc ! kafkasrc ! FIXME ! fakesink
 * ]|
 * FIXME Describe what the pipeline does.
 * </refsect2>
 */

#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

#include <gst/gst.h>
#include <gst/base/gstbasesrc.h>

#include "gstkafkasrc.h"
#include <string>

GST_DEBUG_CATEGORY_STATIC (gst_kafkasrc_debug_category);
#define GST_CAT_DEFAULT gst_kafkasrc_debug_category

/* prototypes */

static void gst_kafkasrc_set_property (GObject * object,
    guint property_id, const GValue * value, GParamSpec * pspec);
static void gst_kafkasrc_get_property (GObject * object,
    guint property_id, GValue * value, GParamSpec * pspec);
// static void gst_kafkasrc_dispose (GObject * object);
static void gst_kafkasrc_finalize (GObject * object);

// static GstCaps *gst_kafkasrc_get_caps (GstBaseSrc * src, GstCaps * filter);
// static gboolean gst_kafkasrc_negotiate (GstBaseSrc * src);
// static GstCaps *gst_kafkasrc_fixate (GstBaseSrc * src, GstCaps * caps);
// static gboolean gst_kafkasrc_set_caps (GstBaseSrc * src, GstCaps * caps);
// static gboolean gst_kafkasrc_decide_allocation (GstBaseSrc * src,
//     GstQuery * query);
static gboolean gst_kafkasrc_start (GstBaseSrc * src);
static gboolean gst_kafkasrc_stop (GstBaseSrc * src);
// static void gst_kafkasrc_get_times (GstBaseSrc * src, GstBuffer * buffer,
//     GstClockTime * start, GstClockTime * end);
// static gboolean gst_kafkasrc_get_size (GstBaseSrc * src, guint64 * size);
// static gboolean gst_kafkasrc_is_seekable (GstBaseSrc * src);
// static gboolean gst_kafkasrc_prepare_seek_segment (GstBaseSrc * src,
//     GstEvent * seek, GstSegment * segment);
// static gboolean gst_kafkasrc_do_seek (GstBaseSrc * src, GstSegment * segment);
// static gboolean gst_kafkasrc_unlock (GstBaseSrc * src);
// static gboolean gst_kafkasrc_unlock_stop (GstBaseSrc * src);
// static gboolean gst_kafkasrc_query (GstBaseSrc * src, GstQuery * query);
// static gboolean gst_kafkasrc_event (GstBaseSrc * src, GstEvent * event);
static GstFlowReturn gst_kafkasrc_create (GstBaseSrc * src, guint64 offset,
    guint size, GstBuffer ** buf);
// static GstFlowReturn gst_kafkasrc_alloc (GstBaseSrc * src, guint64 offset,
//     guint size, GstBuffer ** buf);
// static GstFlowReturn gst_kafkasrc_fill (GstBaseSrc * src, guint64 offset,
//     guint size, GstBuffer * buf);


/**********************************************
 * Experimental functions to support libnvds_msgbroker
 */
static void nvmsgbroker_connect_callback (NvMsgBrokerClientHandle h_ptr,
  NvMsgBrokerErrorType status);
static void nvmsgbroker_subscribe_callback (NvMsgBrokerErrorType status, void *msg, int msglen, char *topic, void *data);

static gboolean new_kafkasrc_start (GstBaseSrc * src);
static gboolean new_kafkasrc_stop (GstBaseSrc * src);
/**********************************************
 * Legacy functions to support NvDsMsgApi
 */
static gboolean legacy_kafkasrc_start (GstBaseSrc * src);
static gboolean legacy_kafkasrc_stop (GstBaseSrc * src);

enum
{
  PROP_0,
  // PROP_CONNSTR,
  // PROP_TOPIC,
  PROP_PROTOLIB,
  PROP_CONFIGFILE,
  PROP_NEWAPI
};

/* pad templates */

static GstStaticPadTemplate gst_kafkasrc_src_template =
GST_STATIC_PAD_TEMPLATE ("src",
    GST_PAD_SRC,
    GST_PAD_ALWAYS,
    GST_STATIC_CAPS_ANY
    );


/* class initialization */

G_DEFINE_TYPE_WITH_CODE (GstKafkasrc, gst_kafkasrc, GST_TYPE_BASE_SRC,
  GST_DEBUG_CATEGORY_INIT (gst_kafkasrc_debug_category, "kafkasrc", 0,
  "debug category for kafkasrc element"));

static void
gst_kafkasrc_class_init (GstKafkasrcClass * klass)
{
  GObjectClass *gobject_class = G_OBJECT_CLASS (klass);
  GstBaseSrcClass *base_src_class = GST_BASE_SRC_CLASS (klass);

  /* Setting up pads and setting metadata should be moved to
     base_class_init if you intend to subclass this class. */
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_kafkasrc_src_template);

  gst_element_class_set_static_metadata (GST_ELEMENT_CLASS(klass),
      "FIXME Long name", "Generic", "FIXME Description",
      "FIXME <fixme@example.com>");

  gobject_class->set_property = gst_kafkasrc_set_property;
  gobject_class->get_property = gst_kafkasrc_get_property;
  // gobject_class->dispose = gst_kafkasrc_dispose;
  gobject_class->finalize = gst_kafkasrc_finalize;




  // base_src_class->get_caps = GST_DEBUG_FUNCPTR (gst_kafkasrc_get_caps);
  // base_src_class->negotiate = GST_DEBUG_FUNCPTR (gst_kafkasrc_negotiate);
  // base_src_class->fixate = GST_DEBUG_FUNCPTR (gst_kafkasrc_fixate);
  // base_src_class->set_caps = GST_DEBUG_FUNCPTR (gst_kafkasrc_set_caps);
  // base_src_class->decide_allocation = GST_DEBUG_FUNCPTR (gst_kafkasrc_decide_allocation);
  base_src_class->start = GST_DEBUG_FUNCPTR (gst_kafkasrc_start);
  base_src_class->stop = GST_DEBUG_FUNCPTR (gst_kafkasrc_stop);
  // base_src_class->get_times = GST_DEBUG_FUNCPTR (gst_kafkasrc_get_times);
  // base_src_class->get_size = GST_DEBUG_FUNCPTR (gst_kafkasrc_get_size);
  // base_src_class->is_seekable = GST_DEBUG_FUNCPTR (gst_kafkasrc_is_seekable);
  // base_src_class->prepare_seek_segment = GST_DEBUG_FUNCPTR (gst_kafkasrc_prepare_seek_segment);
  // base_src_class->do_seek = GST_DEBUG_FUNCPTR (gst_kafkasrc_do_seek);
  // base_src_class->unlock = GST_DEBUG_FUNCPTR (gst_kafkasrc_unlock);
  // base_src_class->unlock_stop = GST_DEBUG_FUNCPTR (gst_kafkasrc_unlock_stop);
  // base_src_class->query = GST_DEBUG_FUNCPTR (gst_kafkasrc_query);
  // base_src_class->event = GST_DEBUG_FUNCPTR (gst_kafkasrc_event);
  base_src_class->create = GST_DEBUG_FUNCPTR (gst_kafkasrc_create);
  // base_src_class->alloc = GST_DEBUG_FUNCPTR (gst_kafkasrc_alloc);
  // base_src_class->fill = GST_DEBUG_FUNCPTR (gst_kafkasrc_fill);

  g_object_class_install_property (gobject_class, PROP_PROTOLIB,
      g_param_spec_string ("proto-lib", "Protocol library name",
      "Name of protocol adaptor library with absolute path.",
      DEFAULT_PROTOLIB, (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

  g_object_class_install_property (gobject_class, PROP_CONFIGFILE,
      g_param_spec_string ("config", "configuration file name",
      "Name of configuration file with absolute path.",
      DEFAULT_CONFIG_FILE, (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

  // g_object_class_install_property (gobject_class, PROP_CONNSTR,
  //     g_param_spec_string ("conn-str", "connection string",
  //     "connection string of backend server (e.g. foo.bar.com;80;dsapp1)",
  //     DEFAULT_CONN_STR, (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));
  
  // g_object_class_install_property (gobject_class, PROP_TOPIC,
  //    g_param_spec_string ("topic", "topic name", "Name of the message topic",
  //    DEFAULT_CONSUME_TOPIC, (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

  g_object_class_install_property (gobject_class, PROP_NEWAPI,
      g_param_spec_boolean ("new-api", "Use new libnvds_msgbroker API",
      "Use new libnvds_msgbroker API",
        DEFAULT_USE_NEW_API, G_PARAM_READWRITE));
}

static void
gst_kafkasrc_init (GstKafkasrc *self)
{
  self->connHandle = NULL;
  self->libHandle = NULL;
  self->connStr = g_strdup(DEFAULT_CONN_STR);
  self->topic = g_strdup(DEFAULT_CONSUME_TOPIC);
  self->groupId  = g_strdup(DEFAULT_CONSUMER_GROUP);
  self->protoLib = g_strdup(DEFAULT_PROTOLIB);
  self->configFile = g_strdup(DEFAULT_CONFIG_FILE);
  self->newAPI = DEFAULT_USE_NEW_API;
  self->consumed_cnt = 0;

  g_mutex_init (&self->flowLock);
  g_cond_init (&self->flowCond);
}

void
gst_kafkasrc_set_property (GObject * object, guint property_id,
    const GValue * value, GParamSpec * pspec)
{
  GstKafkasrc *self = GST_KAFKASRC (object);

  GST_DEBUG_OBJECT (self, "set_property");

  switch (property_id) {
    // case PROP_CONNSTR:
    //   if (self->connStr!=NULL){
    //     g_free (self->connStr);
    //   }
    //   self->connStr = g_strdup (g_value_get_string (value));
    //   break;
    // case PROP_TOPIC:
    //   if (self->topic!=NULL){
    //     g_free (self->topic);
    //   }
    //   self->topic = g_strdup (g_value_get_string (value));
    //   break;
    case PROP_PROTOLIB:
      if (self->protoLib!=NULL){
        g_free (self->protoLib);
      }
      self->protoLib = g_strdup (g_value_get_string (value));
      break;
    case PROP_CONFIGFILE:
      if (self->configFile!=NULL){
        g_free (self->configFile);
      }
      self->configFile = g_strdup (g_value_get_string (value));
      break;
    case PROP_NEWAPI:
      self->newAPI = g_value_get_boolean (value);
      break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_kafkasrc_get_property (GObject * object, guint property_id,
    GValue * value, GParamSpec * pspec)
{
  GstKafkasrc *self = GST_KAFKASRC (object);

  GST_DEBUG_OBJECT (self, "get_property");

  switch (property_id) {
    // case PROP_CONNSTR:
    //   g_value_set_string (value, self->connStr);
    //   break;
    // case PROP_TOPIC:
    //   g_value_set_string (value, self->topic);
    //   break;
    case PROP_PROTOLIB:
      g_value_set_string (value, self->protoLib);
      break;
    case PROP_CONFIGFILE:
      g_value_set_string (value, self->configFile);
      break;
    case PROP_NEWAPI:
      g_value_set_boolean (value, self->newAPI);
      break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_kafkasrc_finalize (GObject * object)
{
  GstKafkasrc *self = GST_KAFKASRC (object);

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

  /* clean up object here */

  G_OBJECT_CLASS (gst_kafkasrc_parent_class)->finalize (object);
}

/* get caps from subclass */
static GstCaps *
gst_kafkasrc_get_caps (GstBaseSrc * src, GstCaps * filter)
{
  GstKafkasrc *self = GST_KAFKASRC (src);

  GST_DEBUG_OBJECT (self, "get_caps");

  return NULL;
}

/* decide on caps */
static gboolean
gst_kafkasrc_negotiate (GstBaseSrc * src)
{
  GstKafkasrc *self = GST_KAFKASRC (src);

  GST_DEBUG_OBJECT (self, "negotiate");

  return TRUE;
}

/* called if, in negotiation, caps need fixating */
static GstCaps *
gst_kafkasrc_fixate (GstBaseSrc * src, GstCaps * caps)
{
  GstKafkasrc *self = GST_KAFKASRC (src);

  GST_DEBUG_OBJECT (self, "fixate");

  return NULL;
}

/* notify the subclass of new caps */
static gboolean
gst_kafkasrc_set_caps (GstBaseSrc * src, GstCaps * caps)
{
  GstKafkasrc *self = GST_KAFKASRC (src);

  GST_DEBUG_OBJECT (self, "set_caps");

  return TRUE;
}

/* setup allocation query */
static gboolean
gst_kafkasrc_decide_allocation (GstBaseSrc * src, GstQuery * query)
{
  GstKafkasrc *self = GST_KAFKASRC (src);

  GST_DEBUG_OBJECT (self, "decide_allocation");

  return TRUE;
}

/**********************************************
 * Experimental support for libnvds_msgbroker
 */

static void
nvmsgbroker_connect_callback (NvMsgBrokerClientHandle h_ptr, NvMsgBrokerErrorType status) {

}

static void nvmsgbroker_subscribe_callback (NvMsgBrokerErrorType status, void *msg, int msglen, char *topic, void *data) {
  GstKafkasrc *self = GST_KAFKASRC (data);
  if(status == (NvMsgBrokerErrorType) NVDS_MSGAPI_ERR) {
    spdlog::error("Error in consuming message from kafka broker");
  }

  g_mutex_lock (&self->flowLock);
  // auto len = g_queue_get_length(self->consume_queue);
  // if (self->consumed_cnt % 200 == 0) {
  //   g_print("len after wait=%d\n", len);
  //   g_print("msglen = %d\n", msglen);
  // }

  std::string *msg_p = new std::string((char*) msg, msglen);
  g_queue_push_tail (self->consume_queue, msg_p);
  g_cond_broadcast (&self->flowCond);
  g_mutex_unlock (&self->flowLock);
  self->consumed_cnt += 1;
}

static gboolean
new_kafkasrc_start (GstBaseSrc * src)
{
  GstKafkasrc *self = GST_KAFKASRC (src);
  NvMsgBrokerErrorType err;

  GST_DEBUG_OBJECT (self, "start");

  self->consume_queue = g_queue_new ();

  if (!self->protoLib) {
    GST_ELEMENT_ERROR (self, RESOURCE, NOT_FOUND, (NULL),
                       ("No protocol adaptor library provided"));
    return FALSE;
  }
  self->connHandle = nv_msgbroker_connect (self->connStr, self->protoLib,
                               (nv_msgbroker_connect_cb_t) nvmsgbroker_connect_callback,
                               self->configFile);
  if (!self->connHandle) {
    GST_ELEMENT_ERROR (self, LIBRARY, SETTINGS, (NULL),
                       ("unable to connect to nvmsgbroker library"));
    return FALSE;
  }

  const char *topics[] = {self->topic};
  int num_topics=1;
  err = nv_msgbroker_subscribe(self->connHandle, (char**)topics, num_topics,
    nvmsgbroker_subscribe_callback, self);

  if (err != NV_MSGBROKER_API_OK) {
    GST_ERROR_OBJECT (self, "gstmsgbroker send callback: error(%d) in sending data", err);
  } else spdlog::debug("msgbroker subcribed..");

  return TRUE;
}

static gboolean
legacy_kafkasrc_start (GstBaseSrc * src)
{
  GstKafkasrc *self = GST_KAFKASRC (src);
  gchar *error;
  gchar *temp = NULL;

  GST_DEBUG_OBJECT (self, "start");

  self->consume_queue = g_queue_new ();

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

  // *(void **) (&msgapi_subscribe_ptr) = dlsym(self->libHandle, "nvds_msgapi_subscribe");

  dlerror();    /* Clear any existing error */

  self->nvds_msgapi_connect = (nvds_msgapi_connect_ptr) dlsym (self->libHandle, "nvds_msgapi_connect");
  self->nvds_msgapi_disconnect = (nvds_msgapi_disconnect_ptr) dlsym (self->libHandle, "nvds_msgapi_disconnect");
  self->msgapi_subscribe = (msgapi_subscribe_ptr) dlsym (self->libHandle, "nvds_msgapi_subscribe");

  if ((error = dlerror()) != NULL) {
    GST_ELEMENT_ERROR (self, LIBRARY, FAILED, (NULL),
                       ("%s", error));
    return FALSE;
  }

  self->connHandle = self->nvds_msgapi_connect (self->connStr,
                               (nvds_msgapi_connect_cb_t)nvmsgbroker_connect_callback,
                               self->configFile);
  if (!self->connHandle) {
    if (self->libHandle) {
      dlclose (self->libHandle);
      self->libHandle = NULL;
    }
    GST_ELEMENT_ERROR (self, LIBRARY, SETTINGS, (NULL),
                       ("unable to connect to broker library"));
    return FALSE;
  }

  const char *topics[] = {self->topic};
  int num_topics=1;
  if(self->msgapi_subscribe(self->connHandle, (char **)topics, num_topics, (char *)self->groupId, (nvds_msgapi_subscribe_request_cb_t)nvmsgbroker_subscribe_callback, self) != NVDS_MSGAPI_OK) {
    spdlog::error("Kafka subscription to topic[s] failed. Exiting...");
    exit(-1);
  }

  self->isRunning = TRUE;
  // if (self->asyncSend) {
  //   self->doWorkThread = g_thread_new ("doWork_thread",
  //                                      gst_nvmsgbroker_do_work, (gpointer) self);
  // }

  spdlog::debug("legacy started");

  return TRUE;
}

/* start and stop processing, ideal for opening/closing the resource */
static gboolean
gst_kafkasrc_start (GstBaseSrc * src)
{
  GstKafkasrc *self = GST_KAFKASRC (src);
  setup_logger();

  // set config
  gchar const* connStr = g_getenv("BOOTSTRAP_SERVER");
  if (connStr) self->connStr = g_strdup(connStr);
    else self->connStr = g_strdup(DEFAULT_CONN_STR);
  spdlog::info("BOOTSTRAP_SERVER={}...", self->connStr);
  
  gchar const* topic = g_getenv("CONSUMER_TOPIC");
  if (topic) self->topic = g_strdup(topic);
    else self->topic = g_strdup(DEFAULT_CONSUME_TOPIC);
  spdlog::info("INFO: CONSUMER_TOPIC={}...", self->topic);

  gchar const* groupId = g_getenv("CONSUME_GROUP_ID");
  if (topic) self->groupId = g_strdup(groupId);
    else self->groupId = g_strdup(DEFAULT_CONSUMER_GROUP);
  spdlog::info("INFO: CONSUME_GROUP_ID={}...", self->groupId);

  if (self->newAPI)
    return new_kafkasrc_start(src);
  else
    return legacy_kafkasrc_start(src);
}

static gboolean
new_kafkasrc_stop (GstBaseSrc * src)
{
  GstKafkasrc *self = GST_KAFKASRC (src);
  NvMsgBrokerErrorType err;
  gpointer data;

  GST_DEBUG_OBJECT (self, "stop");
  spdlog::debug("kafka src stop 0");
  err = nv_msgbroker_disconnect (self->connHandle);
  if (err != NV_MSGBROKER_API_OK) {
    GST_ERROR_OBJECT (self, "error(%d) in disconnect", err);
    self->connHandle = NULL;
  }
  spdlog::debug("kafka src stop 1");
  g_mutex_lock (&self ->flowLock);
  /* Wait till all the items in the queue are handled. */
  while (!g_queue_is_empty (self->consume_queue)) {
    data = g_queue_pop_head (self->consume_queue);
    g_free(data);
  }
  spdlog::debug("kafka src stop 2");
  g_cond_broadcast (&self ->flowCond);
  g_mutex_unlock (&self ->flowLock);
  spdlog::debug("kafka src stop 3");
  g_queue_free (self->consume_queue);
  spdlog::debug("kafka src stop 4");
  return TRUE;
}

static gboolean
legacy_kafkasrc_stop (GstBaseSrc * src)
{
  GstKafkasrc *self = GST_KAFKASRC (src);
  NvDsMsgApiErrorType err;

  GST_DEBUG_OBJECT (self, "stop");
  // gpointer data;

  self->isRunning = FALSE;

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

  spdlog::debug("kafka src stop 1");
  g_mutex_lock (&self ->flowLock);
  /* Wait till all the items in the queue are handled. */
  
  while (!g_queue_is_empty (self->consume_queue)) {
    g_queue_pop_head (self->consume_queue);
    // if (data) g_free(data);
  }
  spdlog::debug("kafka src stop 2");
  g_cond_broadcast (&self ->flowCond);
  g_mutex_unlock (&self ->flowLock);
  spdlog::debug("kafka src stop 3");
  g_queue_free (self->consume_queue);
  spdlog::debug("kafka src stop 4");
  return TRUE;
}

static gboolean
gst_kafkasrc_stop (GstBaseSrc * src)
{
  GstKafkasrc *self = GST_KAFKASRC (src);

  if (self->newAPI)
    return new_kafkasrc_stop(src);
  else
    return legacy_kafkasrc_stop(src);
}

/* ask the subclass to create a buffer with offset and size, the default
 * implementation will call alloc and fill. */
static GstFlowReturn
gst_kafkasrc_create (GstBaseSrc * src, guint64 offset, guint size,
    GstBuffer ** buf)
{
  GstKafkasrc *self = GST_KAFKASRC (src);
  GstMapInfo map;
  std::string* data = nullptr;
  size_t msg_size = 0;

  GST_DEBUG_OBJECT (self, "create");

  g_mutex_lock (&self ->flowLock);
  if (!g_queue_is_empty (self->consume_queue)) {
    data = (std::string*) g_queue_pop_head (self->consume_queue);
    msg_size = data->size();
  } else {
    gint64 end_time = g_get_monotonic_time () + 5 * G_TIME_SPAN_SECOND;
    g_cond_wait_until (&self->flowCond, &self->flowLock, end_time);
  }
  g_mutex_unlock (&self ->flowLock);


  *buf = gst_buffer_new_and_alloc (msg_size);
  gst_buffer_map (*buf, &map, GST_MAP_READWRITE);
  if (msg_size) {
    // g_print("msg: %s", data->c_str());
    memcpy (map.data, data->c_str(), msg_size);
    delete data;
  }
  gst_buffer_unmap (*buf, &map);

  return GST_FLOW_OK;
}

// static gboolean
// plugin_init (GstPlugin * plugin)
// {

//   /* FIXME Remember to set the rank if it's an element that is meant
//      to be autoplugged by decodebin. */
//   return gst_element_register (plugin, "kafkasrc", GST_RANK_NONE,
//       GST_TYPE_KAFKASRC);
// }

/* FIXME: these are normally defined by the GStreamer build system.
   If you are creating an element to be included in gst-plugins-*,
   remove these, as they're always defined.  Otherwise, edit as
   appropriate for your external plugin package. */
// #ifndef VERSION
// #define VERSION "0.0.FIXME"
// #endif
// #ifndef PACKAGE
// #define PACKAGE "FIXME_package"
// #endif
// #ifndef PACKAGE_NAME
// #define PACKAGE_NAME "FIXME_package_name"
// #endif
// #ifndef GST_PACKAGE_ORIGIN
// #define GST_PACKAGE_ORIGIN "http://FIXME.org/"
// #endif

// GST_PLUGIN_DEFINE (GST_VERSION_MAJOR,
//     GST_VERSION_MINOR,
//     kafkasrc,
//     "FIXME plugin description",
//     plugin_init, VERSION, "LGPL", PACKAGE_NAME, GST_PACKAGE_ORIGIN)

