package model

type Playlist struct {
	PlaylistID            string `gorm:"type:varchar(255);primaryKey;"`
	PlaylistUserID        string `gorm:"type:varchar(255);foreignKey:UserID"`
	PlaylistName          string `gorm:"type:varchar(255)"`
	PlaylistDescription   string `gorm:"type:varchar(255)"`
	TotalPlaylistDuration string `gorm:"type:varchar(255)"`
	PlaylistUser          User   `gorm:"foreignKey:PlaylistUserID;references:UserID"`
}
