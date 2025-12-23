package models

type Camera struct {
	ID         string   `bson:"id" json:"id"`
	Name       string   `bson:"name,omitempty" json:"name,omitempty"`
	LinkStream string   `bson:"link_stream,omitempty" json:"link_stream,omitempty"`
	UserID     string   `bson:"userID" json:"userID"`
	BoxID      string   `bson:"boxID" json:"boxID"`
	ListGroup  []string `bson:"listGroup" json:"listGroup"`
}
