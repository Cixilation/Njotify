package controller

import (
	"net/http"

	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/gin-gonic/gin"
)

var code = http.StatusOK
var message = ""

type ArtistController struct {
	artistService service_interfaces.ArtistService
	userService   service_interfaces.UserService
}

func NewArtistController(artistServices service_interfaces.ArtistService, userServices service_interfaces.UserService) *ArtistController {
	return &ArtistController{
		artistService: artistServices,
		userService:   userServices,
	}
}

func (controller *ArtistController) Create(ctx *gin.Context) {
	message = "Request successfully sent!"
	var artistRequest request.CreateArtistRequest
	artistRequest.UserID = ctx.PostForm("userid")
	artistRequest.UserDescription = ctx.PostForm("description")

	artistInDB := controller.artistService.GetArtistByArtistID(artistRequest.UserID)
	file, _ := ctx.FormFile("banner")
	filePath := "assets/banner/" + "banner_" + artistRequest.UserID + ".jpeg"
	if err := ctx.SaveUploadedFile(file, filePath); err != nil {
		ctx.JSON(http.StatusInternalServerError, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Failed to save file",
			Data:   nil,
		})
		return
	}
	artistRequest.UserBanner = "banner_" + artistRequest.UserID + ".jpeg"
	if artistInDB.UserResponse.UserID != "" {
		message = "You already sent this request!"
		code = http.StatusBadRequest
	} else {
		controller.artistService.Create(artistRequest)
	}

	webResponse := response.WebResponse{
		Code:   code,
		Status: message,
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *ArtistController) GetArtistVerificationRequest(ctx *gin.Context) {
	userResponse := controller.artistService.GetArtistVerificationRequest()
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   userResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-Max")
	ctx.JSON(http.StatusOK, webResponse)

}

func (controller *ArtistController) RejectArtistRequest(ctx *gin.Context) {
	UserId := ctx.Param("userid")
	controller.artistService.RejectArtistRequest(UserId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "request has been declined",
		Data:   nil,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *ArtistController) AccceptArtistRequest(ctx *gin.Context) {
	UserId := ctx.Param("userid")
	controller.artistService.AcceptArtistRequest(UserId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "request has been accepted",
		Data:   nil,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *ArtistController) GetArtist(ctx *gin.Context) {
	ArtistId := ctx.Param("artistid")
	artistResponse := controller.artistService.GetArtistByArtistID(ArtistId)
	if artistResponse.ArtistDescription == "" {
		webResponse := response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Artist does not exist!",
			Data:   nil,
		}
		ctx.Header("Access-Control-Allow-Credentials", "true")
		ctx.JSON(http.StatusOK, webResponse)
	} else {
		webResponse := response.WebResponse{
			Code:   http.StatusOK,
			Status: "request has been accepted",
			Data:   artistResponse,
		}
		ctx.Header("Access-Control-Allow-Credentials", "true")
		ctx.JSON(http.StatusOK, webResponse)
	}
}
