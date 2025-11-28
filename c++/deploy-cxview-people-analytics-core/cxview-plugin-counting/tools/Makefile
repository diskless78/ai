CXX:= g++
SRCS:= dump_config.cpp
		
INCS:= $(wildcard *.h)
LIB:=dump_config

CFLAGS+= -fPIC -std=c++11 -I../cxview-plugin-base/common

OBJS:= $(SRCS:.cpp=.o)

all: $(LIB)

%.o: %.cpp $(INCS) Makefile
	$(CXX) -c -o $@ $(CFLAGS) $<

$(LIB): $(OBJS) $(DEP) Makefile
	$(CXX) -o $@ $(OBJS) $(LIBS)

clean:
	rm -rf $(OBJS) $(LIB)