package repository_interfaces

import (
	"github.com/cixilation/tpaweb/model"
)

type SongRepository interface {
	Save(song model.Song)
	AddSongCount(viewedSong model.ViewedSong)
	GetSongByUserID(UserID string) []model.Song
	GetSongBySongName(SongName string) []model.Song
	GetSongByAlbumID(AlbumID string) []model.Song
	GetSongBySongID(SongID string) model.Song
	GetAllSong() []model.Song
	GetSongListenCount(SongId string) int
	GetLastPlayedTrack(UserId string) []model.ViewedSong
}
