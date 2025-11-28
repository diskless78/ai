
// g++ -shared -o libcustomparser.so -fPIC dummy_parser.cpp

#include <iostream>
#include <string>

extern "C" bool CustomParser(std::string input, std::string& output){
    output = "nvstreammux name=m batched-push-timeout=40000 batch-size=4 width=1920 height=1080 ! nvmultistreamtiler rows=4 columns=4 width=1920 height=1080 ! nvvideoconvert ! nveglglessink sync=false async=true";
}