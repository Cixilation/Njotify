package service_interfaces

import (
	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
)

type SongService interface {
	Save(song request.CreateSongRequest)
	AddSongCount(UserID string, SongID string)
	GetSongByUserID(UserID string) []response.SongResponse
	GetSongBySongID(SongID string) response.SongResponse
	GetSongBySongName(SongName string) []response.SongResponse
	GetSongByAlbumID(AlbumID string) []response.SongResponse
	GetAllSong() []response.PlaylistDetailResponse
	GetLastPlayedTrack(UserID string) []response.PlaylistDetailResponse
}
