#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

#include <gst/gst.h>
#include <gst/base/gstbasesrc.h>

#include "gstperiodsrc.h"
#include <string>

GST_DEBUG_CATEGORY_STATIC (gst_periodsrc_debug_category);
#define GST_CAT_DEFAULT gst_periodsrc_debug_category

/* prototypes */

static void gst_periodsrc_set_property (GObject * object,
    guint property_id, const GValue * value, GParamSpec * pspec);
static void gst_periodsrc_get_property (GObject * object,
    guint property_id, GValue * value, GParamSpec * pspec);
// static void gst_periodsrc_dispose (GObject * object);
static void gst_periodsrc_finalize (GObject * object);

// static GstCaps *gst_periodsrc_get_caps (GstBaseSrc * src, GstCaps * filter);
// static gboolean gst_periodsrc_negotiate (GstBaseSrc * src);
// static GstCaps *gst_periodsrc_fixate (GstBaseSrc * src, GstCaps * caps);
// static gboolean gst_periodsrc_set_caps (GstBaseSrc * src, GstCaps * caps);
// static gboolean gst_periodsrc_decide_allocation (GstBaseSrc * src,
//     GstQuery * query);
static gboolean gst_periodsrc_start (GstBaseSrc * src);
static gboolean gst_periodsrc_stop (GstBaseSrc * src);
// static void gst_periodsrc_get_times (GstBaseSrc * src, GstBuffer * buffer,
//     GstClockTime * start, GstClockTime * end);
// static gboolean gst_periodsrc_get_size (GstBaseSrc * src, guint64 * size);
// static gboolean gst_periodsrc_is_seekable (GstBaseSrc * src);
// static gboolean gst_periodsrc_prepare_seek_segment (GstBaseSrc * src,
//     GstEvent * seek, GstSegment * segment);
// static gboolean gst_periodsrc_do_seek (GstBaseSrc * src, GstSegment * segment);
// static gboolean gst_periodsrc_unlock (GstBaseSrc * src);
// static gboolean gst_periodsrc_unlock_stop (GstBaseSrc * src);
// static gboolean gst_periodsrc_query (GstBaseSrc * src, GstQuery * query);
// static gboolean gst_periodsrc_event (GstBaseSrc * src, GstEvent * event);
static GstFlowReturn gst_periodsrc_create (GstBaseSrc * src, guint64 offset,
    guint size, GstBuffer ** buf);
// static GstFlowReturn gst_periodsrc_alloc (GstBaseSrc * src, guint64 offset,
//     guint size, GstBuffer ** buf);
// static GstFlowReturn gst_periodsrc_fill (GstBaseSrc * src, guint64 offset,
//     guint size, GstBuffer * buf);


/**********************************************
 * Experimental functions to support libnvds_msgbroker
 */
// static void nvmsgbroker_connect_callback (NvMsgBrokerClientHandle h_ptr,
//   NvMsgBrokerErrorType status);
// static void nvmsgbroker_subscribe_callback (NvMsgBrokerErrorType status, void *msg, int msglen, char *topic, void *data);

// static gboolean new_periodsrc_start (GstBaseSrc * src);
// static gboolean new_periodsrc_stop (GstBaseSrc * src);
// /**********************************************
//  * Legacy functions to support NvDsMsgApi
//  */
// static gboolean legacy_periodsrc_start (GstBaseSrc * src);
// static gboolean legacy_periodsrc_stop (GstBaseSrc * src);

enum
{
  PROP_0,
  PROP_INTERVAL,
  // PROP_CONFIGFILE,
  // PROP_NEWAPI
};

/* pad templates */

static GstStaticPadTemplate gst_periodsrc_src_template =
GST_STATIC_PAD_TEMPLATE ("src",
    GST_PAD_SRC,
    GST_PAD_ALWAYS,
    GST_STATIC_CAPS_ANY
    );


/* class initialization */

G_DEFINE_TYPE_WITH_CODE (GstPeriodsrc, gst_periodsrc, GST_TYPE_BASE_SRC,
  GST_DEBUG_CATEGORY_INIT (gst_periodsrc_debug_category, "periodsrc", 0,
  "debug category for periodsrc element"));

