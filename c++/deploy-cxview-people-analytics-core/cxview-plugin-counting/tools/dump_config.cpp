#include "nlohmann/json.hpp"
#include "spdlog/spdlog.h"

#include "common.h"
#include "utils.h"

using namespace std;
using json = nlohmann::json;


int main()
{
	gchar const *config = g_getenv("CONFIG");

	CameraData g_cam_data_list[MAX_NUM_SOURCES] = {0};
	if (!parse_config(g_cam_data_list, config))
	{
		g_error("Can not parse config. Exiting.\n");
	}

	if (!dump_config(g_cam_data_list, ANALYTICS_CONFIG_FILE))
	{
		g_error("Can not dump config. Exiting.\n");
	}

	return 0;
}