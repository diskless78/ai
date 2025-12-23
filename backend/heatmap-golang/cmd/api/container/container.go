package container

import (
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	slog "github.com/go-eden/slf4go"
	"github.com/joho/godotenv"
	"heatmap/model"
	"heatmap/utils/logger"
	"os"
)

// Config : struct của config
type Config struct {
	Listen    string
	Domain    string
	RateLimit int64
	ENV       string
	Browser   string

	ErrorLog      string
	AccessLogPath string

	TokenSecretKey string

	MongoServer   []string
	MongoUser     string
	MongoPassword string
	MongoAuthDB   string
	MongoDatabase string

	KafkaTopic  string
	KafkaBroker string
	KafkaGroup  string

	S3AccessKey    string
	S3SecretKey    string
	S3Region       string
	S3Host         string
	S3CameraBucket string
}

type Container struct {
	Config    *Config
	DataStore *model.MongoDatastore
	S3Client  *s3.S3
}

// NewContainer : khởi tạo 1 container mới
func NewContainer() *Container {
	var container = new(Container)
	return container
}

// Setup : chạy file Setup lúc đầu để load các thứ như mongo, redis
func (container *Container) Setup() error {
	logger.Slogger.Info("Loading config")
	var config Config
	err := config.LoadConfig()
	if err != nil {
		return fmt.Errorf("error load config: %v", err)
	}

	container.Config = &config

	err = container.loadMongo()
	if err != nil {
		return fmt.Errorf("error load mongo: %v", err)
	}

	container.loadS3()

	return nil

}

func (config *Config) LoadConfig() error {
	err := godotenv.Load()
	if err != nil {
		slog.Error("Error loading .env file")
	}

	config.Listen = "0.0.0.0:" + os.Getenv("PORT")
	slog.Info("listen: ", config.Listen)

	config.RateLimit = int64(100)
	config.ENV = "product"
	config.TokenSecretKey = os.Getenv("SECRET_KEY")

	s := make([]string, 1)
	s[0] = os.Getenv("MONGO_HOST") + ":" + os.Getenv("MONGO_PORT")
	config.MongoServer = s
	config.MongoUser = os.Getenv("MONGO_USER")
	config.MongoPassword = os.Getenv("MONGO_PWD")
	config.MongoAuthDB = os.Getenv("MONGODB_AUTH_SOURCE")
	config.MongoDatabase = os.Getenv("MONGODB_NAME")

	config.KafkaTopic = os.Getenv("KAFKA_TOPIC")
	config.KafkaBroker = os.Getenv("KAFKA_BROKER")
	config.KafkaGroup = os.Getenv("GROUP_ID")

	config.S3AccessKey = os.Getenv("S3_ACCESS_KEY")
	config.S3SecretKey = os.Getenv("S3_SECRET_KEY")
	config.S3Region = os.Getenv("S3_REGION")
	config.S3Host = os.Getenv("S3_HOST")
	config.S3CameraBucket = os.Getenv("S3_CAMERA_BUCKET")

	return nil
}

// loadMongo connect đến mongo
func (container *Container) loadMongo() error {
	container.DataStore = model.NewDatastore()
	logger.Slogger.Info("Connect to mongo")
	return nil
}

func (container *Container) loadS3() {
	isDisableSSl := true
	s3Config := &aws.Config{
		Credentials:      credentials.NewStaticCredentials(container.Config.S3AccessKey, container.Config.S3SecretKey, ""),
		Endpoint:         aws.String(container.Config.S3Host),
		Region:           aws.String(container.Config.S3Region),
		S3ForcePathStyle: aws.Bool(true),
		DisableSSL:       &isDisableSSl,
	}

	s3Session, err := session.NewSession(s3Config)

	if err != nil {
		logger.Slogger.Errorf("Error when create s3 s3Session: %v", err)
	}

	container.S3Client = s3.New(s3Session)
	logger.Slogger.Info("Connect to aws s3")
}
