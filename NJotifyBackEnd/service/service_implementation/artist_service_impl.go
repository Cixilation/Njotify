package service_implementation

import (
	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/go-playground/validator/v10"
)

type ArtistServiceImpl struct {
	ArtistRepository repository_interfaces.ArtistRepository
	Validate         *validator.Validate
}

func NewArtistServiceImpl(artistRepository repository_interfaces.ArtistRepository, validate *validator.Validate) service_interfaces.ArtistService {
	return &ArtistServiceImpl{
		ArtistRepository: artistRepository,
		Validate:         validate,
	}
}

func (a *ArtistServiceImpl) Create(artist request.CreateArtistRequest) {
	err := a.Validate.Struct(artist)
	helper.CheckPanic(err)
	artistModel := model.Artist{
		ArtistID:          artist.UserID,
		ArtistDescription: artist.UserDescription,
		ArtistBanner:      artist.UserBanner,
		ArtistStatus:      "Unverified",
	}
	a.ArtistRepository.Save(artistModel)
}

func (a *ArtistServiceImpl) GetArtistByArtistID(userID string) response.ArtistResponse {
	result := a.ArtistRepository.GetArtistByArtistID(userID)
	userResponse := response.UserResponse{
		UserID:             result.ArtistUser.UserID,
		UserEmail:          result.ArtistUser.UserEmail,
		UserRole:           result.ArtistUser.UserRole,
		UserProfilePicture: result.ArtistUser.UserProfilePicture,
		UserName:           result.ArtistUser.UserName,
		UserCountry:        result.ArtistUser.UserCountry,
		UserDOB:            result.ArtistUser.UserDOB,
		UserGender:         result.ArtistUser.UserGender,
		UserStatus:         result.ArtistUser.UserStatus,
	}
	artistResponse := response.ArtistResponse{
		ArtistDescription: result.ArtistDescription,
		ArtistBanner:      result.ArtistBanner,
		ArtistStatus:      result.ArtistStatus,
		UserResponse:      userResponse,
	}
	return artistResponse
}

func (a *ArtistServiceImpl) GetArtistVerificationRequest() []response.UserResponse {
	result := a.ArtistRepository.GetArtistVerificationRequest()
	var users []response.UserResponse
	for _, result := range result {
		userResponse := response.UserResponse{
			UserID:             result.UserID,
			UserEmail:          result.UserEmail,
			UserName:           result.UserName,
			UserRole:           result.UserRole,
			UserCountry:        result.UserCountry,
			UserDOB:            result.UserDOB,
			UserGender:         result.UserGender,
			UserProfilePicture: result.UserProfilePicture,
			UserStatus:         result.UserStatus,
		}
		users = append(users, userResponse)
	}
	return users

}

func (a *ArtistServiceImpl) RejectArtistRequest(UserID string) {
	a.ArtistRepository.RejectArtistRequest(UserID)
}

func (a *ArtistServiceImpl) AcceptArtistRequest(UserID string) {
	a.ArtistRepository.AcceptArtistRequest(UserID)
}
