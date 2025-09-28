package repository_implementation

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/go-redis/redis/v8"
	"gorm.io/gorm"
)

type ArtistRepositoryImpl struct {
	Db    *gorm.DB
	Redis *redis.Client
}

func NewArtistRepositoryImplementation(db *gorm.DB, Redis *redis.Client) repository_interfaces.ArtistRepository {
	return &ArtistRepositoryImpl{Db: db, Redis: Redis}
}

func (a *ArtistRepositoryImpl) GetArtistByArtistID(userID string) model.Artist {
	cacheKey := "artist:" + userID
	var artist model.Artist
	cachedData, err := a.Redis.Get(context.Background(), cacheKey).Result()
	if err == redis.Nil {
		result := a.Db.Where("artist_id = ?", userID).Preload("ArtistUser").Find(&artist)
		helper.CheckPanic(result.Error)
		artistBytes, err := json.Marshal(artist)
		if err == nil {
			err = a.Redis.Set(context.Background(), cacheKey, artistBytes, 10*time.Minute).Err()
			if err != nil {
				fmt.Printf("Failed to cache artist: %v", err)
			}
		}
	} else if err == nil {
		err = json.Unmarshal([]byte(cachedData), &artist)
		if err != nil {
			fmt.Printf("Failed to unmarshal cached data: %v", err)
		}
	}
	return artist
}

func (a *ArtistRepositoryImpl) GetAllArtists() []model.Artist {
	cacheKey := "all_artists"
	var artists []model.Artist
	cachedData, err := a.Redis.Get(context.Background(), cacheKey).Result()
	if err == redis.Nil {
		result := a.Db.Preload("ArtistUser").Find(&artists)
		helper.CheckPanic(result.Error)
		artistBytes, err := json.Marshal(artists)
		if err == nil {
			err = a.Redis.Set(context.Background(), cacheKey, artistBytes, 10*time.Minute).Err()
			if err != nil {
				fmt.Printf("Failed to cache artists: %v", err)
			}
		}
	} else if err == nil {
		err = json.Unmarshal([]byte(cachedData), &artists)
		if err != nil {
			fmt.Printf("Failed to unmarshal cached data: %v", err)
		}
	}
	return artists
}

func (a *ArtistRepositoryImpl) Save(artist model.Artist) {
	result := a.Db.Create(&artist)
	helper.CheckPanic(result.Error)
}

func (a *ArtistRepositoryImpl) GetArtistVerificationRequest() []model.User {
	cacheKey := "artists:verification_requests"
	var unverifiedUsers []model.User

	cachedData, err := a.Redis.Get(context.Background(), cacheKey).Result()
	if err == nil {
		// Data is in cache
		err = json.Unmarshal([]byte(cachedData), &unverifiedUsers)
		if err == nil {
			return unverifiedUsers
		}
		log.Printf("Failed to unmarshal cached data: %v", err)
	}
	var unverifiedArtists []model.Artist
	result := a.Db.Preload("ArtistUser").Where("artist_status = ?", "Unverified").Find(&unverifiedArtists)
	helper.CheckPanic(result.Error)
	for _, artist := range unverifiedArtists {
		unverifiedUsers = append(unverifiedUsers, artist.ArtistUser)
	}

	userBytes, err := json.Marshal(unverifiedUsers)
	if err == nil {
		err = a.Redis.Set(context.Background(), cacheKey, userBytes, 10*time.Minute).Err()
		if err != nil {
			fmt.Printf("Failed to cache artist verification requests: %v", err)
		}
	}
	return unverifiedUsers
}

func (a *ArtistRepositoryImpl) AcceptArtistRequest(UserID string) {
	result := a.Db.Where("artist_id = ?", UserID).Updates(model.Artist{ArtistStatus: "Verified"})
	helper.CheckPanic(result.Error)
	result = a.Db.Preload("ArtistUser").Where("user_id = ?", UserID).Updates(&model.User{UserRole: "Artist"})
	helper.CheckPanic(result.Error)
	cacheKey := "artists:verification_requests"
	err := a.Redis.Del(context.Background(), cacheKey).Err()
	if err != nil {
		fmt.Printf("Failed to invalidate cache: %v", err)
	}
}

func (a *ArtistRepositoryImpl) RejectArtistRequest(UserID string) {
	result := a.Db.Where("artist_id = ?", UserID).Delete(&model.Artist{})
	helper.CheckPanic(result.Error)
	cacheKey := "artists:verification_requests"
	err := a.Redis.Del(context.Background(), cacheKey).Err()
	if err != nil {
		fmt.Printf("Failed to invalidate cache: %v", err)
	}
}
