package service_implementation

import (
	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/go-playground/validator/v10"
)

type NotificationServiceImpl struct {
	NotificationRepository repository_interfaces.NotificationRepository
	Validate               *validator.Validate
}

func NewNotificationServiceImpl(NotificationRepository repository_interfaces.NotificationRepository, validate *validator.Validate) service_interfaces.NotificationService {
	return &NotificationServiceImpl{
		NotificationRepository: NotificationRepository,
		Validate:               validate,
	}
}

func (n *NotificationServiceImpl) UpdateNotificationSettings(notification request.UpdateNotificationRequest) {
	notificationModel := model.Notification{
		NotificationUserID:  notification.UserId,
		FollowingNotifPhone: notification.FollowingNotifPhone,
		FollowingNotifEmail: notification.FollowingNotifEmail,
		AlbumNotifPhone:     notification.AlbumNotifPhone,
		AlbumNotifEmail:     notification.AlbumNotifEmail,
	}
	n.NotificationRepository.UpdateNotificationSettings(notificationModel)
}

func (n *NotificationServiceImpl) GetNotificationUserPreferences(UserId string) model.Notification {
	return n.NotificationRepository.GetNotificationUserPreferences(UserId)
}
