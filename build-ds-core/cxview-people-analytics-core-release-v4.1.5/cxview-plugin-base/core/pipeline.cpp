#include <iostream>
#include <gst/gst.h>

#include "pipeline.h"

PipelineManager::PipelineManager() {
  const char* config = g_getenv("CONFIG");
  const char* pipeline_config = g_getenv("PIPELINE_CONFIG");
  box_id = g_getenv("BOX_ID");
  g_assert(config && pipeline_config && box_id);
  if (!parse_yaml(pipeline_config, this->main_pipeline) || !parse_config(this->g_cam_data_list, config))
	{
		spdlog::error("Root: Can not parse config. Exiting...");
    g_assert(FALSE);
	}

  GstcStatus ret;
  const char *address = "127.0.0.1";
  const unsigned int port = 5000;
  const long wait_time = 20000;  //ms
  const int keep_open = 1;
  setup_logger();
  ret = gstc_client_new (address, port, wait_time, keep_open, &client);
  g_assert(ret == GSTC_OK);
  spdlog::info("Root: Creat gst-client...");

  // Init src
  this->create_main_pipeline();

  last_refresh = std::chrono::system_clock::now();
  std::string result;
  this->refresh(result, TRUE);
}

PipelineManager::PipelineManager(char* &_lib_path, char* &_custom_parser_name, char* &_pipeline_config) {
  this->lib_path = _lib_path;
  this->custom_parser_name = _custom_parser_name;
  const char* config = g_getenv("CONFIG");
  const char* pipeline_config;
  if (!_pipeline_config) pipeline_config = g_getenv("PIPELINE_CONFIG");
  else pipeline_config = _pipeline_config;
  box_id = g_getenv("BOX_ID");
  g_assert(config && pipeline_config && box_id);
  setup_logger();
  // Load custom pipeline parser
  if (!custom_parse && this->lib_path && this->custom_parser_name){
    auto loaded = (this->handle=dlopen(this->lib_path, RTLD_LAZY));
    if(!loaded) spdlog::warn("Root: Failed to load lib from {}", this->lib_path);
    else {
      custom_parse = (custom_parser_ptr)dlsym(handle, this->custom_parser_name);
      auto err = dlerror(); 
      if (err) spdlog::warn("Root: Failed to load custom parser {} - {}", this->custom_parser_name, err);
    }
  }else spdlog::warn("Root: custom pipeline parser not loaded: lib_path {} - custom_parser_name {}");
  // Try custom follow by default parse_yaml
  if (custom_parse){
    if (!custom_parse(std::string(pipeline_config), this->main_pipeline)) {
      spdlog::error("Root: Failed to parse pipeline config with custom_parse: {}. Exiting...", pipeline_config);
      g_assert(FALSE);
    }
  } else if(!parse_yaml(pipeline_config, this->main_pipeline)){
    spdlog::error("Root: Failed to parse pipeline config: {}. Exiting...", pipeline_config);
    g_assert(FALSE);  
  }
  if (!parse_config(this->g_cam_data_list, config))
	{
		spdlog::error("Root: Can not parse cam config. Exiting...");
    g_assert(FALSE);
	}

  GstcStatus ret;
  const char *address = "127.0.0.1";
  const unsigned int port = 5000;
  const long wait_time = 20000;  //ms
  const int keep_open = 1;
  ret = gstc_client_new (address, port, wait_time, keep_open, &client);
  g_assert(ret == GSTC_OK);
  spdlog::info("Root: Creat gst-client...");

  // Init src
  this->create_main_pipeline();

  last_refresh = std::chrono::system_clock::now();
  last_monitor_msg = last_refresh;
  std::string result;
  this->refresh(result, TRUE);
}

// PipelineManager::PipelineManager(char* &_lib_path, char* &_custom_parser_name, char* &_pipeline_config, bool activate_v4l2) {
//   this->funcs.v4l2 = activate_v4l2;
//   PipelineManager(_lib_path, _custom_parser_name, _pipeline_config);
// }

