#include <string>

#ifndef __COMMON_H__
#define __COMMON_H__

#ifdef __cplusplus
extern "C"
{
#endif

#define REFRESH_INTERVAL 1  // minutes, use to refresh pipeline (gstsupervisor), update src monitor msg
#define MAX_NUM_SOURCES 4
#define MONITOR_DEFAULT_DATA "{}"  // empty data
#define MONITOR_PLUGIN "srcmonitor name=monitor"  // name of gstsrcmonitor

typedef enum {
    SRC_DISABLE = -1,
    SRC_ENABLE = 0,
} SrcStatus;

typedef struct CameraData {
    std::string url;
    std::string cam_id;
    std::string error_message;
    bool udp_stream = false;

    SrcStatus status=SRC_DISABLE;
} CameraData;

typedef struct _MonitorData {
  int data[MAX_NUM_SOURCES] = {0};
  int flag = 0;  // 1 if new data
} MonitorData;


#ifdef __cplusplus
}
#endif
#endif
