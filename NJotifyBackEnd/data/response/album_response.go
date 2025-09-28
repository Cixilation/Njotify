package response

type AlbumResponse struct {
	AlbumID            string `json:"id"`
	AlbumName          string `json:"name"`
	AlbumImage         string `json:"image"`
	AlbumType          string `json:"type"`
	AlbumUploadDate    string `json:"uploadDate"`
	AlbumTotalDuration string `json:"totalduration"`
	UserID             string `json:"userid"`
}
