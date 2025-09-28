package controller

import (
	"net/http"

	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/gin-gonic/gin"
)

type PlaylistController struct {
	playlistService service_interfaces.PlaylistService
}

func NewPlaylistController(service service_interfaces.PlaylistService) *PlaylistController {
	return &PlaylistController{
		playlistService: service,
	}
}

func (controller *PlaylistController) Create(ctx *gin.Context) {
	var playlistRequest request.CreatePlaylistRequest

	err := ctx.ShouldBindJSON(&playlistRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   err.Error(),
		})
		return
	}
	controller.playlistService.Create(playlistRequest)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Playlist successfully created!",
		Data:   nil,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *PlaylistController) GetPlaylistByUserID(ctx *gin.Context) {
	UserId := ctx.Param("userid")
	playlistResponse := controller.playlistService.GetPlaylistByUserID(UserId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Fetching all of playlist of this user",
		Data:   playlistResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *PlaylistController) GetPlaylistByPlaylistID(ctx *gin.Context) {
	PlaylistID := ctx.Param("playlistid")
	playlistResponse := controller.playlistService.GetPlaylistByPlaylistID(PlaylistID)
	var webResponse response.WebResponse
	if playlistResponse.PlaylistName == "" {
		webResponse = response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Playlist does not exist!",
			Data:   nil,
		}
	} else {
		webResponse = response.WebResponse{
			Code:   http.StatusOK,
			Status: "Fetching all of playlist of this user",
			Data:   playlistResponse,
		}
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)

}

func (controller *PlaylistController) DeletePlaylist(ctx *gin.Context) {
	PlaylistID := ctx.Param("playlistid")

	controller.playlistService.DeletePlaylist(PlaylistID)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Playlist successfully deleted!",
		Data:   nil,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)

}

func (controller *PlaylistController) AddToPlaylist(ctx *gin.Context) {
	var AddToPlaylistRequest struct {
		Playlistid string `json:"playlistid"`
		Songid     string `json:"songid"`
	}
	err := ctx.ShouldBindJSON(&AddToPlaylistRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "The data that is being sent is wrong!",
			Data:   err.Error(),
		})
		return
	}
	helper.CheckPanic(err)
	playlistDetail := controller.playlistService.GetPlaylistEligibility(AddToPlaylistRequest.Playlistid, AddToPlaylistRequest.Songid)

	if playlistDetail {
		controller.playlistService.AddToPlaylist(AddToPlaylistRequest.Playlistid, AddToPlaylistRequest.Songid)
		webResponse := response.WebResponse{
			Code:   http.StatusOK,
			Status: "Song successfully added!",
			Data:   nil,
		}
		ctx.Header("Access-Control-Allow-Credentials", "true")
		ctx.JSON(http.StatusOK, webResponse)
	} else {
		webResponse := response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Song already exist in this playlist!",
			Data:   nil,
		}
		ctx.Header("Access-Control-Allow-Credentials", "true")
		ctx.JSON(http.StatusOK, webResponse)
	}
}

func (controller *PlaylistController) GetPlaylistDetailByPlaylistID(ctx *gin.Context) {
	PlaylistId := ctx.Param("playlistid")
	PlaylistResponse := controller.playlistService.GetPlaylistDetailByPlaylistID(PlaylistId)
	var webResponse response.WebResponse
	if PlaylistResponse.PlaylistID == "" {
		webResponse = response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Playlist does not exist!",
			Data:   nil,
		}
	} else {
		webResponse = response.WebResponse{
			Code:   http.StatusOK,
			Status: "Fetching all of playlist of this user",
			Data:   PlaylistResponse,
		}
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)

}

func (controller *PlaylistController) DeletePlaylistDetail(ctx *gin.Context) {
	var DeletePlaylistRequest struct {
		Playlistid string `json:"playlistid"`
		Songid     string `json:"songid"`
	}
	err := ctx.ShouldBindJSON(&DeletePlaylistRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "The data that is being sent is wrong!",
			Data:   err.Error(),
		})
		return
	}
	controller.playlistService.DeletePlaylistDetail(DeletePlaylistRequest.Playlistid, DeletePlaylistRequest.Songid)
	helper.CheckPanic(err)

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Playlist Successfully Deleted",
		Data:   nil,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *PlaylistController) GetPublicPlaylist(ctx *gin.Context) {
	userid := ctx.Param("userid")
	playlistResponse := controller.playlistService.GetPublicPlaylist(userid)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Playlist Successfully Deleted",
		Data:   playlistResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}
func (controller *PlaylistController) GetFeaturedPlaylist(ctx *gin.Context) {
	userid := ctx.Param("userid")
	playlistResponse := controller.playlistService.GetFeaturedPlaylist(userid)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Playlist Successfully Deleted",
		Data:   playlistResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}