PipelineManager::~PipelineManager() {
  remove_pipeline(MAIN_PIPELINE);
  g_usleep (1 * 1000000);

  remove_pipeline(FAKESRC_PIPELINE);
  for (int i = 0; i < MAX_NUM_SOURCES; i++) {
    CameraData& cam_data = this->g_cam_data_list[i];
    if (!cam_data.url.length() || cam_data.status==SRC_DISABLE) continue;
    remove_pipeline(cam_data.cam_id.c_str());
    if (cam_data.udp_stream) remove_pipeline(("stream_" + cam_data.cam_id).c_str());
  }
  if (this->custom_parse)
    dlclose(this->handle);
  gstc_client_free (client);
}

void PipelineManager::create_src_pipeline(int index) {
  // const char* pipeline_name, std::string url
  CameraData& cam_data = this->g_cam_data_list[index];
  GstcStatus ret;

  spdlog::info("Root: Adding cam_id={}, url={}...", cam_data.cam_id.c_str(), cam_data.url.c_str());
  std::string pipeline;
  pipeline = "uridecodebin source::latency=200 source::protocols=4 uri=" + cam_data.url + " ! nvvideoconvert ! capsfilter caps=video/x-raw(memory:NVMM),format=RGBA,width=1920,height=1080 ! interpipesink sync=false async=true name=src_" + std::to_string(index);
  ret = gstc_pipeline_create (client, cam_data.cam_id.c_str(), pipeline.c_str());
  g_assert(ret != GSTC_SOCKET_TIMEOUT);
  ret = gstc_pipeline_play (client, cam_data.cam_id.c_str());
  g_assert(ret != GSTC_SOCKET_TIMEOUT);
  g_usleep (1 * 1000000);
}

void PipelineManager::create_udp_pipeline(int index) {
  // const char* pipeline_name, std::string url
  CameraData& cam_data = this->g_cam_data_list[index];
  GstcStatus ret;

  spdlog::info("Root: Adding udp cam_id={} to port {}...", cam_data.cam_id.c_str(), 5001+index);
  std::string pipeline = "interpipesrc name=interpsrc_stream_" +  std::to_string(index) + " listen-to=src_" + FAKESRC_PIPELINE + " accept-eos-event=false stream-sync=passthrough-ts ! queue ! nvvideoconvert ! video/x-raw(memory:NVMM),format=NV12,width=1280,height=720 ! tee name=t t. ! nvv4l2h264enc insert-sps-pps=1 EnableTwopassCBR=1 control-rate=0 bitrate=2000000 vbv-size=125000 ratecontrol-enable=0 ! h264parse ! rtph264pay config-interval=1 pt=96 ! udpsink port=" + std::to_string(5001+index) + " sync=0 t. ! queue ! fakesink";

  // ---for shm---
  // std::string pipeline = "interpipesrc name=interpsrc_stream_" +  std::to_string(index) + " listen-to=src_" + FAKESRC_PIPELINE + " accept-eos-event=false stream-sync=passthrough-ts ! queue ! nvvideoconvert ! video/x-raw, format=I420,  width=1920, height=1080 ! shmsink wait-for-connection=0 socket-path=/tmp/tmpsock sync=true";

  // std::cout << "[DEBUG]: Stream pipeline: " << pipeline << std::endl;
  ret = gstc_pipeline_create (client, ("stream_" + cam_data.cam_id).c_str(), pipeline.c_str());
  g_assert(ret != GSTC_SOCKET_TIMEOUT);
  ret = gstc_pipeline_play (client, ("stream_" + cam_data.cam_id).c_str());
  g_assert(ret != GSTC_SOCKET_TIMEOUT);
  g_usleep (1 * 1000000);
}

