package service_interfaces

import (
	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/model"
)

type NotificationService interface {
	UpdateNotificationSettings(notification request.UpdateNotificationRequest)
	GetNotificationUserPreferences(UserID string) model.Notification
}
