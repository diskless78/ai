#include "utils.h"
#include "nlohmann/json.hpp"
#include "wordexp.h"

#include  "common.h"


using json = nlohmann::json;

void setup_logger(){
  auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
  console_sink->set_level(spdlog::level::debug);
  console_sink->set_pattern("[%D %H:%M:%S] [%^%l%$] [thread %t] %v");

  auto file_sink = std::make_shared<spdlog::sinks::daily_file_sink_mt>("logs/Search_log.log", 23, 59);  
  file_sink->set_pattern("[%D %H:%M:%S] [%^%l%$] [thread %t] %v");
  file_sink->set_level(spdlog::level::debug);

  spdlog::sinks_init_list sink_list = {file_sink, console_sink };

  spdlog::logger logger("search_logger", sink_list.begin(), sink_list.end());
  logger.set_level(spdlog::level::debug);
  spdlog::set_default_logger(std::make_shared<spdlog::logger>("search_logger", spdlog::sinks_init_list({console_sink, file_sink})));
  spdlog::enable_backtrace(32);
}

gboolean parse_config(CameraData *cam_data_list, char const *config)
{
  try
  {
    json config_json = json::parse(config);
    // spdlog::info("Config {}", config_json.dump(4).c_str());
    for (int i = 0; i < config_json["list_camera"].size(); i++)
    {
      bool flag = false;
      if (config_json["list_camera"][i].contains("cam_info")
          && config_json["list_camera"][i].contains("config"))
        flag = true;
      if (!flag)
      {
        spdlog::error("Can't parse config...");
        return FALSE;
      }

      CameraData cam_data;
      std::string url = config_json["list_camera"][i]["cam_info"]["url"].get<std::string>();
      std::string cam_id = config_json["list_camera"][i]["cam_info"]["cam_id"].get<std::string>();
      std::string config = config_json["list_camera"][i]["config"].dump();
      bool udp_stream = false;
      if (config_json["list_camera"][i]["config"].contains("udp")) udp_stream = config_json["list_camera"][i]["config"]["udp"].get<bool>();
      if (url.empty() || cam_id.empty())
      {
        spdlog::error("Error when parse camera config...");
        return FALSE;
      }
      cam_data.url = url;
      cam_data.cam_id = cam_id;
      cam_data.status = SrcStatus::SRC_DISABLE;
      cam_data.udp_stream = udp_stream;

      cam_data_list[i] = cam_data;
    }
  }
  catch (const std::exception &exc)
  {
    spdlog::error("Error when parse json. Detail: {}", exc.what());
    return FALSE;
  }
  return TRUE;
}

gboolean parse_yaml(const char* pipeline_config, std::string &main_pipeline) {
  try {
    YAML::Node config = YAML::LoadFile(std::string(pipeline_config));
    main_pipeline = config["main_pipeline"].as<std::string>();

    wordexp_t p;
    char **w;
    wordexp(main_pipeline.c_str(), &p, 0);
    w = p.we_wordv;
    main_pipeline.clear();
    for (int i=0; i<p.we_wordc; i++)
      main_pipeline += std::string(w[i]) + " ";
    wordfree(&p);
  }
  catch (const std::exception &exc)
  {
    spdlog::error("Error when parse yaml. Detail: {}", exc.what());
    return FALSE;
  }
  return TRUE;
}
