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

type AlbumRepositoryImpl struct {
	Db    *gorm.DB
	Redis *redis.Client
}

func NewAlbumRepositoryImpl(db *gorm.DB, Redis *redis.Client) repository_interfaces.AlbumRepository {
	return &AlbumRepositoryImpl{Db: db, Redis: Redis}
}

func (a *AlbumRepositoryImpl) Save(album model.Album) {
	result := a.Db.Create(&album)
	helper.CheckPanic(result.Error)
}
func (a *AlbumRepositoryImpl) GetAlbumByUserId(UserId string) []model.Album {
	cacheKey := "albums:user:" + UserId
	var albums []model.Album
	cachedData, err := a.Redis.Get(context.Background(), cacheKey).Result()
	if err == redis.Nil {
		result := a.Db.Preload("AlbumUser").Where("album_user_id = ?", UserId).Find(&albums)
		helper.CheckPanic(result.Error)
		albumsBytes, err := json.Marshal(albums)
		if err == nil {
			err = a.Redis.Set(context.Background(), cacheKey, albumsBytes, 10*time.Minute).Err()
			if err != nil {
				fmt.Printf("Failed to cache albums for user %s: %v", UserId, err)
			}
		}
	} else if err == nil {
		err = json.Unmarshal([]byte(cachedData), &albums)
		if err != nil {
			fmt.Printf("Failed to unmarshal cached data: %v", err)
		}
	}
	return albums
}

func (a *AlbumRepositoryImpl) GetAlbumByAlbumID(AlbumID string) model.Album {
	cacheKey := "album:" + AlbumID
	var album model.Album
	cachedData, err := a.Redis.Get(context.Background(), cacheKey).Result()
	if err == redis.Nil {
		result := a.Db.Where("album_id = ?", AlbumID).Find(&album)
		helper.CheckPanic(result.Error)

		albumBytes, err := json.Marshal(album)
		if err == nil {
			err = a.Redis.Set(context.Background(), cacheKey, albumBytes, 10*time.Minute).Err()
			if err != nil {
				fmt.Printf("Failed to cache album %s: %v", AlbumID, err)
			}
		}
	} else if err == nil {
		err = json.Unmarshal([]byte(cachedData), &album)
		if err != nil {
			fmt.Printf("Failed to unmarshal cached data: %v", err)
		}
	}
	return album
}

func (a *AlbumRepositoryImpl) GetAllAlbum() []model.Album {
	cacheKey := "albums:all"
	var albums []model.Album
	cachedData, err := a.Redis.Get(context.Background(), cacheKey).Result()
	if err == redis.Nil {
		result := a.Db.Find(&albums)
		helper.CheckPanic(result.Error)
		albumsBytes, err := json.Marshal(albums)
		if err == nil {
			err = a.Redis.Set(context.Background(), cacheKey, albumsBytes, 10*time.Minute).Err()
			if err != nil {
				fmt.Printf("Failed to cache all albums: %v", err)
			}
		}
	} else if err == nil {
		err = json.Unmarshal([]byte(cachedData), &albums)
		if err != nil {
			fmt.Printf("Failed to unmarshal cached data: %v", err)
		}
	}

	return albums
}
