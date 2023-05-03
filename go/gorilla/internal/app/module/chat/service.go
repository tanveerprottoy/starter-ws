package chat

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Service struct {
	repository *Repository
}

func NewService(r *Repository) *Service {
	s := new(Service)
	s.repository = r
	return s
}

func (s *Service) Create(d *dto.CreateUpdateUserDto, w http.ResponseWriter, r *http.Request) {
	v, err := adapter.AnyToType[entity.User](d)
	if err != nil {
		response.RespondError(http.StatusBadRequest, err, w)
		return
	}
	v.CreatedAt = time.Now()
	v.UpdatedAt = time.Now()
	res, err := s.repository.Create(
		r.Context(),
		&v,
		nil,
	)
	if err != nil {
		response.RespondError(http.StatusInternalServerError, err, w)
		return
	}
	response.Respond(http.StatusOK, response.BuildData(res), w)
}

func (s *Service) ReadMany(limit, skip int, w http.ResponseWriter, r *http.Request) {
	opts := mongodb.BuildPaginatedOpts(limit, skip)
	c, err := s.repository.ReadMany(
		r.Context(),
		bson.D{},
		&opts,
	)
	if err != nil {
		response.RespondError(http.StatusInternalServerError, err, w)
		return
	}
	var data []schema.User
	data, err = mongodb.DecodeCursor[[]schema.User](c, r.Context())
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// This error means your query did not match any documents.
			response.Respond(http.StatusOK, make([]any, 0), w)
			return
		} else if err == mongo.ErrNilCursor {
			// This error means your query did not match any documents.
			response.Respond(http.StatusOK, make([]any, 0), w)
			return
		}
		response.RespondError(http.StatusInternalServerError, err, w)
		return
	}
	if data == nil {
		data = []schema.User{}
	}
	m := make(map[string]any)
	m["items"] = data
	m["limit"] = limit
	m["page"] = skip
	response.Respond(http.StatusOK, response.BuildData(m), w)
}

func (s *Service) GetWSEndpoint(d *dto.CreateUpdateUserDto, w http.ResponseWriter, r *http.Request) {
	response.Respond(http.StatusOK, response.BuildData(config.GetEnvValue("WS_ENDPOINT")), w)
}