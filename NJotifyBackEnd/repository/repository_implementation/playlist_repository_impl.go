package repository_implementation

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/go-redis/redis/v8"
	"gorm.io/gorm"
)

type PlaylistRepositoryImpl struct {
	Db    *gorm.DB
	Redis *redis.Client
}

func NewPlaylistRepositoryImpl(db *gorm.DB, Redis *redis.Client) repository_interfaces.PlaylistRepository {
	return &PlaylistRepositoryImpl{Db: db, Redis: Redis}
}

func (p *PlaylistRepositoryImpl) Save(playlist model.Playlist) {
	result := p.Db.Create(&playlist)
	helper.CheckPanic(result.Error)

	cacheKey := "playlists:user:" + playlist.PlaylistUserID
	err := p.Redis.Del(context.Background(), cacheKey).Err()
	if err != nil {
		fmt.Printf("Failed to invalidate cache: %v", err)
	}
}

func (p *PlaylistRepositoryImpl) AddToPlaylist(playlistDetail model.PlaylistDetail) {
	result := p.Db.Create(&playlistDetail)
	helper.CheckPanic(result.Error)

	cacheKey := "playlist_details:" + playlistDetail.PlaylistDetailID
	err := p.Redis.Del(context.Background(), cacheKey).Err()
	if err != nil {
		fmt.Printf("Failed to invalidate cache: %v", err)
	}
}

func (p *PlaylistRepositoryImpl) GetPlaylistByUserID(UserID string) []model.Playlist {
	cacheKey := "playlists:user:" + UserID
	var playlists []model.Playlist

	cachedData, err := p.Redis.Get(context.Background(), cacheKey).Result()
	if err == nil {
		err = json.Unmarshal([]byte(cachedData), &playlists)
		if err == nil {
			return playlists
		}
	}

	result := p.Db.Where("playlist_user_id = ?", UserID).Find(&playlists)
	helper.CheckPanic(result.Error)
	playlistBytes, err := json.Marshal(playlists)
	if err == nil {
		err = p.Redis.Set(context.Background(), cacheKey, playlistBytes, 10*time.Minute).Err()
		if err != nil {
			fmt.Printf("Failed to cache playlists: %v", err)
		}
	}
	return playlists
}

func (p *PlaylistRepositoryImpl) GetPlaylistByPlaylistID(PlaylistID string) model.Playlist {
	cacheKey := "playlist:" + PlaylistID
	var playlist model.Playlist
	cachedData, err := p.Redis.Get(context.Background(), cacheKey).Result()
	if err == nil {
		err = json.Unmarshal([]byte(cachedData), &playlist)
		if err == nil {
			return playlist
		}
		fmt.Printf("Failed to unmarshal cached data: %v", err)
	}
	result := p.Db.Where("playlist_id = ?", PlaylistID).Find(&playlist)
	helper.CheckPanic(result.Error)
	playlistBytes, err := json.Marshal(playlist)
	if err == nil {
		err = p.Redis.Set(context.Background(), cacheKey, playlistBytes, 10*time.Minute).Err()
		if err != nil {
			fmt.Printf("Failed to cache playlist: %v", err)
		}
	}
	return playlist
}

func (p *PlaylistRepositoryImpl) DeletePlaylist(PlaylistID string) {
	result := p.Db.Where("playlist_id = ?", PlaylistID).Delete(&model.Playlist{})
	helper.CheckPanic(result.Error)

	cacheKey := "playlist:" + PlaylistID
	err := p.Redis.Del(context.Background(), cacheKey).Err()
	if err != nil {
		fmt.Printf("Failed to invalidate cache: %v", err)
	}
}

func (p *PlaylistRepositoryImpl) GetPlaylistEligibility(PlaylistID string, SongID string) model.PlaylistDetail {
	cacheKey := "playlist_eligibility:" + PlaylistID + ":" + SongID
	var playlistDetail model.PlaylistDetail
	cachedData, err := p.Redis.Get(context.Background(), cacheKey).Result()
	if err == nil {
		err = json.Unmarshal([]byte(cachedData), &playlistDetail)
		if err == nil {
			return playlistDetail
		}
		fmt.Printf("Failed to unmarshal cached data: %v", err)
	}
	result := p.Db.Preload("Playlist").Where("playlist_detail_id = ? AND detail_song_id = ?", PlaylistID, SongID).Find(&playlistDetail)
	helper.CheckPanic(result.Error)
	playlistDetailBytes, err := json.Marshal(playlistDetail)
	if err == nil {
		err = p.Redis.Set(context.Background(), cacheKey, playlistDetailBytes, 10*time.Minute).Err()
		if err != nil {
			fmt.Printf("Failed to cache playlist detail: %v", err)
		}
	}
	return playlistDetail
}

func (p *PlaylistRepositoryImpl) GetPlaylistDetailByPlaylistID(PlaylistID string) []model.PlaylistDetail {
	cacheKey := "playlist_details:" + PlaylistID
	var playlistDetails []model.PlaylistDetail

	cachedData, err := p.Redis.Get(context.Background(), cacheKey).Result()
	if err == nil {
		err = json.Unmarshal([]byte(cachedData), &playlistDetails)
		if err == nil {
			return playlistDetails
		}
	}

	result := p.Db.Preload("PlaylistDetailSong").Where("playlist_detail_id = ?", PlaylistID).Find(&playlistDetails)
	helper.CheckPanic(result.Error)

	// Cache the data
	playlistDetailsBytes, err := json.Marshal(playlistDetails)
	if err == nil {
		err = p.Redis.Set(context.Background(), cacheKey, playlistDetailsBytes, 10*time.Minute).Err()
		if err != nil {
			fmt.Printf("Failed to cache playlist details: %v", err)
		}
	}

	return playlistDetails
}

func (p *PlaylistRepositoryImpl) DeletePlaylistDetail(PlaylistID string, SongID string) {
	result := p.Db.Where("playlist_detail_id = ? AND detail_song_id = ?", PlaylistID, SongID).Delete(&model.PlaylistDetail{})
	helper.CheckPanic(result.Error)

	cacheKey := "playlist_details:" + PlaylistID
	err := p.Redis.Del(context.Background(), cacheKey).Err()
	if err != nil {
		fmt.Printf("Failed to invalidate cache: %v", err)
	}
}

func (p *PlaylistRepositoryImpl) GetPublicPlaylist(UserID string) []model.Playlist {
	return p.GetPlaylistByUserID(UserID)
}

func (p *PlaylistRepositoryImpl) GetFeaturedPlaylist(UserID string) []model.Playlist {
	cacheKey := "featured_playlists:" + UserID
	var playlists []model.Playlist
	cachedData, err := p.Redis.Get(context.Background(), cacheKey).Result()
	if err == nil {
		err = json.Unmarshal([]byte(cachedData), &playlists)
		if err == nil {
			return playlists
		}
	}
	result := p.Db.
		Preload("PlaylistUser").
		Joins("JOIN playlist_details ON playlists.playlist_id = playlist_details.playlist_detail_id").
		Joins("JOIN songs ON playlist_details.detail_song_id = songs.song_id").
		Joins("JOIN albums ON songs.song_album_id = albums.album_id").
		Where("albums.album_user_id = ?", UserID).
		Find(&playlists)
	helper.CheckPanic(result.Error)
	playlistsBytes, err := json.Marshal(playlists)
	if err == nil {
		err = p.Redis.Set(context.Background(), cacheKey, playlistsBytes, 10*time.Minute).Err()
		if err != nil {
			fmt.Printf("Failed to cache featured playlists: %v", err)
		}
	}
	return playlists
}
