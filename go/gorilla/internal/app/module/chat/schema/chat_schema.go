package schema

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Chat struct {
	Id        *primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	roomName  string              `bson:"roomName,omitempty" json:"roomName,omitempty"`
	sender    Sender              `bson:"sender,omitempty" json:"sender,omitempty"`
	receiver  Receiver            `bson:"receiver,omitempty" json:"receiver,omitempty"`
	message   string              `bson:"message,omitempty" json:"message,omitempty"`
	CreatedAt time.Time           `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt time.Time           `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

type Sender struct {
	Id   string `bson:"id,omitempty" json:"id,omitempty"`
	Name string `bson:"name,omitempty" json:"name,omitempty"`
}

type Receiver struct {
	Id   string `bson:"id,omitempty" json:"id,omitempty"`
	Name string `bson:"name,omitempty" json:"name,omitempty"`
}
