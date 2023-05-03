package chat

import (
	"context"

	"github.com/tanveerprottoy/starter-ws/gorilla/internal/pkg/constant"
	"github.com/tanveerprottoy/starter-ws/gorilla/pkg/data/nosql/mongodb"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Repository struct {
	db *mongo.Database
}

func NewRepository(db *mongo.Database) *Repository {
	r := new(Repository)
	r.db = db
	return r
}

func (r *Repository) Create(
	ctx context.Context,
	doc any,
	opts ...*options.InsertOneOptions,
) (*mongo.InsertOneResult, error) {
	return mongodb.InsertOne(
		r.db,
		constant.UsersCollection,
		ctx,
		doc,
		opts...,
	)
}

func (r *Repository) ReadMany(
	ctx context.Context,
	filter any,
	opts ...*options.FindOptions,
) (*mongo.Cursor, error) {
	return mongodb.Find(
		r.db,
		constant.UsersCollection,
		ctx,
		filter,
		opts...,
	)
}

func (r *Repository) ReadOne(
	ctx context.Context,
	filter any,
	opts ...*options.FindOneOptions,
) *mongo.SingleResult {
	return mongodb.FindOne(
		r.db,
		constant.UsersCollection,
		ctx,
		filter,
		opts...,
	)
}

func (r *Repository) Update(
	ctx context.Context,
	filter any,
	doc any,
	opts ...*options.UpdateOptions,
) (*mongo.UpdateResult, error) {
	return mongodb.UpdateOne(
		r.db,
		constant.UsersCollection,
		ctx,
		filter,
		doc,
		opts...,
	)
}

func (r *Repository) Delete(
	ctx context.Context,
	filter any,
	opts ...*options.DeleteOptions,
) (*mongo.DeleteResult, error) {
	return mongodb.DeleteOne(
		r.db,
		constant.UsersCollection,
		ctx,
		filter,
		opts...,
	)
}
