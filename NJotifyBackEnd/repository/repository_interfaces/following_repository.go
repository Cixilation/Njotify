package repository_interfaces

import "github.com/cixilation/tpaweb/model"

type FollowingRepository interface {
	Save(follow model.Following)
	DeleteFollowing(follow model.Following)
	GetFollowingByUserId(UserId string) []model.User
	GetFollowerByUserId(UserId string) []model.User
	GetFollowingMutuals(UserIdOne string, UserIdTwo string) []model.User
}
