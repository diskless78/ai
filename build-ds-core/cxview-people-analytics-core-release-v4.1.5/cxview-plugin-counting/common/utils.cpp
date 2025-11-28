#include "utils.h"


template <typename T>
string join(const T &v, const string &delim)
{
  ostringstream s;
  for (const auto &i : v)
  {
    if (&i != &v[0])
    {
      s << delim;
    }
    s << i;
  }
  return s.str();
}

string line2string(POINT p1, POINT p2)
{
  int x1 = p1.x * MUXER_OUTPUT_WIDTH;
  int y1 = p1.y * MUXER_OUTPUT_HEIGHT;
  int x2 = p2.x * MUXER_OUTPUT_WIDTH;
  int y2 = p2.y * MUXER_OUTPUT_HEIGHT;

  string line = join(vector<int>({x1, y1, x2, y2}), ";");

  return line;
}

string coord2string(vector<POINT> coords)
{
  vector<int> vec;

  for (int i = 0; i < coords.size(); i++)
  {
    POINT p = coords[i];
    int x = p.x * MUXER_OUTPUT_WIDTH;
    int y = p.y * MUXER_OUTPUT_HEIGHT;
    vec.push_back(x);
    vec.push_back(y);
  }

  string roi = join(vec, ";");

  return roi;
}

void generate_ts_rfc3339(char *buf, int buf_size)
{
  time_t tloc;
  struct tm tm_log;
  struct timespec ts;
  char strmsec[6]; //.nnnZ\0

  clock_gettime(CLOCK_REALTIME, &ts);
  memcpy(&tloc, (void *)(&ts.tv_sec), sizeof(time_t));
  localtime_r(&tloc, &tm_log);
  strftime(buf, buf_size, "%Y-%m-%dT%H:%M:%S", &tm_log);
  int ms = ts.tv_nsec / 1000000;
  g_snprintf(strmsec, sizeof(strmsec), ".%.3dZ", ms);
  strncat(buf, strmsec, buf_size);
}


/*
convert 2d vector to cv::Mat
*/
template <typename T>
cv::Mat_<T> vec2cvMat_2D(std::vector< std::vector<T> > &inVec){
  int rows = static_cast<int>(inVec.size());
	int cols = static_cast<int>(inVec[0].size());

	cv::Mat_<T> resmat(rows, cols);
	for (int i = 0; i < rows; i++)
	{
		resmat.row(i) = cv::Mat(inVec[i]).t();
	}
	return resmat;
}

