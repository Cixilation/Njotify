package controller

import (
	"fmt"
	"net/http"

	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/gin-gonic/gin"
)

type NotificationController struct {
	NotificationService service_interfaces.NotificationService
}

func NewNotificationController(service service_interfaces.NotificationService) *NotificationController {
	return &NotificationController{
		NotificationService: service,
	}
}

func (n *NotificationController) UpdateNotificationRequest(ctx *gin.Context) {
	var notificationRequest request.UpdateNotificationRequest
	err := ctx.ShouldBindJSON(&notificationRequest)
	if err != nil {
		fmt.Println(err)
	}
	n.NotificationService.UpdateNotificationSettings(notificationRequest)

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Notification Saved Successfully!",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (n *NotificationController) GetNotificationUserPreferences(ctx *gin.Context) {

	Userid := ctx.Param("userid")

	var notificationResponse struct {
		AlbumemailNotif     string `json:"albumemailnotif"`
		AlbumPhoneNotif     string `json:"albumphonenotif"`
		FollowingEmailNotif string `json:"followingemailnotif"`
		FollowingPhoneNotif string `json:"followingphonenotif"`
	}

	notificationModel := n.NotificationService.GetNotificationUserPreferences(Userid)
	notificationResponse.AlbumPhoneNotif = notificationModel.AlbumNotifPhone
	notificationResponse.AlbumemailNotif = notificationModel.AlbumNotifEmail
	notificationResponse.FollowingEmailNotif = notificationModel.FollowingNotifEmail
	notificationResponse.FollowingPhoneNotif = notificationModel.FollowingNotifPhone

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Getting Notification of the user!",
		Data:   notificationResponse,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

// func (n *NotificationController) SendNotificationEmail(ctx *gin.Context) {
// 	var SendNotificationRequest struct {
// 		Email      string `json:"Email"`
// 		AlbumType  string `json:"AlbumType"`
// 		ArtistName string `json:"artistName"`
// 	}
// 	auth := smtp.PlainAuth(
// 		"",
// 		"marvellavians6@gmail.com",
// 		"kpqz czag brjm sctx",
// 		"smtp.gmail.com",
// 	)
// 	subject := "Subject: Verification Email for NJotify\r\n"
// 	body := fmt.Sprintf("Hey, This Artist %s, has released a new %s. \nGo check them out!", SendNotificationRequest.ArtistName, SendNotificationRequest.AlbumType)
// 	msg := []byte(subject + "\r\n" + body)
// 	// emails = get from follower
// 	// err := smtp.SendMail(
// 	// 	"smtp.gmail.com:587",
// 	// 	auth,
// 	// 	"marvellavians6@mgail.com",
// 	// 	emails,
// 	// 	msg,
// 	// )
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// }
