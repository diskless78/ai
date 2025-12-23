package validations

import (
	"errors"
	"github.com/sjsdfg/common-lang-in-go/StringUtils"
	"heatmap/common/message"
	"heatmap/model"
	"heatmap/utils"
	"heatmap/utils/logger"
)

type ReportHeatmapByDateValidationInterface interface {
	Validate(groupID string, dateStart string, dateEnd string) error
}

type reportHeatmapByDate struct {
	groupRepository model.GroupRepositoryInterface
}

func NewReportHeatmapByDateValidation(
	groupRepository model.GroupRepositoryInterface,
) ReportHeatmapByDateValidationInterface {
	return &reportHeatmapByDate{
		groupRepository: groupRepository,
	}
}

func (validation *reportHeatmapByDate) Validate(groupID string, dateStart string, dateEnd string) error {
	logger.Slogger.Info("Start func (r reportHeatmapByDate) Validate(dateStart string, dateEnd string) error")

	if !utils.IsNumeric(dateStart) || !utils.IsNumeric(dateEnd) {
		logger.Slogger.Errorf("Invalid timestamp date start: %s, date end: %s", dateStart, dateEnd)
		return errors.New(message.DateTimeInputInvalid)
	}

	if StringUtils.IsNotEmpty(groupID) {
		_, err := validation.groupRepository.FindGroupByID(groupID)

		if err != nil {
			logger.Slogger.Errorf("Error when find group by id: %v", err)
			return err
		}
	}

	return nil
}
