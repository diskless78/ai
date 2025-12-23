FROM golang:1.17.3-stretch as builder

WORKDIR usr/app/backend

COPY . .

RUN go mod tidy && go mod download && go build cmd/api/*.go
# timezone +0
ENV TZ=Etc/GMT+0
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD ["./main"]
