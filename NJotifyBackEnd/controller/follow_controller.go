package controller

import (
	"fmt"
	"net/http"
	"net/smtp"

	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/gin-gonic/gin"
)

type FollowingController struct {
	followingService    service_interfaces.FollowingService
	userService         service_interfaces.UserService
	notificationService service_interfaces.NotificationService
}

func NewFollowingController(service service_interfaces.FollowingService, userService service_interfaces.UserService, notificationService service_interfaces.NotificationService) *FollowingController {
	return &FollowingController{
		followingService:    service,
		userService:         userService,
		notificationService: notificationService,
	}
}

var UserChannels = make(map[string]chan Event)

func (f *FollowingController) CreateFollowing(ctx *gin.Context) {
	var GetFollowingRequest request.FollowingRequest
	err := ctx.ShouldBindJSON(&GetFollowingRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   err.Error(),
		})
		fmt.Println(err)
		return
	}
	notification := f.notificationService.GetNotificationUserPreferences(GetFollowingRequest.UserFollowingID)
	auth := smtp.PlainAuth(
		"",
		"marvellavians6@gmail.com",
		"kpqz czag brjm sctx",
		"smtp.gmail.com",
	)
	subject := "Subject: You have a new follower!\r\n"
	userFollowerResponse := f.userService.GetUserByUserID(GetFollowingRequest.UserFollowerID)
	body := fmt.Sprintf("%s has followed you... ", userFollowerResponse.UserName)
	msg := []byte(subject + "\r\n" + body)

	userFollowingResponse := f.userService.GetUserByUserID(GetFollowingRequest.UserFollowingID)
	email := []string{userFollowingResponse.UserEmail}
	if notification.FollowingNotifEmail == "enabled" {
		err = smtp.SendMail(
			"smtp.gmail.com:587",
			auth,
			"marvellavians6@gmail.com",
			email,
			msg,
		)
		if err != nil {
			fmt.Println(err)
		}
	}

	//Sending the push notification
	f.followingService.CreateFollowing(GetFollowingRequest.UserFollowerID, GetFollowingRequest.UserFollowingID)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}

	FollowerRequest := f.userService.GetUserByUserID(GetFollowingRequest.UserFollowerID)
	event := Event{
		Event: "New follower",
		Data:  fmt.Sprintf(`{"title": "New Follower", "message": "%s followed you!"}`, FollowerRequest.UserName),
	}
	if notification.FollowingNotifPhone == "enabled" {
		if channel, exists := UserChannels[GetFollowingRequest.UserFollowingID]; exists {
			channel <- event
		}
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

type Event struct {
	Event string `json:"event"`
	Data  string `json:"data"`
}

func (f *FollowingController) SSE(ctx *gin.Context) {

	UserID := ctx.Param("userid")
	eventChannel, exists := UserChannels[UserID]
	if !exists {
		eventChannel = make(chan Event)
		UserChannels[UserID] = eventChannel
	}

	w := ctx.Writer
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming not supported", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	// go f.StreamFollowEvents(ctx.Request.Context(), eventChannel)
	for event := range eventChannel {
		fmt.Fprintf(w, "event: %s\n", event.Event)
		fmt.Fprintf(w, "data: %s\n\n", event.Data)
		flusher.Flush()
	}
}

func (f *FollowingController) GetFollowing(ctx *gin.Context) {
	UserId := ctx.Param("userid")
	userResponse := f.followingService.GetFollowing(UserId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   userResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (f *FollowingController) GetFollower(ctx *gin.Context) {
	UserId := ctx.Param("userid")
	userResponse := f.followingService.GetFollower(UserId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   userResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (f *FollowingController) GetMutual(ctx *gin.Context) {
	userid1 := ctx.Param("userid1")
	userid2 := ctx.Param("userid2")
	userResponse := f.followingService.GetMutual(userid1, userid2)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   userResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (f *FollowingController) DeleteFollowing(ctx *gin.Context) {
	var GetFollowingRequest request.FollowingRequest
	err := ctx.ShouldBindJSON(&GetFollowingRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   err.Error(),
		})
		fmt.Println(err)
		return
	}
	f.followingService.DeleteFollowing(GetFollowingRequest.UserFollowerID, GetFollowingRequest.UserFollowingID)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}
