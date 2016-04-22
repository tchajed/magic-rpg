package main

import (
	"fmt"
	"net/http"

	"golang.org/x/net/websocket"

	"github.com/golang/glog"
)

// Msg is the protocol message
type Msg struct {
	Foo string `json:"foo"`
	Baz int    `json:"baz"`
}

// EchoServer handles websocket requests by echoing parsed data back.
func EchoServer(ws *websocket.Conn) {
	for {
		var m Msg
		websocket.JSON.Receive(ws, &m)
		go func(m Msg) {
			fmt.Println(m)
			websocket.JSON.Send(ws, m)
		}(m)
	}
}

func main() {
	addr := "localhost:8081"
	fmt.Println("listening on", addr)
	http.Handle("/echo", websocket.Handler(EchoServer))
	glog.Fatalln(http.ListenAndServe(addr, nil))
}
