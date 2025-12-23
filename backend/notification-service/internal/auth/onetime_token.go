package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"strings"
	"time"

	"github.com/google/uuid"
)

type TokenPayload struct {
	Iss   string `json:"iss"`
	Aud   string `json:"aud"`
	Exp   int64  `json:"exp"`
	Nonce string `json:"nonce"`
}

func b64Encode(data []byte) string {
	return strings.TrimRight(
		base64.URLEncoding.EncodeToString(data),
		"=",
	)
}

// func b64Decode(data string) ([]byte, error) {
// 	if m := len(data) % 4; m != 0 {
// 		data += strings.Repeat("=", 4-m)
// 	}
// 	return base64.URLEncoding.DecodeString(data)
// }

func sign(payload []byte, secret []byte) []byte {
	h := hmac.New(sha256.New, secret)
	h.Write(payload)
	return h.Sum(nil)
}

func CreateToken(
	issuer string,
	audience string,
	secret string,
	ttlSeconds int64,
) (string, error) {

	payload := TokenPayload{
		Iss:   issuer,
		Aud:   audience,
		Exp:   time.Now().Unix() + ttlSeconds,
		Nonce: uuid.NewString(), // 128-bit nonce
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	signature := sign(payloadBytes, []byte(secret))

	token := b64Encode(payloadBytes) + "." + b64Encode(signature)
	return token, nil
}
