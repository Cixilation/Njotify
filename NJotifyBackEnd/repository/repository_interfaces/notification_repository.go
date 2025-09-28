package repository_interfaces

import "github.com/cixilation/tpaweb/model"

type NotificationRepository interface {
	UpdateNotificationSettings(notification model.Notification)
	GetNotificationUserPreferences(UserId string) model.Notification
}
