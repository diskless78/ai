package services

import (
	"heatmap/model"
	"heatmap/utils/logger"
)

type CameraServiceInterface interface {
	GetListCameraModuleHMByListBoxID(listBoxID []string) (listCameraID []string, err error)
	GetCameraByID(cameraID string) (camera model.CameraModel, err error)
}

type cameraService struct {
	cameraRepository model.CameraRepositoryInterface
}

func (service *cameraService) GetCameraByID(cameraID string) (camera model.CameraModel, err error) {
	logger.Slogger.Info("Start func (service *cameraService) GetCameraByID(cameraID string) (camera model.CameraModel, err error)")

	camera, err = service.cameraRepository.FindCameraByID(cameraID)
	if err != nil {
		logger.Slogger.Errorf("Error when get camera: %v", err)
		return camera, err
	}

	return camera, nil
}

func NewCameraService(cameraRepository model.CameraRepositoryInterface) CameraServiceInterface {
	return &cameraService{
		cameraRepository: cameraRepository,
	}
}

func (service *cameraService) GetListCameraModuleHMByListBoxID(listBoxID []string) (listCameraID []string, err error) {
	logger.Slogger.Info("Start func (c cameraService) GetListCameraModuleHMByListBoxID(listBoxID []string) (listCameraID []string, err error)")

	listCamera, err := service.cameraRepository.FindCameraHaveModuleHeatmapByListBoxID(listBoxID)
	if err != nil {
		logger.Slogger.Errorf("Error when get list camera: %v", err)
		return listCameraID, err
	}

	for _, camera := range listCamera {
		listCameraID = append(listCameraID, camera.ID)
	}

	return listCameraID, err
}
