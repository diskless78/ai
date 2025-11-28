#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdio.h>

#include <gst/gst.h>
#include <gst/base/gstbasetransform.h>
// #include "opencv2/imgproc/imgproc.hpp"
// #include "opencv2/highgui/highgui.hpp"
#include "gstsuperviser.h"

GST_DEBUG_CATEGORY_STATIC (gst_superviser_debug_category);
#define GST_CAT_DEFAULT gst_superviser_debug_category

/* prototypes */

static void gst_superviser_set_property (GObject * object,
    guint property_id, const GValue * value, GParamSpec * pspec);
static void gst_superviser_get_property (GObject * object,
    guint property_id, GValue * value, GParamSpec * pspec);
static void gst_superviser_dispose (GObject * object);
static void gst_superviser_finalize (GObject * object);
static gboolean gst_superviser_start (GstBaseTransform * trans);
static gboolean gst_superviser_stop (GstBaseTransform * trans);
static GstFlowReturn gst_superviser_transform_ip (GstBaseTransform * trans,
    GstBuffer * buf);

enum
{
  PROP_0,
  PROP_CUSTOM_PARSER_LIB,
  PROP_CUSTOM_PARSER_NAME,
  PROP_MAIN_PIPELINE_CONFIG
  // PROP_V4L2_STREAM
  // PROP_HEALTHCHECK_TOPIC,
  // PROP_SERVER
};

/* pad templates */

static GstStaticPadTemplate gst_superviser_src_template =
GST_STATIC_PAD_TEMPLATE ("src",
    GST_PAD_SRC,
    GST_PAD_ALWAYS,
    // GST_STATIC_CAPS ("application/unknown")
    GST_STATIC_CAPS_ANY
    );

static GstStaticPadTemplate gst_superviser_sink_template =
GST_STATIC_PAD_TEMPLATE ("sink",
    GST_PAD_SINK,
    GST_PAD_ALWAYS,
    // GST_STATIC_CAPS ("application/unknown")
    GST_STATIC_CAPS_ANY
    );


/* class initialization */

G_DEFINE_TYPE_WITH_CODE (GstSuperviser, gst_superviser, GST_TYPE_BASE_TRANSFORM,
  GST_DEBUG_CATEGORY_INIT (gst_superviser_debug_category, "superviser", 0,
  "debug category for superviser element"));

