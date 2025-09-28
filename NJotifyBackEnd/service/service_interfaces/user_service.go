package service_interfaces

import (
	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
)

type UserService interface {
	Create(users request.CreateUserRequest)
	CreateAdminFunction(users request.CreateUserRequest)
	GetUserByUserID(UserId string) response.UserResponse
	GetUserByUserEmail(UserEmail string) response.UserResponse
	CompareUserPassword(UserPassword string, UserEmail string) bool
	PasswordExist(UserEmail string) bool
	ActivateAccount(UserId string)
	ResetPassword(UserId string, UserPassword string)
	GetAll() []response.UserResponse
	SaveUserData(UserId string, UserDOB string, UserGender string, UserCountry string)
	UpdateUserProfile(UserId string, FilePath string)
	// GetUserBySong ()
}
