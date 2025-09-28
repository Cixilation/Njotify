package service_implementation

import (
	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserServiceImpl struct {
	UserRepository repository_interfaces.UserRepository
	Validate       *validator.Validate
}

func NewUserServiceImpl(userRepository repository_interfaces.UserRepository, validate *validator.Validate) service_interfaces.UserService {
	return &UserServiceImpl{
		UserRepository: userRepository,
		Validate:       validate,
	}
}
func (u *UserServiceImpl) CreateAdminFunction(user request.CreateUserRequest) {
	id := uuid.New()
	err := u.Validate.Struct(user)
	helper.CheckPanic(err)
	userModel := model.User{
		UserID:             id.String(),
		UserName:           user.UserName,
		UserStatus:         user.UserStatus,
		UserProfilePicture: user.UserProfilePicture,
		UserEmail:          user.UserEmail,
		UserPassword:       user.UserPassword,
		UserDOB:            "06/06/2000",
		UserRole:           "Admin",
	}
	notification := model.Notification{
		NotificationUserID:  id.String(),
		FollowingNotifPhone: "disabled",
		FollowingNotifEmail: "disabled",
		AlbumNotifPhone:     "disabled",
		AlbumNotifEmail:     "disabled",
	}
	u.UserRepository.Save(userModel, notification)
}

func (u *UserServiceImpl) Create(user request.CreateUserRequest) {
	id := uuid.New()
	err := u.Validate.Struct(user)
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.UserPassword), bcrypt.DefaultCost)
	helper.CheckPanic(err)
	userModel := model.User{
		UserID:             id.String(),
		UserName:           user.UserName,
		UserStatus:         user.UserStatus,
		UserProfilePicture: "placeholder.png",
		UserEmail:          user.UserEmail,
		UserPassword:       string(hashedPassword),
		UserDOB:            "06/06/2000",
		UserRole:           "Listener",
	}
	notification := model.Notification{
		NotificationUserID:  id.String(),
		FollowingNotifPhone: "disabled",
		FollowingNotifEmail: "disabled",
		AlbumNotifPhone:     "disabled",
		AlbumNotifEmail:     "disabled",
	}
	u.UserRepository.Save(userModel, notification)
}

func (u *UserServiceImpl) GetUserByUserID(UserId string) response.UserResponse {
	result := u.UserRepository.GetUserByUserID(UserId)
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
	return userResponse
}

func (u *UserServiceImpl) GetUserByUserEmail(UserEmail string) response.UserResponse {
	result := u.UserRepository.GetUserByUserEmail(UserEmail)
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
	return userResponse
}
func (u *UserServiceImpl) PasswordExist(UserEmail string) bool {
	result := u.UserRepository.GetUserByUserEmail(UserEmail)
	return result.UserPassword != ""
}

func (u *UserServiceImpl) CompareUserPassword(UserPassword string, UserEmail string) bool {
	user := u.UserRepository.GetUserByUserEmail(UserEmail)
	err := bcrypt.CompareHashAndPassword([]byte(user.UserPassword), []byte(UserPassword))
	return err == nil
}

func (u *UserServiceImpl) GetAll() []response.UserResponse {
	result := u.UserRepository.GetAll()
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

func (u *UserServiceImpl) ActivateAccount(UserID string) {
	u.UserRepository.ActivateAccount(UserID)
}

func (u *UserServiceImpl) ResetPassword(UserID string, UserPassword string) {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(UserPassword), bcrypt.DefaultCost)
	u.UserRepository.ResetPassword(UserID, string(hashedPassword))
}

func (u *UserServiceImpl) SaveUserData(UserId string, UserDOB string, UserGender string, UserCountry string) {
	u.UserRepository.SaveUserData(UserId, UserDOB, UserGender, UserCountry)
}

func (u *UserServiceImpl) UpdateUserProfile(UserId string, filepath string) {
	u.UserRepository.UpdateUserProfile(UserId, filepath)
}
