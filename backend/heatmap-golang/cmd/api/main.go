package main

import (
	container_cloud "heatmap/cmd/api/container"
	"log"
	"runtime"
)

var (
	container = container_cloud.NewContainer()
)

func main() {
	err := container.Setup()
	if err != nil {
		log.Fatal(err)
	}

	go StartWorkerConsumeMessageKafka()
	StartAPIServer()
}

func init() {
	runtime.GOMAXPROCS(runtime.NumCPU())
}
