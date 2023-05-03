package chat

import (
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/mongo"
)

type Module struct {
	Handler    *Handler
	Service    *Service
	Repository *Repository
}

func NewModule(db *mongo.Database, validate *validator.Validate) *Module {
	m := new(Module)
	// init order is reversed of the field decleration
	// as the dependency is served this way
	m.Repository = NewRepository(db)
	m.Service = NewService(m.Repository)
	m.Handler = NewHandler(m.Service, validate)
	return m
}
