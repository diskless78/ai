package utils

import (
	"strconv"
)

func IsNumeric(stringValue string) bool {
	_, err := strconv.ParseInt(stringValue, 10, 64)

	return err == nil
}
