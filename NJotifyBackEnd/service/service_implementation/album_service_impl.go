package service_implementation

import (
	"fmt"
	"math"
	"time"

	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type AlbumServiceImpl struct {
	AlbumRepository repository_interfaces.AlbumRepository
	SongRepository  repository_interfaces.SongRepository
	Validate        *validator.Validate
}

func NewAlbumServiceImpl(albumRepository repository_interfaces.AlbumRepository, songRepository repository_interfaces.SongRepository, validate *validator.Validate) service_interfaces.AlbumService {
	return &AlbumServiceImpl{
		AlbumRepository: albumRepository,
		SongRepository:  songRepository,
		Validate:        validate,
	}
}

func (a *AlbumServiceImpl) Save(album request.CreateAlbumRequest) response.AlbumResponse {
	id := uuid.New()
	err := a.Validate.Struct(album)
	helper.CheckPanic(err)
	currentTime := time.Now()
	formattedDate := currentTime.Format("2006/01/02")
	albumModel := model.Album{
		AlbumID:         id.String(),
		AlbumName:       album.AlbumName,
		AlbumImage:      album.AlbumImage,
		AlbumType:       album.AlbumType,
		AlbumUploadDate: formattedDate,
		AlbumUserID:     album.UserId,
	}
	a.AlbumRepository.Save(albumModel)
	albumResponse := response.AlbumResponse{
		AlbumID:         id.String(),
		AlbumImage:      album.AlbumImage,
		AlbumName:       album.AlbumName,
		AlbumType:       album.AlbumType,
		AlbumUploadDate: formattedDate,
		UserID:          album.UserId,
	}
	return albumResponse

}

func (a *AlbumServiceImpl) GetAlbumByUserId(UserId string) []response.AlbumResponse {
	result := a.AlbumRepository.GetAlbumByUserId(UserId)
	var albumResponses []response.AlbumResponse
	for _, result := range result {
		albumResponse := response.AlbumResponse{
			AlbumID:         result.AlbumID,
			AlbumName:       result.AlbumName,
			AlbumImage:      result.AlbumImage,
			AlbumType:       result.AlbumType,
			AlbumUploadDate: result.AlbumUploadDate,
			UserID:          result.AlbumUserID,
		}
		albumResponses = append(albumResponses, albumResponse)
	}
	return albumResponses
}

func (a *AlbumServiceImpl) GetAlbumByAlbumID(AlbumID string) response.AlbumResponse {
	result := a.AlbumRepository.GetAlbumByAlbumID(AlbumID)

	songsInThisAlbum := a.SongRepository.GetSongByAlbumID(result.AlbumID)

	var albumDuration float64

	for _, song := range songsInThisAlbum {
		albumDuration += song.SongDuration
	}
	albumMinutes := math.Round(albumDuration / 60)
	albumSeconds := albumDuration - float64(albumMinutes*60)
	AlbumDuration := fmt.Sprintf("%.0f", albumMinutes) + " min " + fmt.Sprintf("%.0f", albumSeconds) + " sec"
	albumResponse := response.AlbumResponse{
		AlbumName:          result.AlbumName,
		AlbumImage:         result.AlbumImage,
		AlbumType:          result.AlbumType,
		AlbumUploadDate:    result.AlbumUploadDate,
		UserID:             result.AlbumUserID,
		AlbumID:            result.AlbumID,
		AlbumTotalDuration: AlbumDuration,
	}

	return albumResponse
}

func (a *AlbumServiceImpl) GetAllAlbum() []response.AlbumResponse {
	var AlbumResponses []response.AlbumResponse
	AlbumModel := a.AlbumRepository.GetAllAlbum()
	for _, album := range AlbumModel {
		albumResponse := response.AlbumResponse{
			AlbumID:         album.AlbumID,
			AlbumName:       album.AlbumName,
			AlbumImage:      album.AlbumImage,
			AlbumType:       album.AlbumType,
			AlbumUploadDate: album.AlbumUploadDate,
		}
		AlbumResponses = append(AlbumResponses, albumResponse)
	}
	return AlbumResponses
}
