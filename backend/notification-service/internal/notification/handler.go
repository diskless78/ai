package notification

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"notification-service/internal/auth"
	"notification-service/internal/config"
	"notification-service/internal/db"
	"notification-service/internal/models"
	"notification-service/internal/s3"

	"github.com/google/uuid"
	"github.com/vmihailenco/msgpack/v5"
)

type Handler struct {
	mongo       *db.Mongo
	minioClient *s3.Client
}

type SendNotificationReq struct {
	NotiIDs []string `json:"noti_ids"`
}

func NewHandler(mongo *db.Mongo, minioClient *s3.Client) *Handler {
	return &Handler{
		mongo:       mongo,
		minioClient: minioClient,
	}
}

func (h *Handler) HandleMessage(key, value []byte) error {
	ctx := context.Background()

	// Lấy config
	cfg := config.Load()

	var payload models.EventPayload
	// Kiểm tra payload
	if err := msgpack.Unmarshal(value, &payload); err != nil {
		log.Printf("msgpack unmarshal failed: %v", err)
		return err
	}

	// Get camera by cam_id
	camera, err := h.mongo.GetCamera(ctx, payload.CamID)
	log.Printf("camera: %v", camera)

	if err != nil {
		log.Printf("[Camera] error:  %s", err)
	}

	// Lấy user_id từ camera info
	var tenantId any = nil
	var storeIds []string

	if camera != nil {
		tenantId = camera.UserID
		storeIds = camera.ListGroup
	}

	log.Printf("tenantId: %v", tenantId)

	// Lấy các noti từ messages
	listNotification := []models.Notification{}

	filename := uuid.Must(uuid.NewV7()).String() + ".jpg"

	imgBytes := payload.CamSnapshot
	log.Printf("snapshot size: %d bytes", len(imgBytes))

	image := ""

	// Upload ảnh lên minio
	if len(imgBytes) > 0 {
		go func(data []byte, name string) {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			err := h.minioClient.UploadImage(
				ctx,
				cfg.MinioNotificationBucket,
				name,
				bytes.NewReader(data),
				int64(len(data)),
				"image/jpeg",
			)

			if err != nil {
				log.Printf("[WARN] upload image failed: %v", err)
			}

		}(imgBytes, filename)

		// nếu upload thành công thì ghi file name
		image = filename
	}

	// lấy danh sách noti từ Messages
	for _, message := range payload.Messages {
		for _, content := range message.Content {
			// lấy create
			createdAt := time.Unix(content.Timestamp, 0)

			item := map[string]any{
				"box_id":      payload.BoxID,
				"cam_id":      payload.CamID,
				"store_ids":   storeIds,
				"image":       image,
				"tenant_id":   tenantId,
				"has_for_all": tenantId == nil,
				"title":       content.Template.Title,
				"message":     content.Template.Message,
				"params":      content.Params,
				"status":      mapStatus(content.Status),
				"created_at":  createdAt,
			}

			noti := models.NewNotification(item)

			listNotification = append(listNotification, noti)
		}
	}

	if len(listNotification) == 0 {
		log.Println("No notifications to save")
		return nil
	}

	// lưu vào db và gửi qua noti service
	if err := SendListNoti(ctx, h.mongo, listNotification); err != nil {
		log.Printf("Save notification error: %v", err)
		return err
	}

	return nil
}

func SendListNoti(ctx context.Context, mongo *db.Mongo, notifications []models.Notification) error {
	// Lấy config
	cfg := config.Load()
	log.Printf("start save list notification")

	// lưu vào db
	ids, err := mongo.SaveListNotification(ctx, notifications)
	if err != nil {
		log.Printf("save list notification error: %v", err)
		return err
	}

	// Xử lý gửi notification
	body := SendNotificationReq{
		NotiIDs: ids,
	}

	// lấy url
	url := strings.TrimRight(cfg.NotificationUrl, "/") +
		"/" +
		strings.TrimLeft(cfg.NotificationSendPath, "/")

	// http body
	jsonBody, _ := json.Marshal(body)
	req, _ := http.NewRequest(
		http.MethodPost,
		url,
		bytes.NewBuffer(jsonBody),
	)

	// Headers
	token, _ := auth.CreateToken("consume-noti", "noti", cfg.InternalSecretKey, 60)

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set(
		"X-Internal-Token",
		token,
	)

	// tạo client
	client := &http.Client{}
	// gửi
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	// lấy response
	respBody, _ := io.ReadAll(resp.Body)

	fmt.Println("Status:", resp.Status)
	fmt.Println("Body:", string(respBody))
	log.Printf("Saved %v notifications", ids)

	return nil
}

func mapStatus(status string) string {
	switch status {
	case "WARN":
		return string(models.StatusWarning)
	case "OK":
		return string(models.StatusInfo)
	case "ALERT":
		return string(models.StatusCritical)
	default:
		return string(models.StatusInfo)
	}
}

func SaveJSONToFile(path string, data any) error {
	b, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, b, 0644)
}
