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

type UserRepositoryImpl struct {
	Db    *gorm.DB
	Redis *redis.Client
}

func NewUserRepositoryImplementation(db *gorm.DB, Redis *redis.Client) repository_interfaces.UserRepository {
	return &UserRepositoryImpl{Db: db, Redis: Redis}
}

// NgeCreate User ke dalam DB || menyimpen user ke dalam DB
// Sekalian ngebikin notification ke dalam usernya
func (u *UserRepositoryImpl) Save(user model.User, notification model.Notification) {

	result := u.Db.Create(&user)
	helper.CheckPanic(result.Error)

	result = u.Db.Create(&notification)
	helper.CheckPanic(result.Error)

	userBytes, err := json.Marshal(user)
	if err == nil {
		err := u.Redis.Set(context.Background(), "user:"+user.UserID, userBytes, 0).Err()
		if err != nil {
			fmt.Printf("Failed to cache user: %v", err)
		}
	}
	notificationBytes, err := json.Marshal(notification)
	if err == nil {
		err := u.Redis.Set(context.Background(), "notification:"+notification.NotificationUserID, notificationBytes, 0).Err()
		if err != nil {
			fmt.Printf("Failed to cache notification: %v", err)
		}
	}
}

func (u *UserRepositoryImpl) ActivateAccount(UserID string) {
	result := u.Db.Where("user_id = ?", UserID).Updates(model.User{UserStatus: "Activated"})
	helper.CheckPanic(result.Error)

	cacheKey := "user:id:" + UserID
	err := u.Redis.Del(context.Background(), cacheKey).Err()
	if err != nil {
		fmt.Printf("Failed to invalidate cache for user ID %s: %v", UserID, err)
	}
	var updatedUser model.User
	result = u.Db.Where("user_id = ?", UserID).Find(&updatedUser)
	helper.CheckPanic(result.Error)

	userBytes, err := json.Marshal(updatedUser)
	if err == nil {
		err = u.Redis.Set(context.Background(), cacheKey, userBytes, 0).Err()
		if err != nil {
			fmt.Printf("Failed to update cache for user ID %s: %v", UserID, err)
		}
	}
}

func (u *UserRepositoryImpl) GetUserByUserID(UserId string) model.User {
	var user model.User
	ctx := context.Background()
	cachedUser, err := u.Redis.Get(ctx, "user:"+UserId).Result()
	if err == redis.Nil {
		result := u.Db.Where("user_id = ?", UserId).Find(&user)
		helper.CheckPanic(result.Error)

		userBytes, err := json.Marshal(user)
		if err == nil {
			err := u.Redis.Set(ctx, "user:"+UserId, userBytes, 0).Err()
			if err != nil {
				fmt.Printf("Failed to cache user: %v", err)
			}
		}
	} else if err != nil {
		fmt.Printf("Redis error: %v", err)
	} else {
		err := json.Unmarshal([]byte(cachedUser), &user)
		if err != nil {
			fmt.Printf("Failed to unmarshal cached user: %v", err)
		}
	}
	return user
}

func (u *UserRepositoryImpl) GetUserByUserEmail(UserEmail string) model.User {
	var user model.User
	cacheKey := "user:email:" + UserEmail
	cachedUser, err := u.Redis.Get(context.Background(), cacheKey).Result()
	if err == nil {
		err = json.Unmarshal([]byte(cachedUser), &user)
		if err == nil {
			return user
		}
	}
	result := u.Db.Where("user_email = ?", UserEmail).Find(&user)
	helper.CheckPanic(result.Error)
	userBytes, err := json.Marshal(user)
	if err == nil {
		err = u.Redis.Set(context.Background(), cacheKey, userBytes, 0).Err()
		if err != nil {
			fmt.Printf("Failed to cache user: %v", err)
		}
	}
	return user
}
func (u *UserRepositoryImpl) GetAll() []model.User {
	cacheKey := "users:all"
	var users []model.User
	cachedData, err := u.Redis.Get(context.Background(), cacheKey).Result()
	if err == nil {
		// Data is in cache
		err = json.Unmarshal([]byte(cachedData), &users)
		if err == nil {
			return users
		}
	}
	result := u.Db.Find(&users)
	helper.CheckPanic(result.Error)
	userBytes, err := json.Marshal(users)
	if err == nil {
		err = u.Redis.Set(context.Background(), cacheKey, userBytes, 10*time.Minute).Err()
		if err != nil {
			fmt.Printf("Failed to cache user data: %v", err)
		}
	}
	return users
}

func (u *UserRepositoryImpl) SaveUserData(UserId string, UserDOB string, UserGender string, UserCountry string) {
	result := u.Db.Where("user_id = ?", UserId).Updates(model.User{
		UserDOB:     UserDOB,
		UserCountry: UserCountry,
		UserGender:  UserGender,
	})
	helper.CheckPanic(result.Error)
	var updatedUser model.User
	result = u.Db.Where("user_id = ?", UserId).Find(&updatedUser)
	helper.CheckPanic(result.Error)
	userBytes, err := json.Marshal(updatedUser)
	if err == nil {
		err := u.Redis.Set(context.Background(), "user:"+UserId, userBytes, 0).Err()
		if err != nil {
			fmt.Printf("Failed to cache user: %v", err)
		}
	}
}

func (u *UserRepositoryImpl) ResetPassword(UserId string, UserPassword string) {
	result := u.Db.Where("user_id = ?", UserId).Updates(model.User{UserPassword: UserPassword})
	helper.CheckPanic(result.Error)

	var updatedUser model.User
	result = u.Db.Where("user_id = ?", UserId).Find(&updatedUser)
	helper.CheckPanic(result.Error)

	userBytes, err := json.Marshal(updatedUser)
	if err == nil {
		err := u.Redis.Set(context.Background(), "user:"+UserId, userBytes, 0).Err()
		if err != nil {
			fmt.Printf("Failed to cache user: %v", err)
		}
	}
}
func (u *UserRepositoryImpl) UpdateUserProfile(UserId string, filePath string) {
	result := u.Db.Where("user_id = ?", UserId).Updates(model.User{UserProfilePicture: filePath})
	helper.CheckPanic(result.Error)
	var updatedUser model.User
	result = u.Db.Where("user_id = ?", UserId).Find(&updatedUser)
	helper.CheckPanic(result.Error)
	userBytes, err := json.Marshal(updatedUser)
	if err == nil {
		err := u.Redis.Set(context.Background(), "user:"+UserId, userBytes, 0).Err()
		if err != nil {
			fmt.Printf("Failed to cache user: %v", err)
		}
	}
}
