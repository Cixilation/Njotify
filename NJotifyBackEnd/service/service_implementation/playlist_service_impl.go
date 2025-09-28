package service_implementation

import (
	"fmt"
	"math"
	"time"

	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type PlaylistServiceImpl struct {
	playlistRepository repository_interfaces.PlaylistRepository
	albumRepository    repository_interfaces.AlbumRepository
	userRepository     repository_interfaces.UserRepository
	Validate           *validator.Validate
}

func NewPlaylistServiceImpl(playlistRepository repository_interfaces.PlaylistRepository, albumRepository repository_interfaces.AlbumRepository, userRepository repository_interfaces.UserRepository, validate *validator.Validate) service_interfaces.PlaylistService {
	return &PlaylistServiceImpl{
		playlistRepository: playlistRepository,
		albumRepository:    albumRepository,
		userRepository:     userRepository,
		Validate:           validate,
	}
}

func (f *PlaylistServiceImpl) Create(playlist request.CreatePlaylistRequest) {
	id := uuid.New()
	playlistModel := model.Playlist{
		PlaylistID:          id.String(),
		PlaylistName:        playlist.PlaylistName,
		PlaylistDescription: playlist.PlaylistDescription,
		PlaylistUserID:      playlist.UserID,
	}
	f.playlistRepository.Save(playlistModel)
}

func (f *PlaylistServiceImpl) GetPlaylistByUserID(UserID string) []response.PlaylistResponse {
	result := f.playlistRepository.GetPlaylistByUserID(UserID)
	var playlistResponse []response.PlaylistResponse
	for _, result := range result {
		playlistRes := response.PlaylistResponse{
			PlaylistID:            result.PlaylistID,
			PlaylistName:          result.PlaylistName,
			PlaylistDescription:   result.PlaylistDescription,
			TotalPlaylistDuration: result.TotalPlaylistDuration,
			UserID:                result.PlaylistUserID,
		}
		playlistResponse = append(playlistResponse, playlistRes)
	}

	return playlistResponse
}

func (f *PlaylistServiceImpl) GetPlaylistByPlaylistID(PlaylistID string) response.PlaylistResponse {
	result := f.playlistRepository.GetPlaylistByPlaylistID(PlaylistID)
	playlistResponse := response.PlaylistResponse{
		PlaylistID:            result.PlaylistID,
		PlaylistName:          result.PlaylistName,
		PlaylistDescription:   result.PlaylistDescription,
		TotalPlaylistDuration: result.TotalPlaylistDuration,
		UserID:                result.PlaylistUserID,
	}
	return playlistResponse
}

func (f *PlaylistServiceImpl) GetPlaylistEligibility(PlaylistID string, SongID string) bool {
	result := f.playlistRepository.GetPlaylistEligibility(PlaylistID, SongID)
	return result.PlaylistDetailID == ""
}

func (f *PlaylistServiceImpl) DeletePlaylist(PlaylistID string) {
	f.playlistRepository.DeletePlaylist(PlaylistID)
}

func (f *PlaylistServiceImpl) AddToPlaylist(PlaylistID string, SongID string) {
	currentTime := time.Now()
	formattedDate := currentTime.Format("2006/01/02")
	playlistModel := model.PlaylistDetail{
		PlaylistDetailID: PlaylistID,
		DetailSongID:     SongID,
		DateAdded:        formattedDate,
	}
	f.playlistRepository.AddToPlaylist(playlistModel)
}

func (f *PlaylistServiceImpl) GetPlaylistDetailByPlaylistID(PlaylistId string) response.PlaylistResponse {
	Playlist := f.GetPlaylistByPlaylistID(PlaylistId)
	GetPlaylistDetail := f.playlistRepository.GetPlaylistDetailByPlaylistID(PlaylistId)
	var GetPlaylistDetailResponses []response.PlaylistDetailResponse
	var playlistDuration float64
	for _, playlistDetail := range GetPlaylistDetail {
		songResultDuration := playlistDetail.PlaylistDetailSong.SongDuration
		songMinutes := math.Round(songResultDuration / 60)
		songSeconds := songResultDuration - float64(songMinutes*60)
		SongDuration := fmt.Sprintf("%.0f", songMinutes) + " : " + fmt.Sprintf("%.0f", songSeconds)
		playlistDuration += playlistDetail.PlaylistDetailSong.SongDuration
		songResponse := response.SongResponse{
			AlbumID:           playlistDetail.PlaylistDetailSong.SongAlbumID,
			SongID:            playlistDetail.PlaylistDetailSong.SongID,
			SongName:          playlistDetail.PlaylistDetailSong.SongName,
			SongFile:          "http://localhost:8888/song/song/" + playlistDetail.PlaylistDetailSong.SongFile,
			SongDuration:      SongDuration,
			SongTotalListened: fmt.Sprintf("%d", playlistDetail.PlaylistDetailSong.SongTotalListened),
		}
		albumModel := f.albumRepository.GetAlbumByAlbumID(songResponse.AlbumID)
		albumResponse := response.AlbumResponse{
			AlbumID:         albumModel.AlbumID,
			AlbumName:       albumModel.AlbumName,
			AlbumImage:      albumModel.AlbumImage,
			AlbumUploadDate: albumModel.AlbumUploadDate,
			AlbumType:       albumModel.AlbumType,
			UserID:          albumModel.AlbumUserID,
		}
		var userResponse response.UserResponse
		userModel := f.userRepository.GetUserByUserID(albumModel.AlbumUserID)
		userResponse = response.UserResponse{
			UserName: userModel.UserName,
		}
		playlistDetailResponse := response.PlaylistDetailResponse{
			DateAdded:     playlistDetail.DateAdded,
			AlbumResponse: albumResponse,
			SongResponse:  songResponse,
			UserResponse:  userResponse,
		}
		GetPlaylistDetailResponses = append(GetPlaylistDetailResponses, playlistDetailResponse)
	}
	playlistMinutes := math.Round(playlistDuration / 60)
	playlistSeconds := playlistDuration - float64(playlistMinutes*60)
	playlistDurations := fmt.Sprintf("%.0f", playlistMinutes) + " min " + fmt.Sprintf("%.0f", playlistSeconds) + " sec"
	PlaylistResponse := response.PlaylistResponse{
		PlaylistID:            Playlist.PlaylistID,
		PlaylistName:          Playlist.PlaylistName,
		PlaylistDescription:   Playlist.PlaylistDescription,
		TotalPlaylistDuration: playlistDurations,
		PlaylistDetail:        GetPlaylistDetailResponses,
		UserID:                Playlist.UserID,
	}
	return PlaylistResponse
}

func (f *PlaylistServiceImpl) DeletePlaylistDetail(PlaylistID string, SongID string) {
	f.playlistRepository.DeletePlaylistDetail(PlaylistID, SongID)
}

func (f *PlaylistServiceImpl) GetPublicPlaylist(UserID string) []response.PlaylistResponse {
	result := f.playlistRepository.GetPublicPlaylist(UserID)
	var playlistResponses []response.PlaylistResponse
	for _, result := range result {
		playlistResponse := response.PlaylistResponse{
			PlaylistID:            result.PlaylistID,
			PlaylistName:          result.PlaylistName,
			PlaylistDescription:   result.PlaylistDescription,
			TotalPlaylistDuration: result.TotalPlaylistDuration,
			UserID:                result.PlaylistUserID,
		}
		playlistResponses = append(playlistResponses, playlistResponse)
	}
	return playlistResponses
}
func (f *PlaylistServiceImpl) GetFeaturedPlaylist(UserID string) []response.PlaylistResponse {
	result := f.playlistRepository.GetFeaturedPlaylist(UserID)
	var playlistResponses []response.PlaylistResponse
	for _, result := range result {
		playlistResponse := response.PlaylistResponse{
			PlaylistID:            result.PlaylistID,
			PlaylistName:          result.PlaylistName,
			PlaylistDescription:   result.PlaylistDescription,
			TotalPlaylistDuration: result.TotalPlaylistDuration,
			UserID:                result.PlaylistUserID,
		}
		playlistResponses = append(playlistResponses, playlistResponse)
	}
	return playlistResponses
}
