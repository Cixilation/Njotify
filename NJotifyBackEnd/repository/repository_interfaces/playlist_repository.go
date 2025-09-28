package repository_interfaces

import "github.com/cixilation/tpaweb/model"

type PlaylistRepository interface {
	Save(playlist model.Playlist)
	GetPlaylistByUserID(UserId string) []model.Playlist
	GetPlaylistByPlaylistID(PlaylistID string) model.Playlist
	DeletePlaylist(PlaylistID string)
	GetPlaylistEligibility(PlaylistID string, SongID string) model.PlaylistDetail
	AddToPlaylist(PlaylistDetailModel model.PlaylistDetail)
	GetPlaylistDetailByPlaylistID(PlaylistID string) []model.PlaylistDetail
	DeletePlaylistDetail(PlaylistID string, SongID string)
	GetPublicPlaylist(UserID string) []model.Playlist
	GetFeaturedPlaylist(UserID string) []model.Playlist
}
