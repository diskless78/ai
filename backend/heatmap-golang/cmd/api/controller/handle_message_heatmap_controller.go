package controller

import (
	"encoding/json"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	slog "github.com/go-eden/slf4go"
	"github.com/sjsdfg/common-lang-in-go/StringUtils"
	"go.mongodb.org/mongo-driver/mongo"
	"heatmap/business/services"
	"heatmap/business/validations"
	"heatmap/common/constant"
	"heatmap/common/pojo"
	"heatmap/model"
	"heatmap/utils/date_time_utils"
	"heatmap/utils/logger"
)

type HandleMessageKafkaInterface interface {
	HandleMessageKafkaPeopleCounting()
}

type handleMessageKafka struct {
	handleMessageKafkaValidation validations.HandleMessageKafkaValidationInterface
	heatmapService               services.HeatmapHistoryServiceInterface
	cameraRepository             model.CameraRepositoryInterface
}

func NewHandleMessageKafka(
	handleMessageKafkaValidation validations.HandleMessageKafkaValidationInterface,
	heatmapService services.HeatmapHistoryServiceInterface,
	cameraRepository model.CameraRepositoryInterface,
) HandleMessageKafkaInterface {
	logger.Slogger.BindFields(slog.Fields{constant.CorrelationId: "HEATMAP_KAFKA"})
	return &handleMessageKafka{
		handleMessageKafkaValidation: handleMessageKafkaValidation,
		heatmapService:               heatmapService,
		cameraRepository:             cameraRepository,
	}
}

func (h *handleMessageKafka) HandleMessageKafkaPeopleCounting() {
	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers":     container.Config.KafkaBroker,
		"group.id":              container.Config.KafkaGroup,
		"broker.address.family": "v4",
		"session.timeout.ms":    6000,
		"auto.offset.reset":     "earliest",
	})
	kafkaTopic := container.Config.KafkaTopic

	logger.Slogger.Info("Start consume message")
	if err != nil {
		logger.Slogger.Errorf("Handle message error %s", err.Error())
	}

	err = consumer.SubscribeTopics([]string{kafkaTopic}, nil)

	run := true

	for run {
		ev := consumer.Poll(0)
		switch e := ev.(type) {
		case *kafka.Message:
			h.ProcessMessageKafka(e)
		case kafka.Error:
			logger.Slogger.Errorf("Error: %v", e)
			run = false
		default:
			continue
		}
	}
	err = consumer.Close()

}

func (h *handleMessageKafka) ProcessMessageKafka(message *kafka.Message) {
	var heatmapKafkaObject pojo.HeatmapKafkaObject

	err := json.Unmarshal(message.Value, &heatmapKafkaObject)
	if err != nil {
		logger.Slogger.Errorf("Unmarshal message error: %s", message.Value)
		return
	}

	logger.Slogger.Infof("Box ID: %s", heatmapKafkaObject.BoxID)
	logger.Slogger.Infof("Camera ID: %s", heatmapKafkaObject.CamID)
	logger.Slogger.Infof("Timestamp: %d", heatmapKafkaObject.Timestamp)

	timestampBeginOfDay, err := date_time_utils.GetBeginTimestampOfDayAsia(heatmapKafkaObject.Timestamp)
	if err != nil {
		logger.Slogger.Errorf("Error when get time: %s", message)
		return
	}

	err = h.handleMessageKafkaValidation.Validate(heatmapKafkaObject.BoxID, heatmapKafkaObject.CamID)
	if err != nil {
		logger.Slogger.Errorf("Error: %v", err)
		return
	}

	camera, err := h.cameraRepository.FindCameraByID(heatmapKafkaObject.CamID)
	if err != nil {
		logger.Slogger.Errorf("Error when get camera by id: %v", camera)
		return
	}

	if StringUtils.IsEmpty(camera.CameraType) {
		camera.CameraType = constant.CameraTypeNormal
	}

	heatmapHistory, err := h.heatmapService.FindHeatmapHistory(heatmapKafkaObject.BoxID, heatmapKafkaObject.CamID, timestampBeginOfDay)

	if err == mongo.ErrNoDocuments {
		h.insertHeatmapHistoryRecord(heatmapKafkaObject, timestampBeginOfDay, camera.CameraType)

		return
	}

	if err != nil {
		logger.Slogger.Errorf("Error: %v", err)
		return
	}

	logger.Slogger.Infof("Found heatmap record, start update heatmap record")
	h.updateHeatmapHistoryRecord(heatmapHistory, heatmapKafkaObject)
}

func (h *handleMessageKafka) insertHeatmapHistoryRecord(heatmapKafkaObject pojo.HeatmapKafkaObject, timestamp int64, cameraType string) {
	listHeatmapHistoryData := make([]model.HeatmapHistoryData, 0)
	listHeatmapHistoryData = updateHeatmapHistoryData(listHeatmapHistoryData, heatmapKafkaObject.Data)

	heatmapHistory := model.HeatmapHistory{
		BoxID:                  heatmapKafkaObject.BoxID,
		CameraID:               heatmapKafkaObject.CamID,
		Timestamp:              timestamp,
		CameraType:             cameraType,
		ListHeatmapHistoryData: listHeatmapHistoryData,
	}

	err := h.heatmapService.InsertHeatmapHistory(heatmapHistory)
	if err != nil {
		logger.Slogger.Errorf("Insert heatmap record fail: %v", err)
	} else {
		logger.Slogger.Info("Insert heatmap record success")
	}
}

func (h *handleMessageKafka) updateHeatmapHistoryRecord(heatmapHistory model.HeatmapHistory, heatmapKafkaObject pojo.HeatmapKafkaObject) {
	heatmapHistory.ListHeatmapHistoryData = updateHeatmapHistoryData(heatmapHistory.ListHeatmapHistoryData, heatmapKafkaObject.Data)

	err := h.heatmapService.UpdateListHeatmapHistoryData(heatmapHistory)
	if err != nil {
		logger.Slogger.Errorf("Update heatmap record fail: %v", err)
	} else {
		logger.Slogger.Info("Update heatmap record success")
	}
}

func updateHeatmapHistoryData(listHeatmapHistoryData []model.HeatmapHistoryData, listHeatmapHistoryDataUpdate []pojo.Coordinate) []model.HeatmapHistoryData {
	if len(listHeatmapHistoryData) == 0 {
		for x := 0; x < 73; x++ {
			for y := 0; y < 42; y++ {
				heatmapHistoryData := model.HeatmapHistoryData{
					Index:     []int64{int64(x), int64(y)},
					DwellTime: 0,
				}

				listHeatmapHistoryData = append(listHeatmapHistoryData, heatmapHistoryData)
			}
		}
	}

	for heatmapDataUpdateIndex, heatmapDataUpdate := range listHeatmapHistoryDataUpdate {
		for heatmapDataIndex, heatmapData := range listHeatmapHistoryData {
			if heatmapDataUpdate.Index[0] == heatmapData.Index[0] && heatmapDataUpdate.Index[1] == heatmapData.Index[1] {
				listHeatmapHistoryData[heatmapDataIndex].DwellTime += listHeatmapHistoryDataUpdate[heatmapDataUpdateIndex].DwellTime
				break
			}
		}
	}

	return listHeatmapHistoryData
}
