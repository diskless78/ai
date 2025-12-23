package services

import (
	"heatmap/model"
	"heatmap/utils/logger"
)

type HeatmapHistoryServiceInterface interface {
	InsertHeatmapHistory(heatmapHistoryInsert model.HeatmapHistory) (err error)
	UpdateListHeatmapHistoryData(heatmapHistoryUpdate model.HeatmapHistory) (err error)
	FindHeatmapHistory(boxID string, cameraID string, timestamp int64) (heatmapHistory model.HeatmapHistory, err error)
}

type heatmapHistoryService struct {
	heatmapHistoryRepository model.HeatmapHistoryRepositoryInterface
}

func NewHeatmapHistoryService(heatmapHistoryRepository model.HeatmapHistoryRepositoryInterface) HeatmapHistoryServiceInterface {
	return &heatmapHistoryService{
		heatmapHistoryRepository: heatmapHistoryRepository,
	}
}

func (service *heatmapHistoryService) InsertHeatmapHistory(heatmapHistoryInsert model.HeatmapHistory) (err error) {
	logger.Slogger.Info("Start func (service *heatmapHistoryService) InsertHeatmapHistory(heatmapHistoryInsert model.HeatmapHistory) (err error)")

	err = service.heatmapHistoryRepository.InsertHeatmapHistory(heatmapHistoryInsert)

	if err != nil {
		logger.Slogger.Errorf("Error when insert heatmap history: %v", err)
		return err
	}

	return err
}

func (service *heatmapHistoryService) UpdateListHeatmapHistoryData(heatmapHistoryUpdate model.HeatmapHistory) (err error) {
	logger.Slogger.Info("Start func (service *heatmapHistoryService) UpdateListHeatmapHistoryData(heatmapHistoryUpdate model.HeatmapHistory) (err error)")

	err = service.heatmapHistoryRepository.UpdateListHeatmapHistoryData(heatmapHistoryUpdate)

	if err != nil {
		logger.Slogger.Errorf("Error when update list heatmap history: %v", err)
	}

	return err
}

func (service *heatmapHistoryService) FindHeatmapHistory(boxID string, cameraID string, timestamp int64) (heatmapHistory model.HeatmapHistory, err error) {
	heatmapHistory, err = service.heatmapHistoryRepository.FindHeatmapHistory(boxID, cameraID, timestamp)

	if err != nil {
		logger.Slogger.Errorf("Error when get heatmap history: %v", err)
		return heatmapHistory, err
	}

	return heatmapHistory, err
}
