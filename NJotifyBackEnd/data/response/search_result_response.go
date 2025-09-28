package response

type SearchResult struct {
	Songs     []PlaylistDetailResponse `json:"songs"`
	Albums    []PlaylistDetailResponse `json:"album"`
	Artist    []ArtistResponse         `json:"artist"`
	TopSongs  PlaylistDetailResponse   `json:"topSongResult"`
	TopAlbum  PlaylistDetailResponse   `json:"topAlbumResult"`
	TopArtist ArtistResponse           `json:"topArtistResult"`
}
