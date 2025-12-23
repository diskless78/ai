package models

import (
	"notification-service/internal/utils"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type IncomingEvent struct {
	// Nếu là thông báo chung thì không cần cam_id và zone_id và type == Info và nhận title và description để hiển thị cho client
	HasForAll   bool                   `json:"has_for_all"`
	Type        string                 `json:"type"`
	Status      string                 `json:"status"`
	CameraId    string                 `json:"cam_id"`
	ZoneId      string                 `json:"zone_id"`
	UserId      string                 `json:"user_id"`
	StoreIDs    []string               `bson:"store_ids" json:"store_ids"`
	Title       string                 `json:"title"`
	Description string                 `json:"description"`
	Template    string                 `json:"template"`
	Data        map[string]interface{} `json:"data"`
}

type EventPayload struct {
	BoxID                  string `json:"box_id" msgpack:"box_id"`
	CamID                  string `json:"cam_id" msgpack:"cam_id"`
	CamSnapshot            []byte `json:"cam_snapshot" msgpack:"cam_snapshot"`
	CustomInformationAbove string `json:"custom_information_above" msgpack:"custom_information_above"`
	FrameSnapshot          any    `json:"frame_snapshot" msgpack:"frame_snapshot"`

	InitPCTime    float64 `json:"init_pc_time" msgpack:"init_pc_time"`
	InitTimestamp float64 `json:"init_timestamp" msgpack:"init_timestamp"`

	Messages []MessageBlock `json:"messages" msgpack:"messages"`

	PayloadAuthor string `json:"payload_author" msgpack:"payload_author"`
	PayloadID     string `json:"payload_id" msgpack:"payload_id"`
	RunID         string `json:"run_id" msgpack:"run_id"`

	Timestamp    int64  `json:"timestamp" msgpack:"timestamp"`
	TimestampStr string `json:"timestamp_str" msgpack:"timestamp_str"`
}

type MessageBlock struct {
	FrameID        string         `json:"frame_id" msgpack:"frame_id"`
	FrameTimestamp int64          `json:"frame_timestamp" msgpack:"frame_timestamp"`
	Type           string         `json:"type" msgpack:"type"`
	Unit           string         `json:"unit" msgpack:"unit"`
	Content        []MessageEntry `json:"content" msgpack:"content"`
}

type MessageEntry struct {
	ID        string `json:"_id" msgpack:"_id"`
	Title     string `json:"title" msgpack:"title"`
	Message   string `json:"message" msgpack:"message"`
	Status    string `json:"status" msgpack:"status"`
	Timestamp int64  `json:"timestamp" msgpack:"timestamp"`

	Params   map[string]any  `json:"params" msgpack:"params"`
	Template MessageTemplate `json:"template" msgpack:"template"`
}

type MessageTemplate struct {
	Title   string `json:"title" msgpack:"title"`
	Message string `json:"message" msgpack:"message"`
}

type NotificationStatus string

const (
	StatusInfo     NotificationStatus = "info"
	StatusWarning  NotificationStatus = "warning"
	StatusCritical NotificationStatus = "critical"
)

// type NotificationType string

// const (
// 	ProductZoneOvercrowded  NotificationType = "product_zone_overcrowded"
// 	CheckoutDelay           NotificationType = "checkout_delay"
// 	LongQueueDetected       NotificationType = "long_queue_detected"
// 	UnattendedItemsDetected NotificationType = "unattended_items_detected"
// 	SmokeFireDetected       NotificationType = "smoke_fire_etected"
// 	TrafficInsight          NotificationType = "traffic_insight"

// 	// Thông báo
// 	Info     NotificationType = "info"
// 	Undefine NotificationType = "undefine"
// )

type Notification struct {
	ID      primitive.Binary `bson:"_id" json:"id"`
	Title   string           `bson:"title,omitempty" json:"title,omitempty"`
	Message string           `bson:"message,omitempty" json:"message,omitempty"`
	Image   *string          `bson:"image,omitempty" json:"image,omitempty"`
	// object embedded, thông tin data được gửi về kèm thông báo
	Params map[string]interface{} `bson:"params" json:"params"`

	Status NotificationStatus `bson:"status" json:"status"` // info | warning | critical
	// Type   NotificationType   `bson:"type" json:"type"`

	// danh sách user đã đọc
	UsersRead []string `bson:"users_read" json:"users_read"`
	// Danh sách user đã xoá thông báo
	UsersDelete []string `bson:"users_delete" json:"users_delete"`
	//  là thông báo cho tất cả người dùng
	HasForAll bool `bson:"has_for_all" json:"has_for_all"`

	// thông báo theo tenant (user của tenant nào được phép đọc thông báo này)
	TenantID *string `bson:"tenant_id,omitempty" json:"tenant_id,omitempty"`
	// thông báo cho riêng user này
	BoxID  string  `bson:"box_id,omitempty" json:"box_id,omitempty"`
	CamID  string  `bson:"cam_id,omitempty" json:"cam_id,omitempty"`
	UserId *string `bson:"user_id,omitempty" json:"user_id,omitempty"`
	// danh sách các cửa hàng được phép xem thông báo này
	StoreIDs []string `bson:"store_ids,omitempty" json:"store_ids,omitempty"`

	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time `bson:"updated_at" json:"updated_at"`
}

func NewNotification(payload map[string]interface{}) Notification {
	id := utils.NewUUIDv7ToBinary() // hoặc uuid.NewV7()

	title, _ := payload["title"].(string)
	message, _ := payload["message"].(string)
	boxID, _ := payload["box_id"].(string)
	camID, _ := payload["cam_id"].(string)
	storeIds, _ := payload["store_ids"].([]string)
	hasForAll, _ := payload["has_for_all"].(bool)

	return Notification{
		ID:      id,
		Title:   title,
		Message: message,
		Image:   utils.GetStringPtr(payload, "image"),
		BoxID:   boxID,
		CamID:   camID,
		// Type:     getType(payload["type"]),
		Params:   utils.GetMap(payload["params"]),
		Status:   getStatus(payload["status"]),
		TenantID: utils.GetStringPtr(payload, "tenant_id"),
		StoreIDs: storeIds,
		// UserId:      utils.GetStringPtr(payload, "user_id"),
		UsersRead:   []string{},
		UsersDelete: []string{},
		HasForAll:   hasForAll,
		CreatedAt:   payload["created_at"].(time.Time),
		UpdatedAt:   time.Now(),
	}
}

func getStatus(v interface{}) NotificationStatus {
	if s, ok := v.(string); ok {
		return NotificationStatus(s)
	}
	return StatusInfo
}

// func getType(v interface{}) NotificationType {
// 	if s, ok := v.(string); ok {
// 		return NotificationType(s)
// 	}
// 	return Undefine
// }
