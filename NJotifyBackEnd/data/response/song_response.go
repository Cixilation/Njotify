package response

type SongResponse struct {
	SongID            string `json:"id"`
	SongName          string `json:"name"`
	SongFile          string `json:"file"`
	AlbumID           string `json:"albumid"`
	SongDuration      string `json:"duration"`
	SongTotalListened string `json:"totallistened"`
}
