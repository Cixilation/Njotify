package service_implementation

import (
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/go-playground/validator/v10"
)

type FollowingServiceImpl struct {
	FollowingRepository repository_interfaces.FollowingRepository
	Validate            *validator.Validate
}

func NewFollowingServiceImpl(followingRepository repository_interfaces.FollowingRepository, validate *validator.Validate) service_interfaces.FollowingService {
	return &FollowingServiceImpl{
		FollowingRepository: followingRepository,
		Validate:            validate,
	}
}

func (f *FollowingServiceImpl) CreateFollowing(follower string, following string) {
	follow := model.Following{
		FollowerUserID:  follower,
		FollowingUserID: following,
	}
	f.FollowingRepository.Save(follow)
}
func (f *FollowingServiceImpl) DeleteFollowing(follower string, following string) {
	follow := model.Following{
		FollowerUserID:  follower,
		FollowingUserID: following,
	}
	f.FollowingRepository.DeleteFollowing(follow)
}

func (f *FollowingServiceImpl) GetFollower(UserID string) []response.UserResponse {
	result := f.FollowingRepository.GetFollowerByUserId(UserID)
	var users []response.UserResponse
	for _, result := range result {
		userResponse := response.UserResponse{
			UserID:             result.UserID,
			UserEmail:          result.UserEmail,
			UserName:           result.UserName,
			UserRole:           result.UserRole,
			UserCountry:        result.UserCountry,
			UserDOB:            result.UserDOB,
			UserGender:         result.UserGender,
			UserProfilePicture: result.UserProfilePicture,
			UserStatus:         result.UserStatus,
		}
		users = append(users, userResponse)
	}
	return users
}

func (f *FollowingServiceImpl) GetFollowing(UserID string) []response.UserResponse {
	result := f.FollowingRepository.GetFollowingByUserId(UserID)
	var users []response.UserResponse
	for _, result := range result {
		userResponse := response.UserResponse{
			UserID:             result.UserID,
			UserEmail:          result.UserEmail,
			UserName:           result.UserName,
			UserRole:           result.UserRole,
			UserCountry:        result.UserCountry,
			UserDOB:            result.UserDOB,
			UserGender:         result.UserGender,
			UserProfilePicture: result.UserProfilePicture,
			UserStatus:         result.UserStatus,
		}
		users = append(users, userResponse)
	}
	return users
}

func (f *FollowingServiceImpl) GetMutual(UserIdOne string, UserIdTwo string) []response.UserResponse {
	result := f.FollowingRepository.GetFollowingMutuals(UserIdOne, UserIdTwo)
	var users []response.UserResponse
	for _, result := range result {
		userResponse := response.UserResponse{
			UserID:             result.UserID,
			UserEmail:          result.UserEmail,
			UserName:           result.UserName,
			UserRole:           result.UserRole,
			UserCountry:        result.UserCountry,
			UserDOB:            result.UserDOB,
			UserGender:         result.UserGender,
			UserProfilePicture: result.UserProfilePicture,
			UserStatus:         result.UserStatus,
		}
		users = append(users, userResponse)
	}
	return users
}
