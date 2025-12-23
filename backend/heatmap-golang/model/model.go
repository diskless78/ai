package model

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
	"sync"
)

type DB struct {
	*mongo.Database
}

type MongoDatastore struct {
	db *mongo.Database
}

func (datastore *MongoDatastore) GetDB() *mongo.Database {
	return datastore.db
}

func NewDatastore() *MongoDatastore {

	var mongoDataStore *MongoDatastore
	db := connect()
	if db != nil {
		mongoDataStore = new(MongoDatastore)
		mongoDataStore.db = db
		return mongoDataStore
	}

	return nil
}

func connect() *mongo.Database {
	var connectOnce sync.Once
	var db *mongo.Database
	connectOnce.Do(func() {
		db = connectToMongo()
	})

	return db
}

func connectToMongo() *mongo.Database {
	mongoServer := os.Getenv("MONGO_HOST") + ":" + os.Getenv("MONGO_PORT")
	mongoUser := os.Getenv("MONGO_USER")
	mongoPassword := os.Getenv("MONGO_PWD")
	mongoAuthDB := os.Getenv("MONGODB_AUTH_SOURCE")
	mongoAddress := fmt.Sprintf("mongodb://%s:%s@%s/?authSource=%s", mongoUser, mongoPassword, mongoServer, mongoAuthDB)

	clientOptions := options.Client().ApplyURI(mongoAddress)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		panic(err)
	}
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		panic(err)
	}
	dataBaseName := os.Getenv("MONGODB_NAME")
	DB := client.Database(dataBaseName)

	return DB
}
