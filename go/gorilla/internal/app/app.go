package app

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"

	"github.com/tanveerprottoy/starter-ws/gorilla/internal/app/module/chat"
	"github.com/tanveerprottoy/starter-ws/gorilla/internal/pkg/constant"
	routerPkg "github.com/tanveerprottoy/starter-ws/gorilla/internal/pkg/router"
	"github.com/tanveerprottoy/starter-ws/gorilla/pkg/router"

	validatorPkg "github.com/tanveerprottoy/starter-ws/gorilla/pkg/validator"

	"github.com/go-playground/validator/v10"
)

var (
	wsUpgrader = websocket.Upgrader {
		ReadBufferSize: 1024,
		WriteBufferSize: 1024,
	}

	wsConn *websocket.Conn
)

// App struct
type App struct {
	DBClient    *mongodb.Client
	router      *router.Router
	Middlewares []any
	ChatModule  *chat.Module
	Validate    *validator.Validate
}

func NewApp() *App {
	a := new(App)
	a.initComponents()
	return a
}

func (a *App) initDB() {
	a.DBClient = mongodb.GetInstance()
}

func (a *App) initModules() {
	a.ChatModule = chat.NewModule(a.DBClient.DB, a.Validate)
}

func (a *App) initModuleRouters() {
	m := a.Middlewares[0].(*middleware.AuthMiddleware)
	routerPkg.RegisterUserRoutes(a.router, constant.V1, a.UserModule, m)
	routerPkg.RegisterContentRoutes(a.router, constant.V1, a.ContentModule)
}

func (a *App) initValidators() {
	a.Validate = validator.New()
	_ = a.Validate.RegisterValidation("notempty", validatorPkg.NotEmpty)
}

// Init app
func (a *App) initComponents() {
	a.initDB()
	a.router = router.NewRouter()
	a.initModules()
	a.initModuleRouters()
	a.initValidators()
	// a.initLogger()
}

// Run app
func (a *App) Run() {
	err := http.ListenAndServe(
		":8080",
		a.router.Mux,
	)
	if err != nil {
		log.Fatal(err)
	}
}
