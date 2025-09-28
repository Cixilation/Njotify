package repository_implementation

import (
	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"gorm.io/gorm"
)

type FollowingRepositoryImpl struct {
	Db *gorm.DB
}

func NewFollowingRepositoryImpl(db *gorm.DB) repository_interfaces.FollowingRepository {
	return &FollowingRepositoryImpl{Db: db}
}

func (f *FollowingRepositoryImpl) Save(follow model.Following) {
	result := f.Db.Create(&follow)
	helper.CheckPanic(result.Error)
}

func (f *FollowingRepositoryImpl) DeleteFollowing(follow model.Following) {
	result := f.Db.Where("follower_user_id = ? AND following_user_id = ?", follow.FollowerUserID, follow.FollowingUserID).Delete(&model.Following{})
	helper.CheckPanic(result.Error)
}

func (f *FollowingRepositoryImpl) GetFollowingByUserId(UserID string) []model.User {
	var followings []model.Following
	result := f.Db.Preload("FollowingUser").Where("follower_user_id = ?", UserID).Find(&followings)
	helper.CheckPanic(result.Error)
	var users []model.User
	for _, follow := range followings {
		users = append(users, follow.FollowingUser)
	}
	return users
}

func (f *FollowingRepositoryImpl) GetFollowerByUserId(UserID string) []model.User {
	var followers []model.Following
	result := f.Db.Preload("FollowerUser").Where("following_user_id = ?", UserID).Find(&followers)
	helper.CheckPanic(result.Error)
	var users []model.User
	for _, follow := range followers {
		users = append(users, follow.FollowerUser)
	}
	return users
}
func (f *FollowingRepositoryImpl) GetFollowingMutuals(UserID1 string, UserID2 string) []model.User {
	var followings1 []model.Following
	var followings2 []model.Following
	result := f.Db.Preload("FollowingUser").Where("follower_user_id = ?", UserID1).Find(&followings1)
	helper.CheckPanic(result.Error)
	result = f.Db.Preload("FollowingUser").Where("follower_user_id = ?", UserID2).Find(&followings2)
	helper.CheckPanic(result.Error)
	followingMap := make(map[string]model.User)
	for _, follow := range followings1 {
		followingMap[follow.FollowingUserID] = follow.FollowingUser
	}
	var mutuals []model.User
	for _, follow := range followings2 {
		if user, exists := followingMap[follow.FollowingUserID]; exists {
			mutuals = append(mutuals, user)
		}
	}
	return mutuals
}
