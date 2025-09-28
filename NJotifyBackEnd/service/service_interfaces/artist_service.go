package service_interfaces

import (
	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
)

type ArtistService interface {
	Create(artist request.CreateArtistRequest)
	GetArtistByArtistID(userID string) response.ArtistResponse
	GetArtistVerificationRequest() []response.UserResponse
	RejectArtistRequest(userID string)
	AcceptArtistRequest(userID string)
}