static void
gst_periodsrc_class_init (GstPeriodsrcClass * klass)
{
  GObjectClass *gobject_class = G_OBJECT_CLASS (klass);
  GstBaseSrcClass *base_src_class = GST_BASE_SRC_CLASS (klass);

  /* Setting up pads and setting metadata should be moved to
     base_class_init if you intend to subclass this class. */
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_periodsrc_src_template);

  gst_element_class_set_static_metadata (GST_ELEMENT_CLASS(klass),
      "FIXME Long name", "Generic", "FIXME Description",
      "FIXME <fixme@example.com>");

  gobject_class->set_property = gst_periodsrc_set_property;
  gobject_class->get_property = gst_periodsrc_get_property;
  // gobject_class->dispose = gst_periodsrc_dispose;
  gobject_class->finalize = gst_periodsrc_finalize;




  // base_src_class->get_caps = GST_DEBUG_FUNCPTR (gst_periodsrc_get_caps);
  // base_src_class->negotiate = GST_DEBUG_FUNCPTR (gst_periodsrc_negotiate);
  // base_src_class->fixate = GST_DEBUG_FUNCPTR (gst_periodsrc_fixate);
  // base_src_class->set_caps = GST_DEBUG_FUNCPTR (gst_periodsrc_set_caps);
  // base_src_class->decide_allocation = GST_DEBUG_FUNCPTR (gst_periodsrc_decide_allocation);
  base_src_class->start = GST_DEBUG_FUNCPTR (gst_periodsrc_start);
  base_src_class->stop = GST_DEBUG_FUNCPTR (gst_periodsrc_stop);
  // base_src_class->get_times = GST_DEBUG_FUNCPTR (gst_periodsrc_get_times);
  // base_src_class->get_size = GST_DEBUG_FUNCPTR (gst_periodsrc_get_size);
  // base_src_class->is_seekable = GST_DEBUG_FUNCPTR (gst_periodsrc_is_seekable);
  // base_src_class->prepare_seek_segment = GST_DEBUG_FUNCPTR (gst_periodsrc_prepare_seek_segment);
  // base_src_class->do_seek = GST_DEBUG_FUNCPTR (gst_periodsrc_do_seek);
  // base_src_class->unlock = GST_DEBUG_FUNCPTR (gst_periodsrc_unlock);
  // base_src_class->unlock_stop = GST_DEBUG_FUNCPTR (gst_periodsrc_unlock_stop);
  // base_src_class->query = GST_DEBUG_FUNCPTR (gst_periodsrc_query);
  // base_src_class->event = GST_DEBUG_FUNCPTR (gst_periodsrc_event);
  base_src_class->create = GST_DEBUG_FUNCPTR (gst_periodsrc_create);
  // base_src_class->alloc = GST_DEBUG_FUNCPTR (gst_periodsrc_alloc);
  // base_src_class->fill = GST_DEBUG_FUNCPTR (gst_periodsrc_fill);

  // g_object_class_install_property (gobject_class, PROP_PROTOLIB,
  //     g_param_spec_string ("proto-lib", "Protocol library name",
  //     "Name of protocol adaptor library with absolute path.",
  //     DEFAULT_PROTOLIB, (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

  // g_object_class_install_property (gobject_class, PROP_CONFIGFILE,
  //     g_param_spec_string ("config", "configuration file name",
  //     "Name of configuration file with absolute path.",
  //     DEFAULT_CONFIG_FILE, (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

  g_object_class_install_property (gobject_class, PROP_INTERVAL,
      g_param_spec_uint ("interval", "Interval",
      "Interval between fake msg in second, default = 2",
      0, G_MAXUINT, DEFAULT_INTERVAL,
      (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));
}

static void
gst_periodsrc_init (GstPeriodsrc *self)
{
  self->interval = DEFAULT_INTERVAL;
  // self->connHandle = NULL;
  // self->libHandle = NULL;
  // self->connStr = g_strdup(DEFAULT_CONN_STR);
  // self->topic = g_strdup(DEFAULT_CONSUME_TOPIC);
  // self->protoLib = g_strdup(DEFAULT_PROTOLIB);
  // self->configFile = g_strdup(DEFAULT_CONFIG_FILE);
  // self->newAPI = DEFAULT_USE_NEW_API;
  // self->consumed_cnt = 0;

  // g_mutex_init (&self->flowLock);
  // g_cond_init (&self->flowCond);
}

