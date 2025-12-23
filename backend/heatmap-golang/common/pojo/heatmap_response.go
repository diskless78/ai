package pojo

type HeatmapData struct {
	X      int64   `json:"x"`
	Y      int64   `json:"y"`
	Value  int64   `json:"value"`
	Radius float64 `json:"radius"`
}

type HeatmapResponse struct {
	ListHeatmapData []HeatmapData `json:"data"`
	Max             int64         `json:"max"`
	Min             int64         `json:"min"`
	URLImage        string        `json:"url"`
	CameraID        string        `json:"id"`
}
