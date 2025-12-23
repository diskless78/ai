package utils

import (
	"encoding/json"
	"strconv"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetStringPtr(m map[string]interface{}, key string) *string {
	if v, ok := m[key]; ok && v != nil {
		if s, ok := v.(string); ok {
			return &s
		}
	}
	return nil
}

func GetStrValueByObjectStr(m map[string]string, key string) *string {
	if v, ok := m[key]; ok {
		return &v
	}
	return nil
}

func GetInt(m map[string]interface{}, key string) *int {
	v, ok := m[key]
	if !ok || v == nil {
		return nil
	}

	switch val := v.(type) {

	case float64:
		// JSON decoder mặc định số → float64
		i := int(val)
		return &i

	case int:
		i := val
		return &i

	case int64:
		i := int(val)
		return &i

	case json.Number:
		// nếu bạn dùng Decoder.UseNumber()
		i64, err := val.Int64()
		if err != nil {
			return nil
		}
		i := int(i64)
		return &i

	case string:
		// parse từ string
		i, err := strconv.Atoi(val)
		if err != nil {
			return nil
		}
		return &i

	default:
		return nil
	}
}

func GetMap(v interface{}) map[string]interface{} {
	if v == nil {
		return map[string]interface{}{}
	}

	// Trường hợp Kafka gửi map[string]string
	if m, ok := v.(map[string]string); ok {
		out := make(map[string]interface{})
		for k, val := range m {
			out[k] = val
		}
		return out
	}

	// Trường hợp đã đúng kiểu
	if m, ok := v.(map[string]interface{}); ok {
		return m
	}

	return map[string]interface{}{}
}

func UUIDv7ToBinary(u uuid.UUID) primitive.Binary {
	return primitive.Binary{
		Subtype: 4, // UUID RFC-4122
		Data:    u[:],
	}
}

// Convert interface{} (string|uuid.UUID) → *primitive.Binary
func AnyToUUIDBinary(v interface{}) *primitive.Binary {
	if v == nil {
		return nil
	}

	switch val := v.(type) {
	case uuid.UUID:
		bin := UUIDv7ToBinary(val)
		return &bin

	case *uuid.UUID:
		if val == nil {
			return nil
		}
		bin := UUIDv7ToBinary(*val)
		return &bin

	case string:
		u, err := uuid.Parse(val)
		if err != nil {
			return nil
		}
		bin := UUIDv7ToBinary(u)
		return &bin

	default:
		return nil
	}
}

func NewUUIDv7ToBinary() primitive.Binary {
	id := uuid.Must(uuid.NewV7())

	return UUIDv7ToBinary(id)
}
