package service_implementation

import (
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/go-playground/validator/v10"
)

type AdvertisementServiceImpl struct {
	AdvertisementRepository repository_interfaces.AdvertisementRepository
	Validate                *validator.Validate
}

func NewAdvertisementService(advertisementRepository repository_interfaces.AdvertisementRepository, validate *validator.Validate) service_interfaces.AdvertisementService {
	return &AdvertisementServiceImpl{
		AdvertisementRepository: advertisementRepository,
		Validate:                validate,
	}
}

func (a *AdvertisementServiceImpl) GetAdvertisementByRandom() response.PlaylistDetailResponse {
	result := a.AdvertisementRepository.GetAdvertisementByRandom()
	err := a.Validate.Struct(result)
	helper.CheckPanic(err)
	advertisementResponse := response.PlaylistDetailResponse{
		SongResponse: response.SongResponse{
			SongFile: result.AdFile,
			SongName: result.AdPublisher,
		},
		AlbumResponse: response.AlbumResponse{
			AlbumImage: "placeholder.png",
		},
		UserResponse: response.UserResponse{
			UserName: result.AdPublisher,
		},
	}
	return advertisementResponse
}
