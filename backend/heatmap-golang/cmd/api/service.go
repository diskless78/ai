package main

import (
	"heatmap/business/services"
	"heatmap/business/validations"
	"heatmap/cmd/api/controller"
	"heatmap/model"
	"heatmap/utils/logger"
	"log"
)

// StartAPIServer : mở router của các API
func StartAPIServer() {
	err := controller.NewRouter(container)
	if err != nil {
		log.Fatal(err)
	}
}

func StartWorkerConsumeMessageKafka() {
	logger.Slogger.Info("Starting kafka worker")

	cameraRepository := model.NewCameraRepository(container.DataStore.GetDB())
	boxRepository := model.NewBoxRepository(container.DataStore.GetDB())
	heatmapHistoryRepository := model.NewHeatmapHistoryRepository(container.DataStore.GetDB())

	handleMessageKafkaValidation := validations.NewHandleMessageKafkaValidation(boxRepository, cameraRepository)

	heatmapHistoryService := services.NewHeatmapHistoryService(heatmapHistoryRepository)

	handleMessageKafka := controller.NewHandleMessageKafka(handleMessageKafkaValidation, heatmapHistoryService, cameraRepository)

	go handleMessageKafka.HandleMessageKafkaPeopleCounting()
	go handleMessageKafka.HandleMessageKafkaPeopleCounting()
	go handleMessageKafka.HandleMessageKafkaPeopleCounting()
	go handleMessageKafka.HandleMessageKafkaPeopleCounting()
	go handleMessageKafka.HandleMessageKafkaPeopleCounting()
}
