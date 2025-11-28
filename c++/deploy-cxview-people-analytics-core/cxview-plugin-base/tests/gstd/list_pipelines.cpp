// g++ list_pipelines.cpp -I/usr/include/gstreamer-1.0 -I/usr/include/glib-2.0 -I/usr/lib/aarch64-linux-gnu/glib-2.0/include -lgstc-1.0 -o list_pipelines
#include <iostream>
#include <gst/gst.h>
#include "gstd/libgstc.h"
#include <vector>
#include <algorithm>
 
int main(){

  GstcStatus ret;
  const char *address = "127.0.0.1";
  const unsigned int port = 5000;
  const long wait_time = 20000;  //ms
  const int keep_open = 1;
  GstClient *client;
  ret = gstc_client_new (address, port, wait_time, keep_open, &client);

  char **response;
  int array_lenght;

  ret = gstc_pipeline_list (client, &response, &array_lenght);
  std::vector<std::string> list(response, response + array_lenght);
  std::cout << "========= " << array_lenght << " =========\n";
  for (auto &i:list){
    std::cout << "piplines in gstd: " << i << std::endl;
  }

  std::string query = "stream_2";
  if (std::find(list.begin(), list.end(), query) != list.end()){
    std::cout << "== " << query << " is in list == \n";
  } else {
    std::cout << "== " << query << " is not in list == \n";
  }
  return 1;
}