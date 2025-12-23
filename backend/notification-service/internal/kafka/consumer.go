package kafka

import (
	"fmt"
	"log"
	"notification-service/internal/config"
	"notification-service/internal/utils"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

type HandlerFunc func(key, value []byte) error

type Consumer struct {
	c          *kafka.Consumer
	topic      string
	handler    HandlerFunc
	workerPool chan struct{} // giới hạn số worker đồng thời
}

func NewConsumer(brokers, topic, groupID string, handler HandlerFunc, maxWorkers int, caRoot string, cert string, key string) (*Consumer, error) {
	fmt.Printf("KAFKA_BROKERS: %v | Topic: %s | Group: %s | MaxWorkers: %d\n", brokers, topic, groupID, maxWorkers)
	// Số lượng worker tối đa được dùng tại 1 thời điểm
	if maxWorkers <= 0 {
		maxWorkers = 100
	}

	config := &kafka.ConfigMap{
		"bootstrap.servers":        brokers,
		"group.id":                 groupID,
		"auto.offset.reset":        "earliest",
		"session.timeout.ms":       6000,
		"heartbeat.interval.ms":    2000,
		"max.poll.interval.ms":     300000,
		"broker.address.family":    "v4",
		"security.protocol":        "SSL",
		"ssl.ca.location":          caRoot,
		"ssl.certificate.location": cert,
		"ssl.key.location":         key,
	}

	c, err := kafka.NewConsumer(config)
	if err != nil {
		return nil, err
	}

	err = c.Subscribe(topic, nil)
	if err != nil {
		c.Close()
		return nil, err
	}

	return &Consumer{
		c:          c,
		topic:      topic,
		handler:    handler,
		workerPool: make(chan struct{}, maxWorkers),
	}, nil
}

func (c *Consumer) Start() error {
	log.Println("Kafka consumer started, waiting for messages...")
	// Lấy config từ env
	cfg := config.Load()

	for {
		msg, err := c.c.ReadMessage(-1)

		if cfg.ENV == "DEV" {
			time.Sleep(60 * time.Second)
		}

		if err != nil {
			if kafkaErr, ok := err.(kafka.Error); ok {
				if kafkaErr.IsRetriable() {
					log.Printf("Temporary Kafka error (retriable): %v, retrying...", err)
					continue
				}
				if kafkaErr.Code() == kafka.ErrAllBrokersDown {
					log.Printf("All brokers down: %v, retrying in 5s...", err)
					continue
				}
			}
			log.Printf("Kafka read error: %v", err)
			continue
		}

		// Acquire worker slot (block nếu đã đầy)
		c.workerPool <- struct{}{}

		utils.SafeGo(func() {
			defer func() { <-c.workerPool }() // release slot

			defer func() {
				if r := recover(); r != nil {
					log.Printf("[PANIC IN HANDLER] %v", r)
				}
			}()

			if err := c.handler(msg.Key, msg.Value); err != nil {
				log.Printf("Handler error for message %s: %v", string(msg.Key), err)
				// Không requeue, đã commit rồi → chấp nhận mất (hoặc dùng DLQ sau)
			}
		})

		// Commit sau khi đã giao việc (fire-and-forget nhưng vẫn commit)
		if _, err := c.c.CommitMessage(msg); err != nil {
			log.Printf("Commit failed: %v", err)
		}
	}
}

func (c *Consumer) Close() error {
	if c.c != nil {
		_ = c.c.Unsubscribe()
		return c.c.Close()
	}
	return nil
}
