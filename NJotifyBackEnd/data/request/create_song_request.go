package request

type CreateSongRequest struct {
	SongName     string `json:"name"`
	SongFile     string `json:"file"`
	AlbumID      string `json:"albumid"`
	SongDuration int    `json:"duration"`
}
