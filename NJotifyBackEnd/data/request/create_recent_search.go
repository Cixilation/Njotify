package request

type RecentSearchRequest struct {
	SomeID       string `json:"id"`
	Type         string `json:"type"`
	RecentUserID string `json:"userid"`
	Image        string `json:"image"`
}
