# Stage 1: Build
FROM golang:1.25.5-alpine AS builder
RUN apk add --no-cache build-base librdkafka-dev pkgconf
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

# Build with CGO for Kafka
RUN CGO_ENABLED=1 GOOS=linux go build -tags musl -o /app/bin/service ./cmd/server

# Stage 2: Runtime
FROM alpine:3.21
RUN apk add --no-cache librdkafka tzdata
WORKDIR /root/

COPY --from=builder /app/bin/service .
# Copy the example file to .env
COPY --from=builder /app/env.example .env 
COPY --from=builder /app/cert ./cert

# Set timezone
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD ["./service"]