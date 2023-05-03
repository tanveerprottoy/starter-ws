package chat

import (
	"net/http"

	"github.com/tanveerprottoy/starter-ws/gorilla/internal/pkg/constant"
	"github.com/tanveerprottoy/starter-ws/gorilla/pkg/adapter"
	httpPkg "github.com/tanveerprottoy/starter-ws/gorilla/pkg/http"
	"github.com/tanveerprottoy/starter-ws/gorilla/pkg/response"
)

type Handler struct {
	service *Service
}

func NewHandler(s *Service) *Handler {
	h := new(Handler)
	h.service = s
	return h
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	d, err := adapter.BodyToType[dto.CreateUpdateUserDto](r.Body)
	if err != nil {
		response.RespondError(http.StatusBadRequest, err, w)
		return
	}
	h.service.Create(d, w, r)
}

func (h *Handler) ReadMany(w http.ResponseWriter, r *http.Request) {
	limit := 10
	page := 1
	var err error
	limitStr := httpPkg.GetQueryParam(r, constant.KeyLimit)
	if limitStr != "" {
		limit, err = adapter.StringToInt(limitStr)
		if err != nil {
			response.RespondError(http.StatusBadRequest, err, w)
			return
		}
	}
	pageStr := httpPkg.GetQueryParam(r, constant.KeyPage)
	if pageStr != "" {
		page, err = adapter.StringToInt(pageStr)
		if err != nil {
			response.RespondError(http.StatusBadRequest, err, w)
			return
		}
	}
	h.service.ReadMany(limit, page, w, r)
}

func (h *Handler) GetWSEndpoint(w http.ResponseWriter, r *http.Request) {
	h.service.Create(d, w, r)
}