gboolean parse_config(CameraData *cam_data_list, char const *config)
{
  try
  {
    const auto config_json = json::parse(config);
    const auto& cam_config = config_json.at("list_camera");
    int nb_cam = 0;

    for (const auto& cam : cam_config) {
      if (!cam.contains("cam_info") || !cam.contains("config")) {
        spdlog::error("Error when parsing camera config: missing 'cam_info' or 'config'");
        
        return FALSE;
      }

      /*** Update config camera info ***/
      CameraData cam_data;
      const auto& cam_info = cam["cam_info"];
      const auto url = cam_info["url"].get<std::string>();
      const auto cam_id = cam_info["cam_id"].get<std::string>();
      const auto& config = cam["config"];

      if (url.empty() || cam_id.empty())
      {
        spdlog::error("Error when parsing camera config: missing URL or camera ID");
        return FALSE;
      }

      cam_data.url = url;
      cam_data.cam_id = cam_id;
      cam_data.config = config.dump();

      /*** Update config counting ***/

      vector<json> list_zone = config["zone"];
      for (json zone : list_zone)
      {
        const std::string ID = zone["ID"].get<std::string>();
        const vector<float> coord = zone["coord"];
        const vector<float> axis = zone["axis"];

        if (!axis.empty())
        {
          const auto p1 = PolygonPoint{(int)(coord[0] * MUXER_OUTPUT_WIDTH), (int)(coord[1] * MUXER_OUTPUT_HEIGHT)};
          const auto p2 = PolygonPoint{(int)(coord[2] * MUXER_OUTPUT_WIDTH), (int)(coord[3] * MUXER_OUTPUT_HEIGHT)};
          const auto line = std::vector<PolygonPoint>{p1, p2};

          cam_data.entry_lines[ID] = line;
          cam_data.entry_lines[OUT_LINE_KEY + ID] = line;
          cam_data.is_reid = true;
        } else {
          const auto type = zone.value("type", 0);
          RoiType roi_type{};

          switch (type)
          {
          case 0:
            roi_type = OUTSIDE;
            break;
          case 1:
            roi_type = ENTRY;
            break;
          case 2:
            roi_type = CHECKOUT;
            break;
          default:
            break;
          }

          cam_data.zone_analytics[ID] = roi_type;
        }
      }

      /*** Update config reid ***/
      if (config.contains("reid")) {
        json reid_cfg = config["reid"];
        cam_data.is_staff_index = reid_cfg.value("faiss_staff_db", 0) == 1;
        cam_data.is_reid = reid_cfg.value("faiss_switch", 1) != 0;
        cam_data.faiss_interval = reid_cfg.value("faiss_interval", FAISS_REFRESH_INTERVAL);
        cam_data.faiss_threshold = reid_cfg.value("faiss_threshold", FAISS_DISTANCE_THRESHOLD);
      }


      /*** Update config heatmap ***/
      json heatmap_config = config["heatmap"];
      json layout_config = config["layout"];

      if(!heatmap_config.empty())
      {
        cam_data.scale = heatmap_config["scale"].get<std::vector<int>>();
        cam_data.is_heatmap = true;

        const auto& coord_list = heatmap_config["coord"];
        for (const auto& zone : coord_list)
        {
          const std::string ID = zone["ID"].get<std::string>();
          const auto& coord = zone["coord"];

          for (int i = 0; i < coord.size(); i += 2)
          {
            const auto p = PolygonPoint{static_cast<int>(coord[i].get<float>() * MUXER_OUTPUT_WIDTH), 
                                        static_cast<int>(coord[i+1].get<float>() * MUXER_OUTPUT_HEIGHT)};
            cam_data.heatmap_polygon[ID].push_back(p);
          }
        }
      }

      if (!layout_config.empty())
      {
        cam_data.is_layout = true;
        cam_data.layout_id = layout_config["layout_id"].get<std::string>();

        const float layout_grid_w = MUXER_OUTPUT_WIDTH / static_cast<float>(cam_data.scale[0]);
        const float layout_grid_h = MUXER_OUTPUT_HEIGHT / static_cast<float>(cam_data.scale[1]);
        const int layout_scale_w = static_cast<int>(layout_config["layout_shape"][0].get<int>() / layout_grid_w);
        const int layout_scale_h = static_cast<int>(layout_config["layout_shape"][1].get<int>() / layout_grid_h);
        cam_data.layout_scale = {layout_scale_w, layout_scale_h};
        cam_data.layout_grid_size = {layout_grid_w, layout_grid_h};

        const auto& matrix_list = layout_config["matrix"];
        std::vector<std::vector<float>> matrix;
        for (const auto& item : matrix_list)
        {
          matrix.push_back(item.get<std::vector<float>>());
        }
        cam_data.matrix = vec2cvMat_2D(matrix);
      }

      cam_data_list[nb_cam] = cam_data;
      nb_cam++;
    }
  }
  catch (const exception &exc)
  {
    spdlog::error("Error when parse json. Detail: {}", exc.what());
    return FALSE;
  }
  return TRUE;
}


vector<POINT> create_coords(const vector<float>& xyxy)
{
  vector<POINT> coords;
  for (int i = 0; i < xyxy.size(); i += 2)
  {
    POINT p;
    p.x = xyxy[i];
    p.y = xyxy[i+1];
    coords.push_back(p);
  }
  return coords;
}


