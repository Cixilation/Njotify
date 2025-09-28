package request

type CreateAlbumRequest struct {
	UserId     string `json:"userid"`
	AlbumName  string `json:"name"`
	AlbumType  string `json:"type"`
	AlbumImage string `json:"image"`
}
