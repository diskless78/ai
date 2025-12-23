package db

import (
	"context"
	"errors"
	"fmt"
	"log"
	"notification-service/internal/config"

	"notification-service/internal/models"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Mongo struct {
	Client *mongo.Client
	DBName string
}

func NewMongo(ctx context.Context, uri, dbName string) (*Mongo, error) {
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}

	if err := client.Ping(ctx, nil); err != nil {
		return nil, err
	}

	return &Mongo{
		Client: client,
		DBName: dbName,
	}, nil
}

func (m *Mongo) Disconnect(ctx context.Context) {
	if err := m.Client.Disconnect(ctx); err != nil {
		log.Printf("Mongo disconnect error: %v", err)
	}
}

// SaveNotification lưu event vào collection "notification"
func (m *Mongo) SaveNotification(
	ctx context.Context,
	doc *models.Notification,
) (string, error) {
	cfg := config.Load()

	coll := m.Client.Database(m.DBName).
		Collection(cfg.NotificationCollection)

	// ghi vào database
	result, err := coll.InsertOne(ctx, doc)
	if err != nil {
		return "", err
	}

	// lấy _id
	notiID, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		return "", errors.New("failed to parse inserted id")
	}

	return notiID.Hex(), nil
}

// Lưu danh sách noti
func (m *Mongo) SaveListNotification(
	ctx context.Context,
	docs []models.Notification,
) ([]string, error) {
	cfg := config.Load()

	coll := m.Client.Database(m.DBName).
		Collection(cfg.NotificationCollection)

	// convert []*Notification -> []interface{}
	items := make([]interface{}, len(docs))
	for i, doc := range docs {
		items[i] = doc
	}

	result, err := coll.InsertMany(ctx, items)
	if err != nil {
		return nil, err
	}

	// lấy list _id
	ids := make([]string, 0, len(result.InsertedIDs))

	for _, id := range result.InsertedIDs {
		switch v := id.(type) {

		case primitive.ObjectID:
			ids = append(ids, v.Hex())

		case primitive.Binary:
			uuid, err := uuid.FromBytes(v.Data)
			if err != nil {
				return nil, err
			}
			ids = append(ids, uuid.String())

		default:
			return nil, fmt.Errorf("unsupported _id type: %T", id)
		}

	}

	return ids, nil
}

func (m *Mongo) GetCamera(ctx context.Context, cameraID string) (*models.Camera, error) {
	cfg := config.Load()
	coll := m.Client.Database(m.DBName).Collection(cfg.CameraCollection)

	var cam models.Camera
	err := coll.FindOne(ctx, bson.M{"id": cameraID}).Decode(&cam)
	if err != nil {
		return nil, err
	}

	return &cam, nil
}
