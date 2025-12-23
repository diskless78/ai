package controller

import (
	"github.com/gin-gonic/gin"
	"heatmap/business/services"
	"heatmap/business/validations"
	"heatmap/server"
	"heatmap/utils/logger"
)

type ReportHeatmapByDateControllerInterface interface {
	GetReportHeatmapByDate(c *gin.Context)
}

type reportHeatmapByDateController struct {
	reportHeatmapByDateValidation validations.ReportHeatmapByDateValidationInterface
	reportHeatmapByDateService    services.ReportHeatmapByDateServiceInterface
}

func NewReportHeatmapByDateController(
	reportHeatmapByDateValidation validations.ReportHeatmapByDateValidationInterface,
	reportHeatmapByDateService services.ReportHeatmapByDateServiceInterface,
) ReportHeatmapByDateControllerInterface {
	return &reportHeatmapByDateController{
		reportHeatmapByDateValidation: reportHeatmapByDateValidation,
		reportHeatmapByDateService:    reportHeatmapByDateService,
	}
}

func (controller *reportHeatmapByDateController) GetReportHeatmapByDate(c *gin.Context) {
	logger.Slogger.Info("Start func (r reportHeatmapByDateController) GetReportHeatmapByDate(c *gin.Context)")
	dateStart := c.Request.URL.Query().Get("dateStart")
	dateEnd := c.Request.URL.Query().Get("dateEnd")
	groupID := c.Request.URL.Query().Get("groupID")
	isCompare := c.Request.URL.Query().Get("compare")

	err := controller.reportHeatmapByDateValidation.Validate(groupID, dateStart, dateEnd)
	if err != nil {
		logger.Slogger.Errorf("Validation error: %v", err)
		server.BadRequest(c, err.Error())
		return
	}

	controller.reportHeatmapByDateService.SetContext(c)
	listHeatmapResponse, err := controller.reportHeatmapByDateService.GetReportHeatmapByDate(dateStart, dateEnd, groupID, isCompare)

	if err != nil {
		logger.Slogger.Errorf("Error when get list heatmap response: %v", listHeatmapResponse)
		server.InternalServerError(c, err.Error())
	}

	server.Data(c, listHeatmapResponse)
}
