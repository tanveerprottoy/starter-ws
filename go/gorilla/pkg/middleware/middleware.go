package middleware

import (
	"net/http"

	"github.com/tanveerprottoy/starter-ws/gorilla/pkg/constant"
	"github.com/tanveerprottoy/starter-ws/gorilla/pkg/jwt"
	"github.com/tanveerprottoy/starter-ws/gorilla/pkg/response"
)

// JSONContentTypeMiddleWare content type json setter middleware
func JSONContentTypeMiddleWare(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

// CORSEnableMiddleWare enable cors
func CORSEnableMiddleWare(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, X-CSRF-Token")
		next.ServeHTTP(w, r)
	})
}
