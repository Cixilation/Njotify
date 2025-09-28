package model

type PlaylistDetail struct {
	PlaylistDetailID string `gorm:"type:varchar(255);primaryKey"`
	DetailSongID     string `gorm:"type:varchar(255);primaryKey"`
	DateAdded        string `gorm:"type:varchar(255)"`

	Playlist           Playlist `gorm:"foreignKey:PlaylistDetailID;references:PlaylistID"`
	PlaylistDetailSong Song     `gorm:"foreignKey:DetailSongID;references:SongID;"`
}
