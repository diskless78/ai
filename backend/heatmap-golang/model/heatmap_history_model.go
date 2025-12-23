package model

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
)

var (
	collectionHeatmapHistory = ""
)

type HeatmapHistoryData struct {
	Index     []int64 `bson:"index"`
	DwellTime int64   `bson:"dwellTime"`
}

type HeatmapHistory struct {
	BoxID                  string               `bson:"boxID"`
	CameraID               string               `bson:"cameraID"`
	Timestamp              int64                `bson:"timestamp"`
	CameraType             string               `bson:"cameraType"`
	ListHeatmapHistoryData []HeatmapHistoryData `bson:"data"`
}

type HeatmapHistoryRepositoryInterface interface {
	FindHeatmapHistory(boxID string, cameraID string, timestamp int64) (heatmapHistory HeatmapHistory, err error)
	InsertHeatmapHistory(heatmapHistoryInsert HeatmapHistory) (err error)
	UpdateListHeatmapHistoryData(heatmapHistoryUpdate HeatmapHistory) (err error)
	FindListHeatmapHistoryByCameraID(cameraID string, dateStart int64, dateEnd int64) (listHeatmapHistory []HeatmapHistory, err error)
	AggregationTotalDwellTimeByCamera(cameraID string, dateStart int64, dateEnd int64) (listHeatmapHistoryData []HeatmapHistoryData, err error)
}

func NewHeatmapHistoryRepository(datastore *mongo.Database) HeatmapHistoryRepositoryInterface {
	collectionHeatmapHistory = os.Getenv("HEATMAP_HISTORY")
	return &MongoDatastore{
		db: datastore,
	}
}

func (datastore *MongoDatastore) FindHeatmapHistory(boxID string, cameraID string, timestamp int64) (heatmapHistory HeatmapHistory, err error) {
	collection := datastore.db.Collection(collectionHeatmapHistory)

	filter := bson.M{
		"boxID":     boxID,
		"cameraID":  cameraID,
		"timestamp": timestamp,
	}

	err = collection.FindOne(context.TODO(), filter).Decode(&heatmapHistory)

	return heatmapHistory, err
}

func (datastore *MongoDatastore) InsertHeatmapHistory(heatmapHistoryInsert HeatmapHistory) (err error) {
	collection := datastore.db.Collection(collectionHeatmapHistory)

	_, err = collection.InsertOne(context.TODO(), heatmapHistoryInsert)

	return err
}

func (datastore *MongoDatastore) UpdateListHeatmapHistoryData(heatmapHistoryUpdate HeatmapHistory) (err error) {
	collection := datastore.db.Collection(collectionHeatmapHistory)

	filter := bson.M{
		"boxID":     heatmapHistoryUpdate.BoxID,
		"cameraID":  heatmapHistoryUpdate.CameraID,
		"timestamp": heatmapHistoryUpdate.Timestamp,
	}

	update := bson.M{
		"$set": bson.M{
			"data": heatmapHistoryUpdate.ListHeatmapHistoryData,
		},
	}

	_, err = collection.UpdateOne(context.TODO(), filter, update)

	return err
}

func (datastore *MongoDatastore) FindListHeatmapHistoryByCameraID(cameraID string, dateStart int64, dateEnd int64) (listHeatmapHistory []HeatmapHistory, err error) {
	collection := datastore.db.Collection(collectionHeatmapHistory)

	filter := bson.M{
		"cameraID": cameraID,
		"timestamp": bson.M{
			"$lte": dateEnd,
			"$gte": dateStart,
		},
	}

	cursors, err := collection.Find(context.TODO(), filter, options.Find())

	if err != nil {
		return listHeatmapHistory, err
	}

	for cursors.Next(context.TODO()) {
		var heatmapHistory HeatmapHistory
		err = cursors.Decode(&heatmapHistory)

		if err != nil {
			return listHeatmapHistory, err
		}

		listHeatmapHistory = append(listHeatmapHistory, heatmapHistory)
	}

	return listHeatmapHistory, err
}

func (datastore *MongoDatastore) AggregationTotalDwellTimeByCamera(cameraID string, dateStart int64, dateEnd int64) (listHeatmapHistoryData []HeatmapHistoryData, err error) {

	matchStage := bson.D{{
		Key: "$match", Value: bson.D{
			{Key: "cameraID", Value: cameraID},
			{Key: "timestamp", Value: bson.D{
				{Key: "$lte", Value: dateEnd},
				{Key: "$gte", Value: dateStart},
			}},
		},
	}}

	unwindStage := bson.D{
		{Key: "$unwind", Value: "$data"},
	}

	sumPerDwellTimeGroupStage := bson.D{
		{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$data.index"},
			{Key: "dwellTime", Value: bson.D{
				{Key: "$sum", Value: "$data.dwellTime"},
			}},
		}},
	}

	pushSumPerDwellTimeStage := bson.D{
		{Key: "$group", Value: bson.D{
			{Key: "_id", Value: 0},
			{Key: "data", Value: bson.D{
				{Key: "$push", Value: bson.D{
					{Key: "index", Value: "$_id"},
					{Key: "dwellTime", Value: "$dwellTime"},
				}},
			}},
		}},
	}

	projectStage := bson.D{
		{Key: "$project", Value: bson.D{
			{Key: "data", Value: 1},
			{Key: "_id", Value: 0},
		}},
	}

	collection := datastore.db.Collection(collectionHeatmapHistory)

	cursors, err := collection.Aggregate(context.TODO(), mongo.Pipeline{matchStage, unwindStage, sumPerDwellTimeGroupStage, pushSumPerDwellTimeStage, projectStage})

	if err != nil {
		return listHeatmapHistoryData, err
	}

	for cursors.Next(context.TODO()) {
		var heatmapHistory HeatmapHistory

		err = cursors.Decode(&heatmapHistory)
		if err != nil {
			return listHeatmapHistoryData, err
		}

		listHeatmapHistoryData = heatmapHistory.ListHeatmapHistoryData
	}

	return listHeatmapHistoryData, err
}
