#include <iostream>
#include <string>

extern "C" bool dynamicHelloWorld(std::string name) {
    // std::cout << "[INFO]: The very first line from lib\n";
    std::string st =  "Hello " +  name;
    std::cout << st << " from lib \n";
    return true;
}
