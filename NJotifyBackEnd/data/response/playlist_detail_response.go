package response

type PlaylistDetailResponse struct {
	DateAdded      string         `json:"date"`
	AlbumResponse  AlbumResponse  `json:"album"`
	SongResponse   SongResponse   `json:"songs"`
	UserResponse   UserResponse   `json:"user"`
	ArtistResponse ArtistResponse `json:"artist"`
}
