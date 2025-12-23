package controller

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	slog "github.com/go-eden/slf4go"
	uuid "github.com/satori/go.uuid"
	"github.com/sjsdfg/common-lang-in-go/StringUtils"
	"heatmap/business/services"
	"heatmap/business/validations"
	containercloud "heatmap/cmd/api/container"
	"heatmap/common/constant"
	"heatmap/model"
	"heatmap/server"
	"heatmap/utils/logger"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
)

var (
	container *containercloud.Container
)

type Claims struct {
	Product string `json:"product"`
	Email   string `json:"email"`
	UserID  string `json:"user_id"`
	jwt.StandardClaims
}

func NewRouter(c *containercloud.Container) error {
	gin.SetMode(gin.ReleaseMode)

	container = c
	router := server.New(container.Config.ENV)

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "https://github.com"
		},
		MaxAge: 12 * time.Hour,
	}))
	router.Cors(server.CorsConfig{})
	router.Security()
	router.Use(CorrelationMiddleware())

	groupRepository := model.NewGroupRepository(container.DataStore.GetDB())
	cameraRepository := model.NewCameraRepository(container.DataStore.GetDB())
	heatmapHistoryRepository := model.NewHeatmapHistoryRepository(container.DataStore.GetDB())

	reportHeatmapByDateValidation := validations.NewReportHeatmapByDateValidation(groupRepository)

	s3ClientService := services.NewS3ClientService(container.S3Client)
	cameraService := services.NewCameraService(cameraRepository)
	boxService := services.NewBoxService(groupRepository)
	reportHeatmapByDateService := services.NewReportHeatmapByDateService(boxService, cameraService, heatmapHistoryRepository, s3ClientService)

	reportHeatmapByDate := NewReportHeatmapByDateController(reportHeatmapByDateValidation, reportHeatmapByDateService)

	v1 := router.Group("/api/v1")
	v1.Use(JwtRequired())

	admin := v1.Group("/report-heatmap")

	admin.GET("/count-by-date", reportHeatmapByDate.GetReportHeatmapByDate)

	return router.Run(c.Config.Listen)
}

// JwtRequired Middleware xác thực token
func JwtRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("Authorization")
		if token == "null" || StringUtils.IsEmpty(strings.TrimSpace(token)) {
			logger.Slogger.Error("Token is empty")
			server.Unauthorized(c)
			c.Abort()
			return
		}
		claims := Claims{}
		var jwtKey = []byte(container.Config.TokenSecretKey)
		parseToken, err := jwt.ParseWithClaims(token, &claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil {
			logger.Slogger.Errorf("Error when parse token: %v", err)
			server.Unauthorized(c)
			c.Next()
			return
		}

		if !parseToken.Valid {
			logger.Slogger.Error("Token is invalid")
			server.Unauthorized(c)
			c.Abort()
			return
		}

		c.Set(constant.UserID, claims.UserID)
		c.Next()
	}
}

func CorrelationMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		correlationID := c.Request.Header.Get(constant.CorrelationId)

		if strings.TrimSpace(correlationID) == "" {
			id := uuid.NewV4()

			logger.Slogger.BindFields(slog.Fields{constant.CorrelationId: id})

			logger.Slogger.Infof("Start request with correlation id: %s", id.String())
			c.Set(constant.CorrelationId, id.String())
			c.Request.Header.Add(constant.CorrelationId, id.String())
			c.Header("Correlation-Id", id.String())
		}
		c.Next()
	}
}
