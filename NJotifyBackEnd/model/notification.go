package model

type Notification struct {
	NotificationUserID  string `gorm:"type:varchar(255);primaryKey;foreignKey:UserID"`
	FollowingNotifPhone string `gorm:"type:varchar(255)"`
	FollowingNotifEmail string `gorm:"type:varchar(255)"`
	AlbumNotifPhone     string `gorm:"type:varchar(255)"`
	AlbumNotifEmail     string `gorm:"type:varchar(255)"`
	NotificationUser    User   `gorm:"foreignKey:NotificationUserID;references:UserID"`
}
