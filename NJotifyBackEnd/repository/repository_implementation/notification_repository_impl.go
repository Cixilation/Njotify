package repository_implementation

import (
	"context"
	"encoding/json"
	"log"

	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/go-redis/redis/v8"
	"gorm.io/gorm"
)

type NotificationRepositoryImpl struct {
	Db    *gorm.DB
	Redis *redis.Client
}

func NewNotificationRepositoryImpl(db *gorm.DB, redisClient *redis.Client) repository_interfaces.NotificationRepository {
	return &NotificationRepositoryImpl{
		Db:    db,
		Redis: redisClient,
	}
}

func (n *NotificationRepositoryImpl) UpdateNotificationSettings(notification model.Notification) {
	result := n.Db.Where("notification_user_id = ?", notification.NotificationUserID).Updates(model.Notification{
		FollowingNotifPhone: notification.FollowingNotifPhone,
		FollowingNotifEmail: notification.FollowingNotifEmail,
		AlbumNotifPhone:     notification.AlbumNotifPhone,
		AlbumNotifEmail:     notification.AlbumNotifEmail,
	})
	helper.CheckPanic(result.Error)
	notificationBytes, err := json.Marshal(notification)
	if err == nil {
		err := n.Redis.Set(context.Background(), "notification:"+notification.NotificationUserID, notificationBytes, 0).Err()
		if err != nil {
			log.Printf("Failed to cache notification settings: %v", err)
		}
	} else {
		log.Printf("Failed to marshal notification settings: %v", err)
	}
}

func (n *NotificationRepositoryImpl) GetNotificationUserPreferences(UserId string) model.Notification {
	var notification model.Notification
	cacheKey := "notification:" + UserId

	cachedNotification, err := n.Redis.Get(context.Background(), cacheKey).Result()
	if err == nil {
		if err := json.Unmarshal([]byte(cachedNotification), &notification); err == nil {
			return notification
		}
	} else if err != redis.Nil {
		log.Printf("Redis error: %v", err)
	}
	result := n.Db.Where("notification_user_id = ?", UserId).Find(&notification)
	helper.CheckPanic(result.Error)

	notificationBytes, err := json.Marshal(notification)
	if err == nil {
		err := n.Redis.Set(context.Background(), cacheKey, notificationBytes, 0).Err()
		if err != nil {
			log.Printf("Failed to cache notification settings: %v", err)
		}
	}
	return notification
}
