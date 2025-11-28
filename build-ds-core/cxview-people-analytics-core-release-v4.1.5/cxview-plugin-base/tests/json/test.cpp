#include <iostream>
#include <chrono>
#include "nlohmann/json.hpp"

using json = nlohmann::json;
using namespace std::chrono;

int main (){
    // create an object
    json o;
    o["foo"] = 23;
    o["bar"] = false;
    o["baz"] = 3.141;

    // also use emplace
    o.emplace("weather", "sunny");

    json i1;
    i1["state"] = "OK";
    i1["msg"] = "";
    i1["camID"] = "1";

    json i2;
    i2["state"] = "OK";
    i2["msg"] = "";
    i2["camID"] = "2";

    json i3;
    i3["state"] = "OK";
    i3["msg"] = "";
    i3["camID"] = "3";

    json meta;
    meta["boxID"] = "Box-123456";
    milliseconds ms = duration_cast< milliseconds >(system_clock::now().time_since_epoch());

    json j;
    j["cameras"] = {};
    j["@timestamp"] = std::to_string(ms.count());
    j["metadata"] = meta;


    json i4;
    i4["state"] = "OK";
    i4["msg"] = "";
    i4["camID"] = "4";

    j["cameras"].push_back(i1);
    j["cameras"].push_back(i2);
    j["cameras"].push_back(i3);
    j["cameras"].push_back(i4);


    for (auto& [key, value] : j.items()) {
        std::cout << key << " : " << value << "\n";
    }

    std::string result = j.dump();
    std::cout << "======== dump ======= \n";
    std::cout << result << std::endl;


    return 0;
}