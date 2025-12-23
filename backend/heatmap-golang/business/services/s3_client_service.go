package services

import (
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"heatmap/utils/logger"
	"os"
	"time"
)

type S3ClientServiceInterface interface {
	GetPresignedURLCameraImage(cameraID string) (presignedURL string, err error)
}

type s3ClientService struct {
	s3Client *s3.S3

	s3Bucket string
}

func NewS3ClientService(s3Client *s3.S3) S3ClientServiceInterface {

	return &s3ClientService{
		s3Client: s3Client,
		s3Bucket: os.Getenv("S3_CAMERA_BUCKET"),
	}
}

func (service *s3ClientService) GetPresignedURLCameraImage(cameraID string) (presignedURL string, err error) {
	queryParam := &s3.GetObjectInput{
		Bucket: aws.String(service.s3Bucket),
		Key:    aws.String(fmt.Sprintf("%s.jpg", cameraID)),
	}

	request, _ := service.s3Client.GetObjectRequest(queryParam)

	presignedURL, err = request.Presign(30 * time.Minute)

	if err != nil {
		logger.Slogger.Errorf("Error when get presigned URL: %v", err)
		return presignedURL, err
	}

	return presignedURL, err
}
