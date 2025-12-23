package services

import (
	"github.com/gin-gonic/gin"
	"github.com/sjsdfg/common-lang-in-go/Int64Utils"
	"heatmap/common/constant"
	"heatmap/common/pojo"
	"heatmap/model"
	"heatmap/utils/logger"
)

type ReportHeatmapByDateServiceInterface interface {
	GetReportHeatmapByDate(dateStart string, dateEnd string, groupID string, isCompare string) (listHeatmapResponse []pojo.HeatmapResponse, err error)
	SetContext(c *gin.Context)
}

type reportHeatmapByDateService struct {
	boxService               BoxServiceInterface
	cameraService            CameraServiceInterface
	heatmapHistoryRepository model.HeatmapHistoryRepositoryInterface
	s3ClientService          S3ClientServiceInterface

	context *gin.Context
}

func NewReportHeatmapByDateService(
	boxService BoxServiceInterface,
	cameraService CameraServiceInterface,
	heatmapHistoryRepository model.HeatmapHistoryRepositoryInterface,
	s3ClientService S3ClientServiceInterface,
) ReportHeatmapByDateServiceInterface {
	return &reportHeatmapByDateService{
		boxService:               boxService,
		cameraService:            cameraService,
		heatmapHistoryRepository: heatmapHistoryRepository,
		s3ClientService:          s3ClientService,
	}
}

func (service *reportHeatmapByDateService) SetContext(c *gin.Context) {
	service.context = c
}

func (service *reportHeatmapByDateService) GetReportHeatmapByDate(dateStart string, dateEnd string, groupID string, isCompare string) (listHeatmapResponse []pojo.HeatmapResponse, err error) {
	logger.Slogger.Infof("Start func (r reportHeatmapByDateService) GetReportHeatmapByDate(dateStart string, dateEnd string, groupID string, isCompare string) (err error)")

	userID := service.context.GetString(constant.UserID)

	listBoxID, err := service.boxService.GetListBoxIDByGroupID(groupID, userID)

	if err != nil {
		logger.Slogger.Errorf("Error when get list box id: %v", err)
		return listHeatmapResponse, err
	}

	listCameraID, err := service.cameraService.GetListCameraModuleHMByListBoxID(listBoxID)
	if err != nil {
		logger.Slogger.Errorf("Error when get list camera: %v", err)
	}

	dateEndInt64 := Int64Utils.ValueOf(dateEnd) + constant.TotalSeconADay - 1

	for _, cameraID := range listCameraID {
		listHeatmapData, maxTotalSecond, err := service.processHeatmapCoordinate(cameraID, Int64Utils.ValueOf(dateStart), dateEndInt64, isCompare)

		if err != nil {
			logger.Slogger.Errorf("Error when process heat map data: %v", err)
			return listHeatmapResponse, err
		}

		presignedURL, err := service.s3ClientService.GetPresignedURLCameraImage(cameraID)
		if err != nil {
			logger.Slogger.Errorf("Error when get presignedURL: %v", err)
			return listHeatmapResponse, err
		}

		heatmapResponse := pojo.HeatmapResponse{
			ListHeatmapData: listHeatmapData,
			Max:             maxTotalSecond,
			Min:             0,
			URLImage:        presignedURL,
			CameraID:        cameraID,
		}

		listHeatmapResponse = append(listHeatmapResponse, heatmapResponse)
	}

	return listHeatmapResponse, err
}

func (service *reportHeatmapByDateService) processHeatmapCoordinate(
	cameraID string, dateStart int64,
	dateEnd int64, isCompare string,
) (listHeatmapDataResponse []pojo.HeatmapData, maxTotalSecond int64, err error) {
	camera, err := service.cameraService.GetCameraByID(cameraID)
	if err != nil {
		logger.Slogger.Errorf("Error when get camera: %v", err)
		return listHeatmapDataResponse, maxTotalSecond, err
	}
	cameraType := camera.CameraType

	maxTotalSecond = 10

	logger.Slogger.Infof("Camera: %s, dateStart: %s --> dateEnd: %s, Camera Type: %s", cameraID, dateStart, dateEnd, cameraType)

	widthPointFishEye := 9.5
	heightPointFishEye := 11.5666

	widthPointNormal := 9.5
	heightPointNormal := 11.6666

	radiusFishEye := float64(14)
	radiusNormal := float64(14)

	if isCompare == "true" {
		widthPointFishEye = 5.3088
		heightPointFishEye = 6.4636
		radiusFishEye = 7.8

		widthPointNormal = 5.1088
		heightPointNormal = 7.1
		radiusNormal = 7
	}

	listHeatmapData, err := service.heatmapHistoryRepository.AggregationTotalDwellTimeByCamera(cameraID, dateStart, dateEnd)

	if err != nil {
		logger.Slogger.Errorf("Error when get list heatmap data: %v", err)
		return listHeatmapDataResponse, maxTotalSecond, err
	}

	if listHeatmapData == nil {
		listHeatmapDataResponse = make([]pojo.HeatmapData, 0)
		return listHeatmapDataResponse, maxTotalSecond, nil
	}
	for _, heatmapData := range listHeatmapData {
		if heatmapData.DwellTime > maxTotalSecond {
			maxTotalSecond = heatmapData.DwellTime
		}
		x := float64(heatmapData.Index[0])
		y := float64(heatmapData.Index[1])

		if cameraType == constant.CameraTypeFishEye {
			pointX := widthPointFishEye*x + widthPointFishEye/2
			pointY := heightPointFishEye*y + heightPointFishEye/2
			value := heatmapData.DwellTime

			heatmapDataResponse := pojo.HeatmapData{
				X:      int64(pointX),
				Y:      int64(pointY),
				Value:  value,
				Radius: radiusFishEye,
			}
			listHeatmapDataResponse = append(listHeatmapDataResponse, heatmapDataResponse)
		} else {
			pointX := widthPointNormal*x + widthPointNormal/2
			pointY := heightPointNormal*y + heightPointNormal/2
			value := heatmapData.DwellTime

			heatmapDataResponse := pojo.HeatmapData{
				X:      int64(pointX),
				Y:      int64(pointY),
				Value:  value,
				Radius: radiusNormal,
			}
			listHeatmapDataResponse = append(listHeatmapDataResponse, heatmapDataResponse)
		}
	}

	return listHeatmapDataResponse, maxTotalSecond, nil
}
