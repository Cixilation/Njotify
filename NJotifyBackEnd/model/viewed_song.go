package model

type ViewedSong struct {
	ID           uint   `gorm:"primaryKey;autoIncrement"`
	ViewedSongID string `gorm:"type:varchar(255);"`
	ViewUserID   string `gorm:"type:varchar(255);"`
}
