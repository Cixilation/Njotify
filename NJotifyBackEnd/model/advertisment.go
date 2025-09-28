package model

type Advertisement struct {
	AdImage     string `gorm:"type:varchar(255)"`
	AdPublisher string `gorm:"type:varchar(255)"`
	AdFile      string `gorm:"type:varchar(255)"`
}
