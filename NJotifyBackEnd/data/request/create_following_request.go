package request

type FollowingRequest struct {
	UserFollowerID  string `json:"followerid"`
	UserFollowingID string `json:"followingid"`
}
