package main

import (
	"fmt"
	"net/http"

	"github.com/golang/glog"
)

func main() {
	addr := "localhost:8081"
	fmt.Println("listening on", addr)
	glog.Fatalln(http.ListenAndServe(addr, nil))
}
