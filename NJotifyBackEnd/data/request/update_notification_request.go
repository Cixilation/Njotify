package request

type UpdateNotificationRequest struct {
	UserId              string `json:"userid"`
	FollowingNotifPhone string `json:"followingphone"`
	FollowingNotifEmail string `json:"followingemail"`
	AlbumNotifPhone     string `json:"albumphone"`
	AlbumNotifEmail     string `json:"albumemail"`
}
