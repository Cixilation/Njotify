package service_implementation

import (
	"fmt"
	"math"
	"os"
	"time"

	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/hajimehoshi/go-mp3"
)

type SongServiceImpl struct {
	SongRepository   repository_interfaces.SongRepository
	UserRepository   repository_interfaces.UserRepository
	AlbumRepository  repository_interfaces.AlbumRepository
	ArtistRepository repository_interfaces.ArtistRepository
	Validate         *validator.Validate
}

func NewSongServiceImpl(songRepository repository_interfaces.SongRepository, ArtistRepository repository_interfaces.ArtistRepository, UserRepository repository_interfaces.UserRepository, validate *validator.Validate, AlbumRepository repository_interfaces.AlbumRepository) service_interfaces.SongService {
	return &SongServiceImpl{
		SongRepository:   songRepository,
		UserRepository:   UserRepository,
		AlbumRepository:  AlbumRepository,
		ArtistRepository: ArtistRepository,
		Validate:         validate,
	}
}

func (s *SongServiceImpl) Save(songRequest request.CreateSongRequest) {
	id := uuid.New()
	err := s.Validate.Struct(songRequest)

	helper.CheckPanic(err)
	path := "./assets/song/" + songRequest.SongFile
	file, err := os.Open(path)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()
	decoder, err := mp3.NewDecoder(file)
	if err != nil {
		fmt.Println("Error decoding MP3 file:", err)
		return
	}
	sampleRate := decoder.SampleRate()
	totalSamples := decoder.Length() / 4
	duration := time.Duration(totalSamples) * time.Second / time.Duration(sampleRate)
	roundedDuration := math.Round(duration.Seconds()*100) / 100
	songModel := model.Song{
		SongID:            id.String(),
		SongName:          songRequest.SongName,
		SongFile:          songRequest.SongFile,
		SongAlbumID:       songRequest.AlbumID,
		SongDuration:      roundedDuration,
		SongTotalListened: 0,
	}
	s.SongRepository.Save(songModel)
}

func (s *SongServiceImpl) AddSongCount(SongID string, UserID string) {
	viewedSongModel := model.ViewedSong{
		ViewUserID:   UserID,
		ViewedSongID: SongID,
	}
	s.SongRepository.AddSongCount(viewedSongModel)
}

func (s *SongServiceImpl) GetSongBySongName(SongName string) []response.SongResponse {
	result := s.SongRepository.GetSongBySongName(SongName)
	var songResponses []response.SongResponse
	for _, result := range result {
		songResponse := response.SongResponse{
			SongID:            result.SongID,
			SongName:          result.SongName,
			SongDuration:      fmt.Sprintf("%.2f", result.SongDuration),
			SongFile:          "http://localhost:8888/song/song/" + result.SongFile,
			SongTotalListened: string(result.SongTotalListened),
			AlbumID:           result.SongAlbumID,
		}
		songResponses = append(songResponses, songResponse)
	}
	return songResponses
}

func (s *SongServiceImpl) GetSongByAlbumID(AlbumID string) []response.SongResponse {
	result := s.SongRepository.GetSongByAlbumID(AlbumID)
	var songResponses []response.SongResponse

	for _, result := range result {
		songResultDuration := result.SongDuration
		songMinutes := math.Round(songResultDuration / 60)
		songSeconds := songResultDuration - float64(songMinutes*60)
		SongDuration := fmt.Sprintf("%.0f", songMinutes) + " : " + fmt.Sprintf("%.0f", songSeconds)
		songListenCount := s.SongRepository.GetSongListenCount(result.SongID)
		songResponse := response.SongResponse{
			SongID:            result.SongID,
			SongName:          result.SongName,
			SongDuration:      SongDuration,
			SongFile:          "http://localhost:8888/song/song/" + result.SongFile,
			AlbumID:           result.SongAlbumID,
			SongTotalListened: fmt.Sprintf("%d", songListenCount),
		}
		songResponses = append(songResponses, songResponse)
	}
	return songResponses
}

