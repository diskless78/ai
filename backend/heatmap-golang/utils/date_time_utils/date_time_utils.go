package date_time_utils

import (
	"github.com/sjsdfg/common-lang-in-go/Int64Utils"
	"heatmap/common/constant"
	"time"
)

const (
	SevenDays    = 7
	ThirtyDays   = 30
	FourteenDays = 14
)

func TimestampToDate(timestamp string) time.Time {
	timestampIn64 := Int64Utils.ValueOf(timestamp)

	return time.Unix(timestampIn64, 0)
}

func GetWeekDay(timestamp int64) int {
	return int(time.Unix(timestamp, 0).Weekday())
}

func GetBeginTimestampOfDay(currentTime int64) int64 {
	dateTime := time.Unix(currentTime, 0)

	year, month, day := dateTime.Date()

	timeBeginOfDay := time.Date(year, month, day, 0, 0, 0, 0, dateTime.Location())

	return timeBeginOfDay.Unix()
}

func GetBeginTimestampOfDayAsia(currentTime int64) (int64, error) {
	locationAsia, err := time.LoadLocation(constant.TimeZoneAsiaJakarta)

	if err != nil {
		return 0, err
	}

	dateTime := time.Unix(currentTime, 0)

	year, month, day := dateTime.Date()

	timeBeginOfDay := time.Date(year, month, day, 0, 0, 0, 0, locationAsia)

	return timeBeginOfDay.Unix(), nil
}

func GetLatestTimestampOfDay(currentTime int64) int64 {
	dateTime := time.Unix(currentTime, 0)

	year, month, day := dateTime.Date()

	timeBeginOfDay := time.Date(year, month, day, 23, 59, 59, 0, dateTime.Location())

	return timeBeginOfDay.Unix()
}

func GetHourMinSecFromTimestamp(timestamp int64) (int, int, int) {
	return time.Unix(timestamp, 0).Clock()

}

func GetBeginTimestampOfMonth(currentTime int64) int64 {
	dateTimeObject := time.Unix(currentTime, 0)
	year, month, day := dateTimeObject.Date()

	dayBeginOfMonth := time.Date(year, month, day, 0, 0, 0, 0, dateTimeObject.Location())
	return dayBeginOfMonth.Unix()
}

func GetLatestTimestampOfMonth(currentTime int64) int64 {
	currentDateTimeObject := time.Unix(currentTime, 0)
	year, month, lastDay := currentDateTimeObject.AddDate(0, 1, -currentDateTimeObject.Day()).Date()
	return time.Date(year, month, lastDay, 23, 59, 59, 0, currentDateTimeObject.Location()).Unix()
}
