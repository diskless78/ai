package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config chứa toàn bộ cấu hình service
type Config struct {
	ENV string
	// Kafka
	KafkaBrokers      string
	KafkaTopic        string
	KafkaGroupID      string
	KafkaMaxWorkers   int
	KafkaCertLocation string
	KafkaKeyLocation  string
	KafkaCaRoot       string

	// HTTP server
	ServicePort string

	// MongoDB
	DBName                 string
	ConnectionString       string
	NotificationCollection string
	CameraCollection       string

	// Onetime token key
	InternalSecretKey string
	// Notification gateway
	NotificationUrl      string
	NotificationSendPath string

	// minio
	MinioHost               string
	MinioAccessKey          string
	MinioSecretKey          string
	MinioRegion             string
	MinioNotificationBucket string
}

// Load đọc env và trả về Config
func Load() *Config {
	// Load .env nếu có
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env")
	}

	return &Config{
		ENV: getenv("ENV", "PROD"),
		// Kafka
		KafkaBrokers:      getenv("KAFKA_BROKERS", "localhost:9094"),
		KafkaTopic:        getenv("KAFKA_TOPIC", "notification-events"),
		KafkaGroupID:      getenv("KAFKA_GROUP_ID", "notification-service"),
		KafkaMaxWorkers:   getenvInt("KAFKA_MAX_WORKERS", 200),
		KafkaCertLocation: getenv("CA_CERT", ""),
		KafkaKeyLocation:  getenv("CA_KEY", ""),
		KafkaCaRoot:       getenv("CA_ROOT", ""),

		// HTTP server
		ServicePort: getenv("SERVICE_PORT", "8080"),

		// MongoDB
		DBName:                 getenv("DB_NAME", "notifications"),
		ConnectionString:       getenv("MONGO_URI", "mongodb://localhost:27017"),
		NotificationCollection: getenv("NOTIFICATION_COLLECTION", "notifications"),
		CameraCollection:       getenv("CAMERA_COLLECTION", "camera"),

		InternalSecretKey:    getenv("INTERNAL_SECRET_KEY", "key"),
		NotificationUrl:      getenv("NOTIFICATION_URL", "http://localhost:8000"),
		NotificationSendPath: getenv("NOTIFICATION_SEND_PATH", "api/v1/notifications/send"),

		// Minio
		MinioHost:               getenv("MINIO_HOST", "192.168.100.254:9000"),
		MinioAccessKey:          getenv("MINIO_ACCESS_KEY", "hoangnt"),
		MinioSecretKey:          getenv("MINIO_SECRET_KEY", "cxview2023"),
		MinioRegion:             getenv("MINIO_REGION", "ap-east-1"),
		MinioNotificationBucket: getenv("MINIO_NOTIFICATION_BUCKET", "notifications"),
	}
}

// getenv trả về default nếu key không tồn tại
func getenv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

// parse int với default
func getenvInt(key string, def int) int {
	if v := os.Getenv(key); v != "" {
		if iv, err := strconv.Atoi(v); err == nil {
			return iv
		}
		log.Printf("Invalid value for %s: %s, using default %d", key, v, def)
	}
	return def
}
