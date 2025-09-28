package model

type Album struct {
	AlbumID         string `gorm:"type:varchar(255);primaryKey"`
	AlbumName       string `gorm:"type:varchar(255)"`
	AlbumImage      string `gorm:"type:varchar(255)"`
	AlbumType       string `gorm:"type:varchar(255)"`
	AlbumUploadDate string `gorm:"type:varchar(255)"`
	AlbumUserID     string `gorm:"type:varchar(255)"`

	AlbumUser User `gorm:"foreignKey:AlbumUserID;references:UserID"`
}