static void
gst_superviser_class_init (GstSuperviserClass * klass)
{
  GObjectClass *gobject_class = G_OBJECT_CLASS (klass);
  GstBaseTransformClass *base_transform_class = GST_BASE_TRANSFORM_CLASS (klass);

  /* Setting up pads and setting metadata should be moved to
     base_class_init if you intend to subclass this class. */
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_superviser_src_template);
  gst_element_class_add_static_pad_template (GST_ELEMENT_CLASS(klass),
      &gst_superviser_sink_template);

  gst_element_class_set_static_metadata (GST_ELEMENT_CLASS(klass),
      "TannedCung", "Superviser", "supervise other pipelines",
      "<tan.doxuan@cxview.ai");

  GST_INFO_OBJECT(gobject_class, " ================================= Hi there this is   _class_init() ================================= ");

  gobject_class->set_property = gst_superviser_set_property;
  gobject_class->get_property = gst_superviser_get_property;
  gobject_class->dispose = gst_superviser_dispose;
  gobject_class->finalize = gst_superviser_finalize;
  base_transform_class->start = GST_DEBUG_FUNCPTR (gst_superviser_start);
  base_transform_class->stop = GST_DEBUG_FUNCPTR (gst_superviser_stop);
  base_transform_class->transform_ip = GST_DEBUG_FUNCPTR (gst_superviser_transform_ip);
  g_object_class_install_property (gobject_class, PROP_CUSTOM_PARSER_LIB,
    g_param_spec_string ("pipe-parser-lib", "Pipeine Parser Lib",
        "path to custom parser lib, Default=empty string",
        DEFAULT_CUSTOM_PARSER_LIB,
    (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));
  g_object_class_install_property (gobject_class, PROP_CUSTOM_PARSER_NAME,
    g_param_spec_string ("pipe-parser-name", "Pipeline Parser Name",
        "custom parser function name, Default=empty string",
        DEFAULT_CUSTOM_PARSER_NAME,
    (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));
  g_object_class_install_property (gobject_class, PROP_MAIN_PIPELINE_CONFIG,
    g_param_spec_string ("main-pipeline-config", "Main Pipeline Config",
        "path to main pipeline config, variable by parser",
        DEFAULT_MAIN_PIPELINE_CONFIG,
    (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));
  // g_object_class_install_property (gobject_class, PROP_V4L2_STREAM,
  //   g_param_spec_boolean ("v4l2_stream", "V4l2 Stream",
  //       "whether to stream through v4l2",
  //       false,
  //   (GParamFlags) (G_PARAM_READWRITE)));
  // g_object_class_install_property (gobject_class, PROP_BOX_ID,
  //   g_param_spec_string ("box_id", "BoxID",
  //       "Box ud, use for box identification",
  //       DEFAULT_BOX_ID,
  //   (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));

  // g_object_class_install_property (gobject_class, PROP_MUXER_OUPUT_WIDTH,
  //   g_param_spec_uint ("muxerOutputWidth", "MuxerOutputSidth",
  //   "Height of the muxer after preprocessing, default = 1920",
  //   0, G_MAXUINT, DEFAULT_MUXER_WIDTH,
  //   (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));
  // g_object_class_install_property (gobject_class, PROP_MUXER_OUPUT_HEIGHT,
  //   g_param_spec_uint ("muxerOutputHeight", "MuxerOutputHeight",
  //   "Height of the muxer after preprocessing, default = 1080",
  //   0, G_MAXUINT, DEFAULT_MUXER_HEIGHT,
  //   (GParamFlags) (G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS)));
  // dsMetaQuark = g_quark_from_static_string (NVDS_META_STRING);
}

static void
gst_superviser_init (GstSuperviser *self)
{
  // self->box_id = g_strdup (DEFAULT_BOX_ID);
  // self->config = g_strdup (DEFAULT_CONFIG);
  // self->producer_topic = DEFAULT_PRODUCER_TOPIC;
  // self->healthcheck_topic = DEFAULT_HEALTHCHECK_TOPIC;
  // self->conn_str = DEFAULT_CONFIG;
  // self->v4l2_stream = false;

  gst_base_transform_set_passthrough (GST_BASE_TRANSFORM (self), TRUE);
}

void
gst_superviser_set_property (GObject * object, guint property_id,
    const GValue * value, GParamSpec * pspec)
{
  GstSuperviser *self = GST_SUPERVISER (object);

  GST_DEBUG_OBJECT (self, "set_property");

  switch (property_id) {
    case PROP_CUSTOM_PARSER_LIB:
      if (self->custom_parser_lib!=NULL){
        g_free (self->custom_parser_lib);
      }
      self->custom_parser_lib = g_strdup (g_value_get_string (value));
      break;
    case PROP_CUSTOM_PARSER_NAME:
      if (self->custom_parser_name!=NULL){
        g_free (self->custom_parser_name);
      }
      self->custom_parser_name = g_strdup (g_value_get_string (value));
      break;
    case PROP_MAIN_PIPELINE_CONFIG:
      if (self->main_pipeline_config!=NULL){
        g_free (self->main_pipeline_config);
      }
      self->main_pipeline_config = g_strdup (g_value_get_string (value));
      break;
    // case PROP_V4L2_STREAM:
    //   self->v4l2_stream = g_value_get_boolean (value);
    //   break;
    // case PROP_HEALTHCHECK_TOPIC:
    //   if (self->healthcheck_topic!=NULL){
    //     g_free (self->healthcheck_topic);
    //   }
    //   self->healthcheck_topic = g_strdup (g_value_get_string (value));
    //   break;
    // case PROP_SERVER:
    //   if (self->conn_str!=NULL){
    //     g_free (self->conn_str);
    //   }
    //   self->conn_str = g_strdup (g_value_get_string (value));
    //   break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_superviser_get_property (GObject * object, guint property_id,
    GValue * value, GParamSpec * pspec)
{
  GstSuperviser *self = GST_SUPERVISER (object);

  GST_DEBUG_OBJECT (self, "get_property");

  switch (property_id) {
    case PROP_CUSTOM_PARSER_LIB:
      g_value_set_string (value, self->custom_parser_lib);
      break;
    case PROP_CUSTOM_PARSER_NAME:
      g_value_set_string (value, self->custom_parser_name);
      break;
    case PROP_MAIN_PIPELINE_CONFIG:
      g_value_set_string (value, self->main_pipeline_config);
      break;
    // case PROP_V4L2_STREAM:
    //   g_value_set_boolean (value, self->v4l2_stream);
    //   break;
    // case PROP_HEALTHCHECK_TOPIC:
    //   g_value_set_uint (value, self->healthcheck_topic);
    //   break;
    // case PROP_SERVER:
    //   g_value_set_uint (value, self->conn_str);
    //   break;
    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

void
gst_superviser_dispose (GObject * object)
{
  GstSuperviser *superviser = GST_SUPERVISER (object);

  GST_DEBUG_OBJECT (superviser, "dispose");

  /* clean up as possible.  may be called multiple times */

  G_OBJECT_CLASS (gst_superviser_parent_class)->dispose (object);
}

void
gst_superviser_finalize (GObject * object)
{
  GstSuperviser *superviser = GST_SUPERVISER (object);

  GST_DEBUG_OBJECT (superviser, "finalize");

  /* clean up object here */

  G_OBJECT_CLASS (gst_superviser_parent_class)->finalize (object);
}

/* states */
static gboolean
gst_superviser_start (GstBaseTransform * trans)
{
  GstSuperviser *self = GST_SUPERVISER (trans);

  // TODO: add client + parse config
  GST_DEBUG_OBJECT (self, "start");
  setup_logger();
  self->pipe_manager = new PipelineManager(self->custom_parser_lib, self->custom_parser_name, self->main_pipeline_config);
  return TRUE;
}

static gboolean
gst_superviser_stop (GstBaseTransform * trans)
{
  GstSuperviser *self = GST_SUPERVISER (trans);
  GST_DEBUG_OBJECT (self, "stop");
  spdlog::debug("Root: Deleting pipe_manager...");
  delete self->pipe_manager;
  spdlog::debug("Root: kafka src stop..");
  return TRUE;
}

static GstFlowReturn
gst_superviser_transform_ip (GstBaseTransform * trans, GstBuffer * buf)
{
  GstSuperviser *self = GST_SUPERVISER (trans);

  GST_DEBUG_OBJECT (self, "transform_ip");
  GstMapInfo in_map_info;
  std::string result;
  self->pipe_manager->refresh(result);

  size_t msg_size = result.size();
  
  GstMemory *nmemory;
  nmemory = gst_allocator_alloc (NULL, msg_size, NULL); 
  gst_buffer_replace_memory (buf, 0, nmemory);
  // std::cout << "nbuf is writeable: " << gst_buffer_is_writable(nbuf) << std::endl;
  gst_buffer_map (buf, &in_map_info, GST_MAP_READWRITE);
  if (msg_size) memcpy (in_map_info.data, result.c_str(), msg_size);
  gst_buffer_unmap (buf, &in_map_info);
  return GST_FLOW_OK;
}

static gboolean
plugin_init (GstPlugin * plugin)
{

  /* FIXME Remember to set the rank if it's an element that is meant
     to be autoplugged by decodebin. */
  if (!gst_element_register (plugin, "superviser", GST_RANK_NONE,
      GST_TYPE_SUPERVISER))
    return FALSE;

  GST_DEBUG_CATEGORY_INIT (gst_superviser_debug_category, "superviser", 0, "superviser calls");

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
#define PACKAGE "basetransform"
#endif
#ifndef PACKAGE_NAME
#define PACKAGE_NAME "superviser"
#endif
#ifndef GST_PACKAGE_ORIGIN
#define GST_PACKAGE_ORIGIN "not yet available"
#endif

GST_PLUGIN_DEFINE (GST_VERSION_MAJOR,
    GST_VERSION_MINOR,
    superviser,
    "FIXME plugin description",
    plugin_init, VERSION, "LGPL", PACKAGE_NAME, GST_PACKAGE_ORIGIN)

