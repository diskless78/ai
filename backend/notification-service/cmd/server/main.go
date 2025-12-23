package main

import (
	"context"
	"log"
	"notification-service/internal/config"
	"notification-service/internal/db"
	"notification-service/internal/kafka"
	"notification-service/internal/middleware"
	"notification-service/internal/notification"
	"notification-service/internal/s3"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Global application panic fallback
	defer func() {
		if r := recover(); r != nil {
			log.Printf("[FATAL PANIC] service crashed: %v", r)
		}
	}()

	// Lấy config từ env
	cfg := config.Load()
	// Tạo context cho app
	ctx := context.Background()

	// MongoDB
	mongo, mongoErr := db.NewMongo(ctx, cfg.ConnectionString, cfg.DBName)
	if mongoErr != nil {
		log.Fatalf("Mongo init error: %v", mongoErr)
	}
	defer mongo.Disconnect(ctx)

	// Minio client
	s3Client, s3Err := s3.NewMinioClient(
		cfg.MinioHost,
		cfg.MinioAccessKey,
		cfg.MinioSecretKey,
		cfg.MinioRegion,
		cfg.ENV != "DEV",
	)
	if s3Err != nil {
		log.Fatalf("Minio init error: %v", s3Err)
	}

	// Notification handler (kafka -> mongo -> send to notification api)
	notifier := notification.NewHandler(mongo, s3Client)

	// Kafka Consumer
	consumer, kafkaErr := kafka.NewConsumer(cfg.KafkaBrokers, cfg.KafkaTopic, cfg.KafkaGroupID, notifier.HandleMessage, cfg.KafkaMaxWorkers, cfg.KafkaCaRoot, cfg.KafkaCertLocation, cfg.KafkaKeyLocation)
	if kafkaErr != nil {
		log.Fatalf("Failed to create kafka consumer: %v", kafkaErr)
	}
	defer consumer.Close()

	go func() {
		log.Println("Starting Kafka consumer goroutine...")
		if err := consumer.Start(); err != nil {
			log.Printf("Kafka consumer stopped with error: %v", err)
			log.Println("Consumer will NOT retry automatically.")
		}
	}()

	// dùng fiber để thêm health check
	app := fiber.New()

	// Global Recover cho HTTP
	app.Use(middleware.Recover())

	BASE_URL := "/api/v1"

	// Health check
	app.Get(BASE_URL+"/health", func(c *fiber.Ctx) error {
		return c.SendString("ok")
	})

	log.Printf("Service listening on :%s", cfg.ServicePort)

	if err := app.Listen("0.0.0.0:" + cfg.ServicePort); err != nil {
		log.Fatalf("Fiber server error: %v", err)
	}

}