/*
Check src pipeline and update its status
*/
void PipelineManager::check_src_pipeline(int index, long long timeout, gboolean verbose) {
  GstcStatus ret;
  char* message;
  CameraData& cam_data = this->g_cam_data_list[index];

  ret = gstc_pipeline_bus_wait (client, cam_data.cam_id.c_str(), "error+eos", timeout, &message);
  spdlog::info("Root: ret={}...", ret);

  // update cam status
  if (ret==GSTC_OK) {
    cam_data.status = SRC_DISABLE;
    spdlog::warn("Root: camID={} is not working, msg={}...", cam_data.cam_id.c_str(), message);
    cam_data.error_message = std::string(message);
  } else if (ret==GSTC_BUS_TIMEOUT) {
    if (verbose) spdlog::info("Root: camID={} is working, msg={}...", cam_data.cam_id.c_str(), message);
    cam_data.status = SRC_ENABLE;
    cam_data.error_message = "";
  }
  if (message){
    g_free (message);
  }
}

void PipelineManager::remove_pipeline(const char* pipeline_name) {
  GstcStatus ret;
  ret = gstc_pipeline_stop (client, pipeline_name);
  g_assert(ret != GSTC_SOCKET_TIMEOUT);
  ret = gstc_pipeline_delete (client, pipeline_name);
  g_assert(ret != GSTC_SOCKET_TIMEOUT);
  spdlog::info("Root: Removed pipeline_name={}, ret={}...", pipeline_name, ret);
}

/*
Create fakesrc pipeline that connected to streammux
*/
void PipelineManager::create_main_pipeline(){
  gint total_src=0;
  GstcStatus ret;

  // check src plugin is exist
  std::string::size_type i = main_pipeline.find(MONITOR_PLUGIN);
  if (i == std::string::npos) {
    spdlog::error("Root: The main pipeline must contain plugin=\"{}\"...", MONITOR_PLUGIN);
    g_assert(FALSE);
  }

  spdlog::info("Root: Creating fakesrc...");
  std::string fakesrc_pipeline = "videotestsrc is-live=true ! capsfilter caps=video/x-raw,framerate=25/1 ! nvvideoconvert ! capsfilter caps=video/x-raw(memory:NVMM),format=RGBA,width=1920,height=1080 ! interpipesink sync=false async=true name=src_";
  fakesrc_pipeline += FAKESRC_PIPELINE;
  spdlog::info("Root: fakesrc_pipeline={}...", fakesrc_pipeline);
  ret = gstc_pipeline_create (client, FAKESRC_PIPELINE, fakesrc_pipeline.c_str());
  g_assert(ret != GSTC_SOCKET_TIMEOUT);
  ret = gstc_pipeline_play (client, FAKESRC_PIPELINE);
  g_assert(ret != GSTC_SOCKET_TIMEOUT);

  g_usleep (1 * 1000000);
  std::string pipeline = main_pipeline;
  for (int i = 0; i < MAX_NUM_SOURCES; i++) {
    CameraData& cam_data = this->g_cam_data_list[i];
    // ignore src that is not active
    if (!cam_data.url.length()) continue;
    total_src++;
    pipeline += " interpipesrc accept-eos-event=false stream-sync=restart-ts name=interpipesrc" + std::to_string(i) + " listen-to=src_" + FAKESRC_PIPELINE + " ! queue max-size-buffers=2 leaky=2" + " ! m.sink_" + std::to_string(i);
  }

  if (!total_src) {
    spdlog::error("Root: No activate src. Exiting...");
    g_assert(FALSE);
  }
  spdlog::info("Root: total_src={}...", total_src);
  spdlog::info("Root: pipeline={}...", pipeline);
  ret = gstc_pipeline_create (client, MAIN_PIPELINE, pipeline.c_str());
  g_assert(ret != GSTC_SOCKET_TIMEOUT);
  ret = gstc_pipeline_play (client, MAIN_PIPELINE);
  g_assert(ret != GSTC_SOCKET_TIMEOUT);
  g_usleep (1 * 1000000);
}

