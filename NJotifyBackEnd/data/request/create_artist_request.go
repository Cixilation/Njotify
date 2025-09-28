package request

type CreateArtistRequest struct {
	UserID          string `json:"userid"`
	UserDescription string `json:"description"`
	UserBanner      string `json:"banner"`
}
