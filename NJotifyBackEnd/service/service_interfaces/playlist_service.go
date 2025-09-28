package service_interfaces

import (
	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
)

type PlaylistService interface {
	Create(playlist request.CreatePlaylistRequest)
	GetPlaylistByUserID(UserID string) []response.PlaylistResponse
	GetPlaylistByPlaylistID(PlaylistID string) response.PlaylistResponse
	DeletePlaylist(PlaylistID string)
	GetPlaylistEligibility(PlaylistID string, SongID string) bool
	AddToPlaylist(PlaylistID string, SongID string)
	GetPlaylistDetailByPlaylistID(PlaylistId string) response.PlaylistResponse
	DeletePlaylistDetail(PlaylistID string, SongID string)
	GetPublicPlaylist(UserID string) []response.PlaylistResponse
	GetFeaturedPlaylist(UserID string) []response.PlaylistResponse
}