// GstcStatus PipelineManager::udp_pipeline_change_src(std::string &pipeline_name, std::string &element_name, std::string &src_name){
//   GstcStatus ret;
//   ret = gstc_pipeline_stop (client, pipeline_name.c_str());
//   if (ret != GSTC_OK) return ret;
//   g_usleep (1 * 500000);
//   ret = gstc_element_set(client, pipeline_name.c_str(), element_name.c_str(), "listen-to", "%s", src_name.c_str());
//   if (ret != GSTC_OK) return ret;
//   g_usleep (1 * 500000);
//   ret = gstc_pipeline_play (client, pipeline_name.c_str());
//   if (ret != GSTC_OK) return ret;
//   g_usleep (1 * 500000);
//   return ret;
// }

void PipelineManager::refresh(std::string &result, gboolean force) {
  // check interval before refresh
  std::chrono::system_clock::time_point now = std::chrono::system_clock::now();
  if (((std::chrono::duration_cast<std::chrono::minutes>(now - last_refresh)).count() < REFRESH_INTERVAL) && !force) return;
  last_refresh = now;

  spdlog::info("Root: ==================================");
  spdlog::info("Root: Refreshing pipelines...");

  // get all pipeline in gstd
  char **response;
  int array_lenght;
  GstcStatus ret = gstc_pipeline_list (client, &response, &array_lenght);
  std::vector<std::string> list_pipelines(response, response + array_lenght);

  gint g_frame_out_list[MAX_NUM_SOURCES]={0};
  if (!force) {
    if (this->update_monitor_data(g_frame_out_list)) last_monitor_msg = now;
    /* if cannot receive monitor msg for a period of time (10xREFRESH_INTERVAL minute), reconnect all src */
    else if ((std::chrono::duration_cast<std::chrono::seconds>(now - last_monitor_msg)).count() > REFRESH_INTERVAL*60*10) {
      spdlog::error("Root: All of the srcs are disconnected. Exiting...");
      g_assert(FALSE);
    }
  }

  for (int i = 0; i < MAX_NUM_SOURCES; i++)
	{
    // check if cam obj is empty
    CameraData& cam_data = this->g_cam_data_list[i];
		if (!cam_data.url.length())
			continue;
    std::string interpipesrc_name = "interpipesrc" + std::to_string(i);
    std::string src_name = "src_" + std::to_string(i);
    std::string fakesrc_name = "src_" + std::string(FAKESRC_PIPELINE);
    std::string stream_src_name = "interpsrc_stream_" +  std::to_string(i);
    std::string stream_pipeline_name = "stream_" + cam_data.cam_id;
    GstcStatus gstc_ret;
    // Check udp here for endurability purpose
    // if this camera is to stream udp and no udp stream in list_pipelines create one
    if (cam_data.udp_stream && std::find(list_pipelines.begin(), list_pipelines.end(), stream_pipeline_name) == list_pipelines.end())
      create_udp_pipeline(i);
    // if this camera is not to stream udp and there is an udp stream in list_pipelines remove it
    if (!cam_data.udp_stream && std::find(list_pipelines.begin(), list_pipelines.end(), stream_pipeline_name) != list_pipelines.end())
      remove_pipeline(stream_pipeline_name.c_str());

    // if src is disable, enable and check it
    if (cam_data.status==SRC_DISABLE) {
      // fix bug: pipe is suspended when src is disable
      if (g_frame_out_list[i] > FRAME_TIMEOUT) {
        spdlog::error("Root: Fakesrc is hanging...");
        g_assert(FALSE);
      }
      
      this->create_src_pipeline(i);
      this->check_src_pipeline(i);
      if (cam_data.status == SRC_DISABLE)
        remove_pipeline(cam_data.cam_id.c_str());
      else{
        if (cam_data.udp_stream){
          gstc_ret = gstc_pipeline_stop (client, stream_pipeline_name.c_str());
          gstc_ret = gstc_element_set(client, stream_pipeline_name.c_str(), stream_src_name.c_str(), "listen-to", "%s", src_name.c_str());
          gstc_ret = gstc_pipeline_play (client, stream_pipeline_name.c_str());
          // gstc_ret = udp_pipeline_change_src(stream_pipeline_name, stream_src_name, src_name); // switch src to streammux
        //   if (gstc_ret != GSTC_OK) {
        //     spdlog::info("udp stream modifying failed with err {}, Removing ...", gstc_ret);  
        //     remove_pipeline(stream_pipeline_name.c_str());
        //   }
          g_usleep (1 * 500000);
        }
        gstc_element_set(client, MAIN_PIPELINE, interpipesrc_name.c_str(), "listen-to", "%s", src_name.c_str()); // switch src to streammux
      }
    } else {
      gboolean need_check = TRUE;
      if (g_frame_out_list[i] > FRAME_TIMEOUT) {
        spdlog::info("Root: Frameout exceeds FRAME_TIMEOUT, force delete camID={}...", cam_data.cam_id.c_str());
        cam_data.status = SRC_DISABLE;
        need_check = FALSE;
        g_usleep (1 * 1000000);
      }

      if (need_check) this->check_src_pipeline(i, 1000);
      if (cam_data.status == SRC_DISABLE) {
        if (cam_data.udp_stream){
          gstc_ret = gstc_pipeline_stop (client, stream_pipeline_name.c_str());
          gstc_ret = gstc_element_set(client, stream_pipeline_name.c_str(), stream_src_name.c_str(), "listen-to", "%s", fakesrc_name.c_str());
          gstc_ret = gstc_pipeline_play (client, stream_pipeline_name.c_str());
          // udp_pipeline_change_src(stream_pipeline_name, stream_src_name, fakesrc_name); // switch src to fakesrc
          // if (gstc_ret != GSTC_OK) {
          //   spdlog::info("udp stream modifying failed with err {}, Removing ...", gstc_ret);  
          //   remove_pipeline(stream_pipeline_name.c_str());
          // }
          g_usleep (1 * 500000);
        }
        gstc_element_set(client, MAIN_PIPELINE, interpipesrc_name.c_str(), "listen-to", "%s", fakesrc_name.c_str()); // switch src to fakesrc
        remove_pipeline(cam_data.cam_id.c_str());
      }
    }
	}
  this->healthcheck_msgconv(result);
  spdlog::info("Root: ==================================");
}

