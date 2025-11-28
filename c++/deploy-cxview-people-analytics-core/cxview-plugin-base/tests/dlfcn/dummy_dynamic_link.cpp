// g++ -shared -o libcustomparser.so -fPIC dummy_parser.cpp
// g++ dummy_dynamic_link.cpp -o dummy_dl.o -ldl

#include <iostream>
#include <string>
#include <dlfcn.h>

// #include "lib/dummy_lib.h"

typedef bool* dummy_ret;
typedef dummy_ret (*dummy_func_type)(std::string);

void load_func(const char* lib_path){
    dummy_func_type orig_func=0;
    std::cout << "[INFO]: typeid(orig_func).name(): " << typeid(orig_func).name() << std::endl;
    std::cout << "[INFO]: orig_func: " << orig_func << std::endl;
    
    void * handle;
    dummy_ret ret;

    std::cout << "[INFO]: Loading library from " <<  lib_path << std::endl;
    if (orig_func){
        std::cout << "[DEBUG] orig_func is not NULL \n";
    }else{
        std::cout << "[DEBUG] orig_func is NULL \n";
    }
    if (!orig_func) {
        auto loaded = (handle=dlopen(lib_path, RTLD_LAZY));
        std::cout << "[INFO]: " << loaded << std::endl;
        if(!loaded) {
        perror("dlopen");
        puts("here dlopen");
        abort();
        }

        if (handle){
            std::cout << "[DEBUG] handle is not NULL \n";
        }else{
            std::cout << "[DEBUG] handle is NULL \n";
        }

        orig_func = (dummy_func_type)dlsym(handle, "dynamicHelloWorld");
        auto err = dlerror();
        if(err) {
        std::cout << "[ERROR]: " << err << std::endl;
        if (orig_func){
            std::cout << "[DEBUG] orig_func is not NULL \n";
        }else{
            std::cout << "[DEBUG] orig_func is NULL \n";
        }

        perror("dlsym");
        puts("here dlsym");
        abort();
        }else {
            std::cout << "[INFO]: Loaded lib \n";
        }

        if (orig_func){
            std::cout << "[DEBUG] orig_func is not NULL \n";
        }else{
            std::cout << "[DEBUG] orig_func is NULL \n";
        }

        std::string name = "TannedCung";
        ret = orig_func(name);
        std::cout << "[INFO]: !ret: " << !ret << std::endl;
        dlclose(handle);
    }

    // std::cout << ret << "from outside \n";
}

int main(){
    load_func("lib/libdummylib.so");
    // load_func("");
}