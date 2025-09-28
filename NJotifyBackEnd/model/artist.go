package model

type Artist struct {
	ArtistID          string `gorm:"type:varchar(255);primaryKey;foreignKey:ArtistID"`
	ArtistDescription string `gorm:"type:varchar(255)"`
	ArtistStatus      string `gorm:"type:varchar(255)"`
	ArtistBanner      string `gorm:"type:varchar(255)"`
	ArtistUser        User   `gorm:"foreignKey:ArtistID;references:UserID"`
}
