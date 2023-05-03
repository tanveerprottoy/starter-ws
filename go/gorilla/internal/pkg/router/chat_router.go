package router

import (
	"github.com/tanveerprottoy/starter-ws/gorilla/internal/app/module/chat"
	"github.com/tanveerprottoy/starter-ws/gorilla/internal/pkg/constant"
	"github.com/tanveerprottoy/starter-ws/gorilla/pkg/router"

	"github.com/go-chi/chi"
)

func RegisterChatRoutes(router *router.Router, version string, module *chat.Module, authMiddleWare *middleware.AuthMiddleware) {
	router.Mux.Group(
		func(r chi.Router) {
			// r.Use(authMiddleWare.AuthUser)
			r.Route(
				constant.ApiPattern+version+constant.ChatsPattern,
				func(r chi.Router) {
					r.Get(constant.RootPattern, module.Handler.ReadMany)
					r.Post(constant.RootPattern, module.Handler.Create)
					r.Get(constant.RootPattern+"/ws-endpoint", module.Handler.GetWSEndpoint)
					r.Get(constant.RootPattern+"/ws", module.Handler.GetWSEndpoint)
					// r.HandlerFunc
				},
			)
		},
	)
}
