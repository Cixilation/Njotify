package repository_interfaces

import "github.com/cixilation/tpaweb/model"

type UserRepository interface {
	Save(user model.User, notification model.Notification)
	GetUserByUserID(UserId string) model.User
	GetUserByUserEmail(UserEmail string) model.User
	ActivateAccount(UserId string)
	ResetPassword(UserId string, UserPassword string)
	SaveUserData(UserId string, UserDOB string, UserGender string, UserCountry string)
	UpdateUserProfile(UserId string, filepath string)
	GetAll() []model.User
}
