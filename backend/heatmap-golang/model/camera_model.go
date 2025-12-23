package model

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
)

var (
	collectionNameCamera = ""
)

type CameraModel struct {
	ID         string   `json:"id" bson:"id"`
	BoxID      string   `json:"boxID" bson:"boxID"`
	CameraType string   `json:"cameraType" bson:"cameraType"`
	LinkStream string   `json:"link_stream" bson:"link_stream"`
	Module     []string `json:"module" bson:"module"`
	Name       string   `json:"name" bson:"name"`
	Status     bool     `json:"status" bson:"status"`
	UserID     string   `json:"userID" bson:"userID"`
	Area       string   `json:"area" bson:"area"`
}

type CameraRepositoryInterface interface {
	FindCameraByID(cameraID string) (CameraModel, error)
	FindCameraHaveModuleHeatmapByListBoxID(listBoxID []string) (listCamera []CameraModel, err error)
}

func NewCameraRepository(datastore *mongo.Database) CameraRepositoryInterface {
	collectionNameCamera = os.Getenv("CAMERA")
	return &MongoDatastore{
		db: datastore,
	}
}

func (datastore *MongoDatastore) FindCameraByID(cameraID string) (CameraModel, error) {

	cameraCollection := datastore.db.Collection(collectionNameCamera)
	filter := bson.M{
		"id": cameraID,
	}
	var camera CameraModel
	err := cameraCollection.FindOne(context.TODO(), filter).Decode(&camera)

	if err != nil {
		return CameraModel{}, err
	}

	return camera, nil
}

func (datastore *MongoDatastore) FindCameraHaveModuleHeatmapByListBoxID(listBoxID []string) (listCamera []CameraModel, err error) {
	collection := datastore.db.Collection(collectionNameCamera)

	filter := bson.M{
		"module": bson.M{
			"$in": []string{"hm"},
		},
		"boxID": bson.M{
			"$in": listBoxID,
		},
	}

	cursors, err := collection.Find(context.TODO(), filter, options.Find())

	if err != nil {
		return listCamera, err
	}

	for cursors.Next(context.TODO()) {
		var camera CameraModel

		err = cursors.Decode(&camera)

		if err != nil {
			return listCamera, err
		}

		listCamera = append(listCamera, camera)
	}

	return listCamera, nil
}
