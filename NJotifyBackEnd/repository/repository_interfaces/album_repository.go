package repository_interfaces

import "github.com/cixilation/tpaweb/model"

type AlbumRepository interface {
	Save(album model.Album)
	GetAlbumByUserId(UserId string) []model.Album
	GetAlbumByAlbumID(AlbumID string) model.Album
	GetAllAlbum() []model.Album
}
