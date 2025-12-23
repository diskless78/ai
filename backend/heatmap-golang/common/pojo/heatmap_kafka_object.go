package pojo

type Coordinate struct {
	Index     []int64 `json:"index"`
	DwellTime int64   `json:"dwell_time"`
}

type HeatmapKafkaObject struct {
	Type      string       `json:"type"`
	BoxID     string       `json:"box_id"`
	CamID     string       `json:"cam_id"`
	Data      []Coordinate `json:"data"`
	Timestamp int64        `json:"timestamp"`
}
