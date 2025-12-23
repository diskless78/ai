package server

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kjk/dailyrotate"
)

type Server struct {
	*gin.Engine
}

type response struct {
	Data    interface{} `json:"body"`
	Code    int         `json:"code"`
	Message string      `json:"message"`
}

// CorsConfig nắm giữ các config cần thiết của Cors
type CorsConfig struct {
	AllowOrigin  string
	MaxAge       string
	AllowMethods string
	AllowHeaders string
}

const (
	ENV_PRODUCTION  = "pro"
	ENV_DEVELOPMENT = "dev"
)

// GetUserID lấy userID
func GetUserID(c *gin.Context) string {
	id := c.Value("id")
	if id == nil {
		id = ""
	}
	return fmt.Sprintf("%v", id)
}

func New(env string) *Server {
	router := &Server{gin.New()}
	router.ForwardedByClientIP = true

	router.Use(gin.Recovery())

	if env == ENV_PRODUCTION {
		gin.SetMode(gin.ReleaseMode)
		gin.DefaultWriter = ioutil.Discard
	} else {
		{
			router.Use(gin.Logger())
		}
	}

	return router
}

func (r *Server) Cors(config CorsConfig) {
	r.Use(corsMiddleware(config))
}

func corsMiddleware(config CorsConfig) gin.HandlerFunc {
	if len(config.AllowOrigin) < 1 {
		config.AllowOrigin = "*"
	}

	if len(config.MaxAge) < 1 {
		config.MaxAge = "86400"
	}

	if len(config.AllowMethods) < 1 {
		config.AllowMethods = "Authorization, Content-Type"
	}

	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", config.AllowOrigin)
		c.Writer.Header().Set("Access-Control-Max-Age", config.MaxAge)
		c.Writer.Header().Set("Access-Control-Allow-Methods", config.AllowHeaders)
		c.Writer.Header().Set("Access-Control-Allow-Headers", config.AllowMethods)
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
	}
}

func (r *Server) Security() {
	r.Use(r.securityMiddleware())
}

// tạo các header
func (r *Server) securityMiddleware() gin.HandlerFunc {
	return func(cc *gin.Context) {
		cc.Header("X-Powered-By", "PHP/7.2.24")
		cc.Header("Server", "nginx/1.17.0")
		cc.Header("X-Content-Type-Options", "nosniff")
		cc.Header("X-Frame-Options", "DENY")
		cc.Header("X-XSS-Protection", "1; mode=block")
		cc.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

		cc.Header("Cache-Control", "private, max-age=0")
		cc.Header("Pragma", "no-cache")
		cc.Next()
	}
}

func (r *Server) setLogger(logFile *dailyrotate.File) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		if raw != "" {
			path = path + "?" + raw
		}

		c.Next()
		userID := GetUserID(c)

		if userID == "" {
			userID = "-"
		}
		end := time.Now()
		latency := end.Sub(start)
		userAgent := c.GetHeader("User-Agent")
		logAccess := fmt.Sprintf("%s | %v | %v | %v | %v %v | %v | %v\n",
			start.Format("15:04:05 02-01-2006"),
			c.Writer.Status(),
			latency,
			c.ClientIP(),
			c.Request.Method,
			path,
			userID,
			userAgent)
		logFile.Write([]byte(logAccess))
	}
}

func Data(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, response{
		Code: http.StatusOK,
		Data: data,
	})
}

func Unauthorized(c *gin.Context) {
	c.JSON(http.StatusUnauthorized, response{
		Code:    http.StatusUnauthorized,
		Message: "unauthorized",
	})
}

func Success(c *gin.Context, mess ...string) {
	var message = "Success"
	if mess != nil {
		message = mess[0]
	}

	c.JSON(http.StatusOK, response{
		Code:    http.StatusOK,
		Message: message,
	})
}

func BadRequest(c *gin.Context, mess ...string) {
	var message = "Bad Request"
	if mess != nil {
		message = mess[0]
	}

	c.JSON(http.StatusBadRequest, response{
		Code:    http.StatusBadRequest,
		Message: message,
	})
}

func NotFound(c *gin.Context, mess ...string) {
	var message = "Not Found"
	if mess != nil {
		message = mess[0]
	}

	c.JSON(http.StatusNotFound, response{
		Code:    http.StatusNotFound,
		Message: message,
	})
}

func InternalServerError(c *gin.Context, mess ...string) {
	var message = "Internal Server Error"
	if mess != nil {
		message = mess[0]
	}

	c.JSON(http.StatusInternalServerError, response{
		Code:    http.StatusInternalServerError,
		Message: message,
	})
}

func (r *Server) SetLogAccessDaily(dir string) error {
	if len(dir) < 1 {
		return nil
	}
	// tạo các thư mục trong path nếu có thư mục đó rồi thì ko tạo nữa
	err := os.MkdirAll(dir, os.ModePerm)
	if err != nil {
		return err
	}

	pathFormat := filepath.Join(dir, "access_27_07_2020.log")
	w, err := dailyrotate.NewFile(pathFormat, nil)
	if err != nil {
		return err
	}
	r.Use(r.setLogger(w))

	return nil
}
