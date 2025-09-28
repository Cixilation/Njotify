package response

type RecentSearchResponse struct {
	SomeID string `json:"id"`
	Type   string `json:"type"`
	Image  string `json:"image"`
	Name   string `json:"name"`
}
