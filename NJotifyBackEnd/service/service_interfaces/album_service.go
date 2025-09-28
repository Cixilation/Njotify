package service_interfaces

import (
	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
)

type AlbumService interface {
	Save(album request.CreateAlbumRequest) response.AlbumResponse
	GetAlbumByUserId(UserId string) []response.AlbumResponse
	GetAlbumByAlbumID(AlbumID string) response.AlbumResponse
	GetAllAlbum() []response.AlbumResponse
}