void
gst_periodsrc_set_property (GObject * object, guint property_id,
    const GValue * value, GParamSpec * pspec)
{
  GstPeriodsrc *self = GST_PERIODSRC (object);

  GST_DEBUG_OBJECT (self, "set_property");

  switch (property_id) {
    case PROP_INTERVAL:
      self->interval = g_value_get_uint(value);
      break;
    // case PROP_CONFIGFILE:
    //   if (self->configFile!=NULL){
    //     g_free (self->configFile);
    //   }
    //   self->configFile = g_strdup (g_value_get_string (value));
    //   break;
    // case PROP_NEWAPI:
    //   self->newAPI = g_value_get_boolean (value);
    //   break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_periodsrc_get_property (GObject * object, guint property_id,
    GValue * value, GParamSpec * pspec)
{
  GstPeriodsrc *self = GST_PERIODSRC (object);

  GST_DEBUG_OBJECT (self, "get_property");

  switch (property_id) {
    case PROP_INTERVAL:
      g_value_set_uint (value, self->interval);
      // self->interval = = g_value_get_uint (value);
      break;
    // case PROP_CONFIGFILE:
    //   g_value_set_string (value, self->configFile);
    //   break;
    // case PROP_NEWAPI:
    //   g_value_set_boolean (value, self->newAPI);
    //   break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_periodsrc_finalize (GObject * object)
{
  GstPeriodsrc *self = GST_PERIODSRC (object);

  GST_DEBUG_OBJECT (self, "finalize");

  // if (self->configFile)
  //   g_free (self->configFile);

  // if (self->connStr)
  //   g_free (self->connStr);

  // if (self->topic)
  //   g_free (self->topic);

  // if (self->protoLib)
  //   g_free (self->protoLib);
  
  // g_mutex_clear(&self->flowLock);
  // g_cond_clear(&self->flowCond);

  /* clean up object here */

  G_OBJECT_CLASS (gst_periodsrc_parent_class)->finalize (object);
}

/* get caps from subclass */
static GstCaps *
gst_periodsrc_get_caps (GstBaseSrc * src, GstCaps * filter)
{
  GstPeriodsrc *self = GST_PERIODSRC (src);

  GST_DEBUG_OBJECT (self, "get_caps");

  return NULL;
}

/* decide on caps */
static gboolean
gst_periodsrc_negotiate (GstBaseSrc * src)
{
  GstPeriodsrc *self = GST_PERIODSRC (src);

  GST_DEBUG_OBJECT (self, "negotiate");

  return TRUE;
}

/* called if, in negotiation, caps need fixating */
static GstCaps *
gst_periodsrc_fixate (GstBaseSrc * src, GstCaps * caps)
{
  GstPeriodsrc *self = GST_PERIODSRC (src);

  GST_DEBUG_OBJECT (self, "fixate");

  return NULL;
}

/* notify the subclass of new caps */
static gboolean
gst_periodsrc_set_caps (GstBaseSrc * src, GstCaps * caps)
{
  GstPeriodsrc *self = GST_PERIODSRC (src);

  GST_DEBUG_OBJECT (self, "set_caps");

  return TRUE;
}

/* setup allocation query */
static gboolean
gst_periodsrc_decide_allocation (GstBaseSrc * src, GstQuery * query)
{
  GstPeriodsrc *self = GST_PERIODSRC (src);

  GST_DEBUG_OBJECT (self, "decide_allocation");

  return TRUE;
}

/* start and stop processing, ideal for opening/closing the resource */
static gboolean
gst_periodsrc_start (GstBaseSrc * src)
{
  GstPeriodsrc *self = GST_PERIODSRC (src);
  setup_logger();

  // gchar const* connStr = g_getenv("BOOTSTRAP_SERVER");
  // if (connStr) self->connStr = g_strdup(connStr);
  //   else self->connStr = g_strdup(DEFAULT_CONN_STR);
  // spdlog::info("BOOTSTRAP_SERVER={}...", self->connStr);
  
  // gchar const* topic = g_getenv("CONSUMER_TOPIC");
  // if (topic) self->topic = g_strdup(topic);
  //   else self->topic = g_strdup(DEFAULT_CONSUME_TOPIC);
  // spdlog::info("INFO: CONSUMER_TOPIC={}...", self->topic);

  // if (self->newAPI)
  //   return new_periodsrc_start(src);
  // else
  //   return legacy_periodsrc_start(src);

  // self->pipe_manager = new PipelineManager();

  return TRUE;
}

// static gboolean
// new_periodsrc_stop (GstBaseSrc * src)
// {
//   GstPeriodsrc *self = GST_PERIODSRC (src);
//   NvMsgBrokerErrorType err;
//   gpointer data;

//   GST_DEBUG_OBJECT (self, "stop");
//   spdlog::debug("period src stop 0");
//   err = nv_msgbroker_disconnect (self->connHandle);
//   if (err != NV_MSGBROKER_API_OK) {
//     GST_ERROR_OBJECT (self, "error(%d) in disconnect", err);
//     self->connHandle = NULL;
//   }
//   spdlog::debug("period src stop 1");
//   g_mutex_lock (&self ->flowLock);
//   /* Wait till all the items in the queue are handled. */
//   while (!g_queue_is_empty (self->consume_queue)) {
//     data = g_queue_pop_head (self->consume_queue);
//     g_free(data);
//   }
//   spdlog::debug("period src stop 2");
//   g_cond_broadcast (&self ->flowCond);
//   g_mutex_unlock (&self ->flowLock);
//   spdlog::debug("period src stop 3");
//   g_queue_free (self->consume_queue);
//   spdlog::debug("period src stop 4");
//   return TRUE;
// }

// static gboolean
// legacy_periodsrc_stop (GstBaseSrc * src)
// {
//   GstPeriodsrc *self = GST_PERIODSRC (src);
//   NvDsMsgApiErrorType err;

//   GST_DEBUG_OBJECT (self, "stop");
//   // gpointer data;

//   self->isRunning = FALSE;

//   if (self->nvds_msgapi_disconnect) {
//     err = self->nvds_msgapi_disconnect (self->connHandle);
//     if (err != NVDS_MSGAPI_OK)
//       GST_ERROR_OBJECT (self, "error(%d) in disconnect", err);
//     self->connHandle = NULL;
//   }

//   if (self->libHandle) {
//     dlclose (self->libHandle);
//     self->libHandle = NULL;
//   }

//   spdlog::debug("period src stop 1");
//   g_mutex_lock (&self ->flowLock);
//   /* Wait till all the items in the queue are handled. */
  
//   while (!g_queue_is_empty (self->consume_queue)) {
//     g_queue_pop_head (self->consume_queue);
//     // if (data) g_free(data);
//   }
//   spdlog::debug("period src stop 2");
//   g_cond_broadcast (&self ->flowCond);
//   g_mutex_unlock (&self ->flowLock);
//   spdlog::debug("period src stop 3");
//   g_queue_free (self->consume_queue);
//   spdlog::debug("period src stop 4");
//   return TRUE;
// }

static gboolean
gst_periodsrc_stop (GstBaseSrc * src)
{
  GstPeriodsrc *self = GST_PERIODSRC (src);

  // if (self->newAPI)
  //   return new_periodsrc_stop(src);
  // else
  //   return legacy_periodsrc_stop(src);

  // spdlog::debug("Root: Deleting pipe_manager...");
  // delete self->pipe_manager;
  spdlog::debug("Root: period src stop..");
  return TRUE;
}

/* ask the subclass to create a buffer with offset and size, the default
 * implementation will call alloc and fill. */
static GstFlowReturn
gst_periodsrc_create (GstBaseSrc * src, guint64 offset, guint size,
    GstBuffer ** buf)
{
  GstPeriodsrc *self = GST_PERIODSRC (src);
  GstMapInfo map;
  std::string data = "Hi there!!!\n";
  size_t msg_size = data.size();

  GST_DEBUG_OBJECT (self, "create");

  // g_mutex_lock (&self ->flowLock);
  // if (!g_queue_is_empty (self->consume_queue)) {
  //   data = (std::string*) g_queue_pop_head (self->consume_queue);
  //   msg_size = data->size();
  // } else {
  //   gint64 end_time = g_get_monotonic_time () + 5 * G_TIME_SPAN_SECOND;
  //   g_cond_wait_until (&self->flowCond, &self->flowLock, end_time);
  // }
  // g_mutex_unlock (&self ->flowLock);

  // self->pipe_manager->refresh();
  
  // spdlog::info("Root: Sleep...");
  // wait interval seconds.
  g_usleep (self->interval * 1000000);

  *buf = gst_buffer_new_and_alloc (msg_size);
  gst_buffer_map (*buf, &map, GST_MAP_READWRITE);
  if (msg_size) {
    // g_print("msg: %s", data->c_str());
    memcpy (map.data, data.c_str(), msg_size);
    // delete data;
  }
  gst_buffer_unmap (*buf, &map);

  return GST_FLOW_OK;
}

static gboolean
plugin_init (GstPlugin * plugin)
{

  /* FIXME Remember to set the rank if it's an element that is meant
     to be autoplugged by decodebin. */
  if (!gst_element_register (plugin, "periodsrc", GST_RANK_NONE,
      GST_TYPE_PERIODSRC))
    return FALSE;

  GST_DEBUG_CATEGORY_INIT (gst_periodsrc_debug_category, "periodsrc", 0, "periodsrc calls");

  return TRUE;
}

/* FIXME: these are normally defined by the GStreamer build system.
   If you are creating an element to be included in gst-plugins-*,
   remove these, as they're always defined.  Otherwise, edit as
   appropriate for your external plugin package. */
#ifndef VERSION
#define VERSION "0.0.1"
#endif
#ifndef PACKAGE
#define PACKAGE "period"
#endif
#ifndef PACKAGE_NAME
#define PACKAGE_NAME "gstperiod"
#endif
#ifndef GST_PACKAGE_ORIGIN
#define GST_PACKAGE_ORIGIN "not yet available"
#endif

GST_PLUGIN_DEFINE (GST_VERSION_MAJOR,
    GST_VERSION_MINOR,
    periodsrc,
    "Fake src that send Hi there every [interval] seconds",
    plugin_init, VERSION, "LGPL", PACKAGE_NAME, GST_PACKAGE_ORIGIN)


