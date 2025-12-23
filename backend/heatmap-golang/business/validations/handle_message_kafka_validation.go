package validations

import (
	"errors"
	"fmt"
	"github.com/sjsdfg/common-lang-in-go/StringUtils"
	"go.mongodb.org/mongo-driver/mongo"
	"heatmap/common/message"
	"heatmap/model"
	"heatmap/utils/logger"
	"strings"
)

type HandleMessageKafkaValidationInterface interface {
	Validate(boxID string, cameraID string) error
}

type handleMessageKafkaValidation struct {
	boxRepository    model.BoxRepositoryInterface
	cameraRepository model.CameraRepositoryInterface
}

func NewHandleMessageKafkaValidation(
	boxRepository model.BoxRepositoryInterface,
	cameraRepository model.CameraRepositoryInterface) HandleMessageKafkaValidationInterface {
	return &handleMessageKafkaValidation{
		boxRepository:    boxRepository,
		cameraRepository: cameraRepository,
	}
}
func (validation *handleMessageKafkaValidation) Validate(boxID string, cameraID string) error {
	logger.Slogger.Info("Start func (validation *handleMessageKafkaValidation) Validate(boxID string, cameraID string) error")

	if StringUtils.IsEmpty(strings.TrimSpace(boxID)) {
		logger.Slogger.Error("Box id is empty")
		return errors.New(message.BoxIDIsEmpty)
	}

	_, err := validation.boxRepository.FindBoxByID(boxID)

	if err != nil && err == mongo.ErrNoDocuments {
		logger.Slogger.Error("Box id not found")
		return errors.New(message.BoxIDNotFound)
	}

	if err != nil {
		logger.Slogger.Errorf("Error: %v", err)
		return err
	}

	if StringUtils.IsEmpty(strings.TrimSpace(cameraID)) {
		logger.Slogger.Error("Camera id is empty")
		return errors.New(message.CameraIDIsEmpty)
	}

	camera, err := validation.cameraRepository.FindCameraByID(cameraID)
	if err != nil && err == mongo.ErrNoDocuments {
		logger.Slogger.Errorf("Not found camera id: %s", cameraID)
		return errors.New(message.CameraIDNotFound)
	}

	if err != nil {
		logger.Slogger.Errorf("Error: %v", err)
		return err
	}

	if camera.BoxID != boxID {
		errorMessage := fmt.Sprintf("box: %s not include camera: %s", boxID, cameraID)
		logger.Slogger.Errorf(errorMessage)
		return errors.New(errorMessage)
	}

	return nil
}
