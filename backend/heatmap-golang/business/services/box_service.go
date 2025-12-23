package services

import (
	"github.com/sjsdfg/common-lang-in-go/StringUtils"
	"heatmap/model"
	"heatmap/utils/logger"
	"strings"
)

type BoxServiceInterface interface {
	GetListBoxIDByGroupID(groupID string, userID string) (listGroupID []string, err error)
}

type boxService struct {
	groupRepository model.GroupRepositoryInterface
}

func NewBoxService(groupRepository model.GroupRepositoryInterface) BoxServiceInterface {
	return &boxService{
		groupRepository: groupRepository,
	}
}

func (service *boxService) GetListBoxIDByGroupID(groupID string, userID string) (listBoxID []string, err error) {
	logger.Slogger.Info("Start func (service *boxService) GetListBoxIDByGroupID(groupID string, userID string) (listBoxID []string, err error)")

	if StringUtils.IsEmpty(strings.TrimSpace(groupID)) {
		listGroup, err := service.groupRepository.FindListGroupByUserID(userID)
		if err != nil {
			logger.Slogger.Errorf("Error when find list group by user id: %v", err)
			return listBoxID, err
		}
		for _, group := range listGroup {
			for _, boxID := range group.ListBox {
				listBoxID = append(listBoxID, boxID)
			}
		}
	} else {
		group, err := service.groupRepository.FindGroupByIDAndUserID(groupID, userID)

		if err != nil {
			logger.Slogger.Errorf("Error when FindGroupByIDAndUserID: %v", err)
			return listBoxID, err
		}

		for _, boxID := range group.ListBox {
			listBoxID = append(listBoxID, boxID)
		}
	}

	return listBoxID, nil
}