gboolean dump_config(CameraData *g_cam_data_list, string cfg_file)
{
  try
  {
    std::ofstream config_file(cfg_file);
    if (config_file.is_open()) {
      // default config
      config_file << "[property]\n"
                  << "enable=1\n"
                  << "config-width=" << MUXER_OUTPUT_WIDTH << "\n"
                  << "config-height=" << MUXER_OUTPUT_HEIGHT << "\n"
                  << "osd-mode=2\n\n";
    } else {
      spdlog::error("Failed to open config file '{}'", cfg_file);
      return FALSE;
    }

    for (int cam_idx = 0; cam_idx < MAX_NUM_SOURCES; ++cam_idx) {
      const auto& cam_data = g_cam_data_list[cam_idx];
      if (cam_data.url.empty()) break;

      const auto list_config = json::parse(cam_data.config);

      if (!list_config.contains("direction")
          || !list_config.contains("heatmap")
          || !list_config.contains("layout")
          || !list_config.contains("zone")) {
        spdlog::error("Error parsing zone configuration: missing direction, heatmap, or zone");
        return FALSE;
      }

      std::vector<json> zones = list_config["zone"];
      std::vector<json> entrance_zones;
      std::vector<json> stall_zones;
      std::vector<json> routemap_zones = list_config["direction"];
      nlohmann::json heatmap_config = list_config["heatmap"];

      for (const auto& zone : zones) {
        const auto& axis = zone["axis"];
        if (!axis.empty()) {
          entrance_zones.push_back(zone);
        } else {
          stall_zones.push_back(zone);
        }
      }

      if (!stall_zones.empty() || !heatmap_config.empty())
      {
        config_file << "[roi-filtering-stream-" << cam_idx << "]\n"
                    << "enable=1\n"
                    << "inverse-roi=0\n"
                    << "class-id=-1\n";

        for (const auto& zone : heatmap_config["coord"])
        {
          string ID = zone["ID"];
          auto& xyxy = zone["coord"];
          const int ROI_SIZE = xyxy.size();
          const int MIN_ROI_SIZE = 6;

          if (ROI_SIZE % 2 != 0 || ROI_SIZE < MIN_ROI_SIZE)
          {
            spdlog::error("Can't create roi config...");
            return FALSE;
          }

          auto coords = create_coords(xyxy);
          auto roi_str = coord2string(coords);

          config_file << "roi-" << HM_ROI_KEY + ID << "=" << roi_str << "\n";
        }

        for (const auto& zone : stall_zones)
        { 
          string ID = zone["ID"];
          auto& xyxy = zone["coord"];
          const int ROI_SIZE = xyxy.size();
          const int MIN_ROI_SIZE = 6;

          if (ROI_SIZE % 2 != 0 || ROI_SIZE < MIN_ROI_SIZE)
          {
            spdlog::error("Can't create roi config...");
            return FALSE;
          }

          auto coords = create_coords(xyxy);
          auto roi_str = coord2string(coords);
                  
          config_file << "roi-" << ID << "=" << roi_str << "\n";
        }
        config_file << "\n";
      }

      if (!entrance_zones.empty())
      {
        config_file << "[line-crossing-stream-" << cam_idx << "]\n";
        config_file << "enable=1\n"
                    << "class-id=-1\n"
                    << "extended=0\n"
                    << "mode=balanced\n";

        for (const auto& zone : entrance_zones)
        {
          string ID = zone["ID"];
          const auto& xyxy = zone["coord"];
          const auto& axis = zone["axis"];
          const int LINE_SIZE = xyxy.size();
          const int MIN_NUM_COORD = 4;

          if (LINE_SIZE != MIN_NUM_COORD || LINE_SIZE != MIN_NUM_COORD) {
            spdlog::error("Can't create line config...");
            return FALSE;
          }

          POINT line_point1 = { xyxy[0], xyxy[1] };
          POINT line_point2 = { xyxy[2], xyxy[3] };
          POINT axis_point1 = { axis[0], axis[1] };
          POINT axis_point2 = { axis[2], axis[3] };

          string line_str = line2string(line_point1, line_point2);
          string axis_str = line2string(axis_point1, axis_point2);

          if (zone.contains("inside") && zone["inside"].get<int>() == 0) {
            // This is exit line
            ID = OUT_LINE_KEY + ID;
          } 

          config_file << "line-crossing-" << ID << "=" << axis_str << ";" << line_str << "\n";
        }
        config_file << "\n";
      }

      if (!routemap_zones.empty())
      {
        config_file << "[direction-detection-stream-" << cam_idx << "]\n";
        config_file << "enable=1\n"
                    << "class-id=-1\n";

        for (const auto& zone : routemap_zones)
        {
          string ID = zone["ID"];
          const auto& xyxy = zone["coord"];
          const int LINE_SIZE = xyxy.size();
          const int MIN_NUM_COORD = 4;

          if (LINE_SIZE != MIN_NUM_COORD)
          {
            spdlog::error("Can't create routemap config...");
            return FALSE;
          }

          POINT dir_point1 = { xyxy[0], xyxy[1] };
          POINT dir_point2 = { xyxy[2], xyxy[3] };

          string dir_str = line2string(dir_point1, dir_point2);
          
          config_file << "direction-" << ID << "=" << dir_str << "\n";
        }
      }
    }

    config_file.close();
  }
  catch (const exception &exc)
  {
    spdlog::error("Error when dump config file. Detail: {}", exc.what());
    return FALSE;
  }
  return TRUE;
}

void l2_norm(std::vector<float> &emb) {
  auto norm = sqrt(inner_product(emb.begin(), emb.end(), emb.begin(), 0.0L));

  std::transform(emb.begin(), emb.end(), emb.begin(), [norm](float val) {
    return val / norm;
  });
}