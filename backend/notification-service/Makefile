.PHONY: build run docker

build:
	go build -o bin/service ./cmd/server

run: build
	./bin/service

docker:
	docker build -t go-microservice-template:latest .
