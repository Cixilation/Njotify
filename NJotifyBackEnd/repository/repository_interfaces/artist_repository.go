package repository_interfaces

import (
	"github.com/cixilation/tpaweb/model"
)

type ArtistRepository interface {
	Save(artist model.Artist)
	GetAllArtists() []model.Artist
	GetArtistByArtistID(ArtistID string) model.Artist
	GetArtistVerificationRequest() []model.User
	AcceptArtistRequest(UserID string)
	RejectArtistRequest(UserID string)
}
