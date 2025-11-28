#ifndef _GST_SUPERVISER_H_
#define _GST_SUPERVISER_H_

#include <vector>
#include <chrono>
#include <string>
#include "gstd/libgstc.h"

#include "utils.h"
#include "pipeline.h"

G_BEGIN_DECLS

#define DEFAULT_CUSTOM_PARSER_LIB ""  // custom parser path to load lib, set to NULL string as not loading any functions
#define DEFAULT_CUSTOM_PARSER_NAME "" // custom parser function name, set to NULL string as not loading any functions
#define DEFAULT_MAIN_PIPELINE_CONFIG "" // leave empty to use env

#define GST_TYPE_SUPERVISER   (gst_superviser_get_type())
#define GST_SUPERVISER(obj)   (G_TYPE_CHECK_INSTANCE_CAST((obj),GST_TYPE_SUPERVISER,GstSuperviser))
#define GST_SUPERVISER_CLASS(klass)   (G_TYPE_CHECK_CLASS_CAST((klass),GST_TYPE_SUPERVISER,GstSuperviserClass))
#define GST_IS_SUPERVISER(obj)   (G_TYPE_CHECK_INSTANCE_TYPE((obj),GST_TYPE_SUPERVISER))
#define GST_IS_SUPERVISER_CLASS(obj)   (G_TYPE_CHECK_CLASS_TYPE((klass),GST_TYPE_SUPERVISER))

typedef struct _GstSuperviser GstSuperviser;
typedef struct _GstSuperviserClass GstSuperviserClass;

struct _GstSuperviser
{
  GstBaseTransform base_superviser;
  // gboolean v4l2_stream;
  gchar * custom_parser_lib;
  gchar * custom_parser_name;
  gchar * main_pipeline_config; // path to main pipeline config, variable by custom_parser
  PipelineManager *pipe_manager;
};

struct _GstSuperviserClass
{
  GstBaseTransformClass base_Superviser_class;
};

GType gst_superviser_get_type (void);

G_END_DECLS

#endif
