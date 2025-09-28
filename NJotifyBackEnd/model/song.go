package model

type Song struct {
	SongID            string  `gorm:"type:varchar(255);primaryKey"`
	SongName          string  `gorm:"type:varchar(255)"`
	SongFile          string  `gorm:"type:varchar(255)"`
	SongAlbumID       string  `gorm:"type:varchar(255)"`
	SongDuration      float64 `gorm:"type:float"`
	SongTotalListened int32   `gorm:"type:int"`

	SongAlbum Album `gorm:"foreignKey:SongAlbumID;references:AlbumID"`
}
