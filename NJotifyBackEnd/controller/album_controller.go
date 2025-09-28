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

type AlbumController struct {
	albumService        service_interfaces.AlbumService
	userService         service_interfaces.UserService
	notificationService service_interfaces.NotificationService
	followingService    service_interfaces.FollowingService
}

func NewAlbumController(service service_interfaces.AlbumService, userService service_interfaces.UserService, followingService service_interfaces.FollowingService, notificationService service_interfaces.NotificationService) *AlbumController {
	return &AlbumController{
		albumService:        service,
		notificationService: notificationService,
		userService:         userService,
		followingService:    followingService,
	}
}

func (a *AlbumController) Create(ctx *gin.Context) {
	var CreateAlbumRequest request.CreateAlbumRequest
	CreateAlbumRequest.UserId = ctx.PostForm("userid")
	CreateAlbumRequest.AlbumName = ctx.PostForm("name")
	CreateAlbumRequest.AlbumType = ctx.PostForm("type")
	CreateAlbumRequest.AlbumImage = CreateAlbumRequest.UserId + "_" + CreateAlbumRequest.AlbumName + ".jpeg"

	user := a.userService.GetUserByUserID(CreateAlbumRequest.UserId)

	GetFollowers := a.followingService.GetFollower(CreateAlbumRequest.UserId)
	message = user.UserName + " has released a new Album!"

	for _, follow := range GetFollowers {
		a.SendNewSongNotif(message, user.UserName, follow.UserID)
	}

	file, _ := ctx.FormFile("albumCover")
	filePath := "assets/album/" + CreateAlbumRequest.UserId + "_" + CreateAlbumRequest.AlbumName + ".jpeg"
	if err := ctx.SaveUploadedFile(file, filePath); err != nil {
		ctx.JSON(http.StatusInternalServerError, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Failed to save file",
			Data:   nil,
		})
		return
	}

	albumRequest := a.albumService.Save(CreateAlbumRequest)

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Album Succesfully Created!",
		Data:   albumRequest,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (a *AlbumController) SendNewSongNotif(msg string, artistName string, userID string) {
	notification := a.notificationService.GetNotificationUserPreferences(userID)
	auth := smtp.PlainAuth(
		"",
		"marvellavians6@gmail.com",
		"kpqz czag brjm sctx",
		"smtp.gmail.com",
	)
	subject := "Subject: An artist has released a new Album!\r\n"
	body := fmt.Sprintf("%s released a new album!\r\n", artistName)
	msge := []byte(subject + "\r\n" + body)

	userFollowingResponse := a.userService.GetUserByUserID(userID)
	email := []string{userFollowingResponse.UserEmail}
	if notification.AlbumNotifEmail == "enabled" {
		err := smtp.SendMail(
			"smtp.gmail.com:587",
			auth,
			"marvellavians6@gmail.com",
			email,
			msge,
		)
		if err != nil {
			fmt.Println(err)
		}
	}

	event := Event{
		Event: "New follower",
		Data:  fmt.Sprintf(`{"title": "New Music", "message": "%s"}`, msg),
	}
	if notification.AlbumNotifPhone == "enabled" {
		if channel, exists := UserChannels[userID]; exists {
			channel <- event
		}
	}
}

func (a *AlbumController) GetAlbumByUserId(ctx *gin.Context) {
	UserID := ctx.Param("userid")
	albumResponse := a.albumService.GetAlbumByUserId(UserID)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Album successfully fetched!",
		Data:   albumResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (a *AlbumController) GetAlbumByAlbumID(ctx *gin.Context) {
	AlbumID := ctx.Param("albumid")
	albumResponse := a.albumService.GetAlbumByAlbumID(AlbumID)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Album successfully fetched!",
		Data:   albumResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)

}

func (a *AlbumController) GetAllAlbum(ctx *gin.Context) {
	albumResponse := a.albumService.GetAllAlbum()
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Album successfully fetched!",
		Data:   albumResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}