func (s *SongServiceImpl) GetAllSong() []response.PlaylistDetailResponse {
	result := s.SongRepository.GetAllSong()
	var playlistDetailResponse []response.PlaylistDetailResponse
	for _, result := range result {
		song := result
		sr := response.SongResponse{
			SongID:   song.SongID,
			SongName: song.SongName,
			SongFile: "http://localhost:8888/song/song/" + song.SongFile,
			AlbumID:  song.SongAlbumID,
		}
		album := s.AlbumRepository.GetAlbumByAlbumID(sr.AlbumID)
		ar := response.AlbumResponse{
			AlbumID:         album.AlbumID,
			AlbumImage:      album.AlbumImage,
			AlbumName:       album.AlbumName,
			AlbumUploadDate: album.AlbumUploadDate,
		}
		user := s.UserRepository.GetUserByUserID(album.AlbumUserID)
		ur := response.UserResponse{
			UserID:    user.UserID,
			UserEmail: user.UserName,
			UserName:  user.UserName,
		}
		artist := s.ArtistRepository.GetArtistByArtistID(user.UserID)
		artr := response.ArtistResponse{
			ArtistDescription: artist.ArtistDescription,
		}
		pfr := response.PlaylistDetailResponse{
			SongResponse:   sr,
			AlbumResponse:  ar,
			UserResponse:   ur,
			ArtistResponse: artr,
		}
		playlistDetailResponse = append(playlistDetailResponse, pfr)
	}
	return playlistDetailResponse
}

func (s *SongServiceImpl) GetSongBySongID(SongID string) response.SongResponse {
	result := s.SongRepository.GetSongBySongID(SongID)

	songResultDuration := result.SongDuration
	songMinutes := math.Round(songResultDuration / 60)
	songSeconds := songResultDuration - float64(songMinutes*60)
	SongDuration := fmt.Sprintf("%.0f", songMinutes) + " : " + fmt.Sprintf("%.0f", songSeconds)
	songListenCount := s.SongRepository.GetSongListenCount(result.SongID)

	songResponse := response.SongResponse{
		SongID:            result.SongID,
		SongName:          result.SongName,
		SongDuration:      SongDuration,
		SongFile:          "http://localhost:8888/song/song/" + result.SongFile,
		AlbumID:           result.SongAlbumID,
		SongTotalListened: fmt.Sprintf("%d", songListenCount),
	}
	return songResponse
}

func (s *SongServiceImpl) GetSongByUserID(UserID string) []response.SongResponse {
	result := s.SongRepository.GetSongByUserID(UserID)
	var songResponses []response.SongResponse
	for _, result := range result {
		songResultDuration := result.SongDuration
		songMinutes := math.Round(songResultDuration / 60)
		songSeconds := songResultDuration - float64(songMinutes*60)
		SongDuration := fmt.Sprintf("%.0f", songMinutes) + " : " + fmt.Sprintf("%.0f", songSeconds)
		songListenCount := s.SongRepository.GetSongListenCount(result.SongID)

		songResponse := response.SongResponse{
			SongID:            result.SongID,
			AlbumID:           result.SongAlbumID,
			SongName:          result.SongName,
			SongDuration:      SongDuration,
			SongFile:          "http://localhost:8888/song/song/" + result.SongFile,
			SongTotalListened: fmt.Sprintf("%d", songListenCount),
		}
		songResponses = append(songResponses, songResponse)
	}
	return songResponses

}

func (s *SongServiceImpl) GetLastPlayedTrack(UserID string) []response.PlaylistDetailResponse {
	result := s.SongRepository.GetLastPlayedTrack(UserID)
	var playlistDetailResponse []response.PlaylistDetailResponse
	for _, result := range result {
		song := s.SongRepository.GetSongBySongID(result.ViewedSongID)
		songListenCount := s.SongRepository.GetSongListenCount(result.ViewedSongID)
		sr := response.SongResponse{
			SongID:            song.SongID,
			SongName:          song.SongName,
			SongFile:          "http://localhost:8888/song/song/" + song.SongFile,
			AlbumID:           song.SongAlbumID,
			SongTotalListened: fmt.Sprintf("%d", songListenCount),
		}
		album := s.AlbumRepository.GetAlbumByAlbumID(sr.AlbumID)
		ar := response.AlbumResponse{
			AlbumID:         album.AlbumID,
			AlbumImage:      album.AlbumImage,
			AlbumName:       album.AlbumName,
			AlbumUploadDate: album.AlbumUploadDate,
		}
		user := s.UserRepository.GetUserByUserID(album.AlbumUserID)
		ur := response.UserResponse{
			UserID:    user.UserID,
			UserEmail: user.UserName,
			UserName:  user.UserName,
		}
		artist := s.ArtistRepository.GetArtistByArtistID(user.UserID)
		artr := response.ArtistResponse{
			ArtistDescription: artist.ArtistDescription,
		}
		pfr := response.PlaylistDetailResponse{
			SongResponse:   sr,
			AlbumResponse:  ar,
			UserResponse:   ur,
			ArtistResponse: artr,
		}
		playlistDetailResponse = append(playlistDetailResponse, pfr)
	}
	return playlistDetailResponse
}
