package request

type CreatePlaylistRequest struct {
	UserID              string `json:"userid"`
	PlaylistName        string `json:"name"`
	PlaylistDescription string `json:"description"`
}
