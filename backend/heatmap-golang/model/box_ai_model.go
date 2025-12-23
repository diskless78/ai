package model

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"os"
)

var (
	collectionNameBoxAI = ""
)

type BoxAIModel struct {
	ID           string   `json:"id" bson:"id"`
	IP           string   `json:"ip" bson:"ip"`
	IPVPN        string   `json:"ipVPN" bson:"ipVPN"`
	Module       []string `json:"module" bson:"module"`
	Name         string   `json:"name" bson:"name"`
	RegistedDate string   `json:"registedDate" bson:"registedDate"`
	Status       string   `json:"status" bson:"status"`
	UserID       string   `json:"userID" bson:"userID"`
}

type BoxRepositoryInterface interface {
	FindBoxByID(boxID string) (BoxAIModel, error)
}

func NewBoxRepository(datastore *mongo.Database) BoxRepositoryInterface {
	collectionNameBoxAI = os.Getenv("BOX_AI")
	return &MongoDatastore{
		db: datastore,
	}
}

func (datastore *MongoDatastore) FindBoxByID(boxID string) (boxAI BoxAIModel, err error) {
	collection := datastore.db.Collection(collectionNameBoxAI)

	filter := bson.M{
		"id": boxID,
	}

	err = collection.FindOne(context.TODO(), filter).Decode(&boxAI)

	return boxAI, err
}