void PipelineManager::healthcheck_msgconv(std::string &result){
  json jresult;
  milliseconds now = duration_cast< milliseconds >(system_clock::now().time_since_epoch());
  jresult["@timestamp"] = now.count();
  json meta;
  meta["BoxID"] = std::string(this->box_id);
  jresult["metadata"] = meta;
  jresult["cameras"] = {};
  int total_die = 0;
  for (int i = 0; i < MAX_NUM_SOURCES; i++)
	{
    // check if cam obj is empty
    CameraData& cam_data = this->g_cam_data_list[i];
		if (!cam_data.url.length())
			continue;
    json ij;
    if (cam_data.status!=0) total_die++;
    ij["state"] = std::to_string(cam_data.status);
    ij["msg"] = cam_data.error_message;
    ij["camID"] = cam_data.cam_id;
    jresult["cameras"].push_back(ij);
	}
  jresult["TOTAL_DIE"] = std::to_string(total_die);
  result = jresult.dump();
}


gboolean PipelineManager::update_monitor_data(gint* g_frame_out_list) {
  char data[64];
  auto ret = gstc_element_get(this->client, MAIN_PIPELINE, "monitor", "monitor-data", "\"%s\"", data);
  g_assert(ret == GSTC_OK);
  std::string data_str(data);
  data_str.pop_back();  // convert {}" => {}
  data_str.erase(std::remove(data_str.begin(), data_str.end(), '\\'), data_str.end());  // convert \\{\\} to {}
  json data_json = json::parse(data_str);
  spdlog::info("Root: Monitor data={}...", data_json.dump());

  if (data_json.empty()) return FALSE;

  for (int i = 0; i < MAX_NUM_SOURCES; i++) {
    g_frame_out_list[i] = data_json["data"][i];
  }

  // free data
  ret = gstc_element_set(this->client, MAIN_PIPELINE, "monitor", "monitor-data", "%s", MONITOR_DEFAULT_DATA);
  g_assert(ret == GSTC_OK);

  return TRUE;
}