package middleware

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

func Recover() fiber.Handler {
	return func(c *fiber.Ctx) (err error) {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("[PANIC] HTTP recovered: %v", r)

				_ = c.Status(500).JSON(fiber.Map{
					"code":    "INTERNAL_SERVER_ERROR",
					"message": "internal server error",
				})
			}
		}()
		return c.Next()
	}
}
