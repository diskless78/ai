package model

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
)

var (
	collectionNameGroup = ""
)

type GroupModel struct {
	ID      string   `json:"id" bson:"id"`
	FaceID  string   `json:"faceID" bson:"faceID"`
	ListBox []string `json:"listBox" bson:"listBox"`
	Name    string   `json:"name" bson:"name"`
	Status  string   `json:"status" bson:"status"`
	UserID  string   `json:"userid" bson:"userid"`
}

type GroupRepositoryInterface interface {
	FindListGroupByUserID(userID string) (listGroup []GroupModel, err error)
	FindGroupByID(groupID string) (GroupModel, error)
	FindGroupByIDAndUserID(groupID string, userID string) (group GroupModel, err error)
}

func NewGroupRepository(datastore *mongo.Database) GroupRepositoryInterface {
	collectionNameGroup = os.Getenv("GROUP")
	return &MongoDatastore{
		db: datastore,
	}
}

func (datastore *MongoDatastore) FindListGroupByUserID(userID string) (listGroup []GroupModel, err error) {

	groupCollection := datastore.db.Collection(collectionNameGroup)

	filter := bson.M{
		"userid": userID,
	}
	listGroupCursor, err := groupCollection.Find(context.TODO(), filter, options.Find())

	if err != nil {
		return nil, err
	}

	for listGroupCursor.Next(context.TODO()) {
		var group GroupModel
		err = listGroupCursor.Decode(&group)
		if err != nil {
			return listGroup, err
		}
		listGroup = append(listGroup, group)
	}

	return listGroup, nil
}

func (datastore *MongoDatastore) FindGroupByID(groupID string) (GroupModel, error) {

	groupCollection := datastore.db.Collection(collectionNameGroup)

	filter := bson.M{
		"id": groupID,
	}
	var group GroupModel
	err := groupCollection.FindOne(context.TODO(), filter).Decode(&group)

	if err != nil {
		return GroupModel{}, err
	}

	return group, nil
}

func (datastore *MongoDatastore) FindGroupByIDAndUserID(groupID string, userID string) (group GroupModel, err error) {

	groupCollection := datastore.db.Collection(collectionNameGroup)

	filter := bson.M{
		"id":     groupID,
		"userid": userID,
	}
	err = groupCollection.FindOne(context.TODO(), filter).Decode(&group)

	if err != nil {
		return GroupModel{}, err
	}

	return group, nil
}
