FROM golang:1.18.8-alpine3.15
ENV GO111MODULE=on
WORKDIR /app
COPY ./go.mod .
RUN go mod download
COPY . .
EXPOSE 8080 
CMD ["go", "run", "main.go"]