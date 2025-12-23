package s3

import (
	"context"
	"io"
	"net/url"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Client struct {
	Minio *minio.Client
}

func NewMinioClient(
	endpoint string,
	accessKey string,
	secretKey string,
	region string,
	secure bool,
) (*Client, error) {
	mc, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: secure,
		Region: region,
	})
	if err != nil {
		return nil, err
	}

	return &Client{Minio: mc}, nil
}

func (c *Client) GetPresignedURL(
	ctx context.Context,
	bucket string,
	objectName string,
	expiresDays int,
) (string, error) {
	reqParams := make(url.Values)

	url, err := c.Minio.PresignedGetObject(
		ctx,
		bucket,
		objectName,
		time.Duration(expiresDays)*24*time.Hour,
		reqParams,
	)
	if err != nil {
		return "", err
	}

	return url.String(), nil
}

func (c *Client) UploadImage(
	ctx context.Context,
	bucket string,
	filename string,
	reader io.Reader,
	size int64,
	contentType string,
) error {
	// (optional) ensure bucket exists
	exists, err := c.Minio.BucketExists(ctx, bucket)
	if err != nil {
		return err
	}
	if !exists {
		if err := c.Minio.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}); err != nil {
			return err
		}
	}

	_, err = c.Minio.PutObject(
		ctx,
		bucket,
		filename,
		reader,
		size,
		minio.PutObjectOptions{
			ContentType: contentType,
		},
	)

	return err
}
