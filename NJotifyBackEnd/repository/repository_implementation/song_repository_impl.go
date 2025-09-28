package repository_implementation

import (
	"context"
	"encoding/json"

	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/go-redis/redis/v8"
	"gorm.io/gorm"
)

type SongRepositoryImpl struct {
	Db    *gorm.DB
	Redis *redis.Client
}

func NewSongRepositoryImpl(db *gorm.DB, Redis *redis.Client) repository_interfaces.SongRepository {
	return &SongRepositoryImpl{Db: db, Redis: Redis}

}

func (s *SongRepositoryImpl) Save(song model.Song) {
	result := s.Db.Create(&song)
	helper.CheckPanic(result.Error)
}
func (s *SongRepositoryImpl) GetSongByUserID(UserID string) []model.Song {
	cacheKey := "songs:user:" + UserID
	ctx := context.Background()

	cachedData, err := s.Redis.Get(ctx, cacheKey).Result()
	if err == nil {
		var songs []model.Song
		json.Unmarshal([]byte(cachedData), &songs)
		return songs
	}
	var songs []model.Song
	result := s.Db.Joins("JOIN albums ON songs.song_album_id = albums.album_id").
		Where("albums.album_user_id = ?", UserID).
		Preload("SongAlbum").
		Preload("SongAlbum.AlbumUser").
		Find(&songs)
	helper.CheckPanic(result.Error)

	data, _ := json.Marshal(songs)
	s.Redis.Set(ctx, cacheKey, data, 0).Err()

	return songs
}

func (s *SongRepositoryImpl) GetSongBySongName(SongName string) []model.Song {
	cacheKey := "songs:name:" + SongName
	ctx := context.Background()
	cachedData, err := s.Redis.Get(ctx, cacheKey).Result()
	if err == nil {
		var songs []model.Song
		json.Unmarshal([]byte(cachedData), &songs)
		return songs
	}

	var songs []model.Song
	result := s.Db.Where("song_name = ?", SongName).Find(&songs)
	helper.CheckPanic(result.Error)

	data, _ := json.Marshal(songs)
	s.Redis.Set(ctx, cacheKey, data, 0).Err()

	return songs
}

func (s *SongRepositoryImpl) GetAllSong() []model.Song {
	cacheKey := "songs:all"
	ctx := context.Background()
	cachedData, err := s.Redis.Get(ctx, cacheKey).Result()
	if err == nil {
		var songs []model.Song
		json.Unmarshal([]byte(cachedData), &songs)
		return songs
	}

	var songs []model.Song
	result := s.Db.Find(&songs)
	helper.CheckPanic(result.Error)

	data, _ := json.Marshal(songs)
	s.Redis.Set(ctx, cacheKey, data, 0).Err()

	return songs
}

func (s *SongRepositoryImpl) GetSongByAlbumID(AlbumID string) []model.Song {
	var song []model.Song
	result := s.Db.Where("song_album_id = ?", AlbumID).Find(&song)
	helper.CheckPanic(result.Error)
	return song
}

func (s *SongRepositoryImpl) AddSongCount(viewedSong model.ViewedSong) {
	result := s.Db.Create(&viewedSong)
	helper.CheckPanic(result.Error)
}

func (s *SongRepositoryImpl) GetSongBySongID(SongID string) model.Song {
	var song model.Song
	result := s.Db.Where("song_id = ?", SongID).Find(&song)
	helper.CheckPanic(result.Error)
	return song
}

func (s *SongRepositoryImpl) GetSongListenCount(SongID string) int {
	var viewedSongs []model.ViewedSong
	result := s.Db.Where("viewed_song_id = ?", SongID).Find(&viewedSongs)
	helper.CheckPanic(result.Error)
	return len(viewedSongs)
}

func (s *SongRepositoryImpl) GetLastPlayedTrack(UserID string) []model.ViewedSong {
	var viewedSongs []model.ViewedSong
	result := s.Db.Where("view_user_id= ?", UserID).Find(&viewedSongs)
	helper.CheckPanic(result.Error)
	return viewedSongs
}
