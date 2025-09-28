package model

type Following struct {
	FollowerUserID  string `gorm:"type:varchar(255);primaryKey;foreignKey:UserID"`
	FollowingUserID string `gorm:"type:varchar(255);primaryKey;foreignKey:UserID"`

	FollowingUser User `gorm:"foreignKey:FollowingUserID;references:UserID"`
	FollowerUser  User `gorm:"foreignKey:FollowerUserID;references:UserID"`
}
