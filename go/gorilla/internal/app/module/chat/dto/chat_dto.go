package dto

type CreateUpdateChatDto struct {
	RoomName string `json:"name" validate:"required"`
	Sender   any    `json:"sender" validate:"required"`
	Receiver uint8  `json:"receiver" validate:"required"`
	Message  string `json:"message" validate:"required"`
}

type Sender struct {
	Id   string `json:"name" validate:"required"`
	Name string `json:"sender" validate:"required"`
}

type Receiver struct {
	Id   string `json:"name" validate:"required"`
	Name string `json:"sender" validate:"required"`
}
