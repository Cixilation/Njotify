package model

type RecentSearches struct {
	ID           uint   `gorm:"primaryKey;autoIncrement"`
	SomeID       string `gorm:"type:varchar(255)"`
	Picture      string `gorm:"type:varchar(255)"`
	Type         string `gorm:"type:varchar(255)"`
	RecentUserID string `gorm:"type:varchar(255);"`
}
