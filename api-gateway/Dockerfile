FROM golang:1.18.8-alpine3.15
RUN apk update && apk add git
ENV GO111MODULE=on
WORKDIR /app
COPY ./go.mod .
COPY ./go.sum .
RUN git config --global url."https://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:x-oauth-basic@github.com/".insteadOf "https://github.com/"
RUN go mod download
COPY . .
EXPOSE 8080 
CMD ["go", "run", "main.go"]