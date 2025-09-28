package service_interfaces

import "github.com/cixilation/tpaweb/data/response"

type FollowingService interface {
	CreateFollowing(follower string, following string)
	DeleteFollowing(follower string, following string)
	GetFollowing(UserID string) []response.UserResponse
	GetFollower(UserID string) []response.UserResponse
	GetMutual(UserIdOne string, UserIdTwo string) []response.UserResponse
}
