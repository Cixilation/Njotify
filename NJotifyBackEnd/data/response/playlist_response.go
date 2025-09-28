package response

type PlaylistResponse struct {
	UserID                string                   `json:"userid"`
	PlaylistID            string                   `json:"id"`
	PlaylistName          string                   `json:"name"`
	PlaylistDescription   string                   `json:"description"`
	TotalPlaylistDuration string                   `json:"duration"`
	PlaylistDetail        []PlaylistDetailResponse `json:"playlistdetail"`
}
