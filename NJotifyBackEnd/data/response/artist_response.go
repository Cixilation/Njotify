package response

type ArtistResponse struct {
	ArtistDescription string       `json:"description"`
	ArtistStatus      string       `json:"status"`
	ArtistBanner      string       `json:"banner"`
	UserResponse      UserResponse `json:"user"`
}
