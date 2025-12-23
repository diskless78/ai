package logger

import (
	slog "github.com/go-eden/slf4go"
)

var Slogger slog.Logger

func init() {
	Slogger = slog.GetLogger()
}
