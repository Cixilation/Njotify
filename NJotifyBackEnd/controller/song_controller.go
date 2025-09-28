package controller

import (
	"net/http"

	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/gin-gonic/gin"
)

type SongController struct {
	songService service_interfaces.SongService
}

func NewSongController(service service_interfaces.SongService) *SongController {
	return &SongController{
		songService: service,
	}
}

func (s *SongController) Save(ctx *gin.Context) {
	var songRequest request.CreateSongRequest
	songRequest.AlbumID = ctx.PostForm("albumid")
	songRequest.SongName = ctx.PostForm("name")
	songRequest.SongFile = songRequest.AlbumID + "/" + songRequest.SongName + ".mp3"
	file, _ := ctx.FormFile("file")
	filePath := "assets/song/" + songRequest.AlbumID + "/" + songRequest.SongName + ".mp3"
	if err := ctx.SaveUploadedFile(file, filePath); err != nil {
		ctx.JSON(http.StatusInternalServerError, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Failed to save file",
			Data:   nil,
		})
		return
	}
	s.songService.Save(songRequest)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   nil,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (s *SongController) GetSongByAlbumID(ctx *gin.Context) {
	AlbumID := ctx.Param("albumid")
	songResponse := s.songService.GetSongByAlbumID(AlbumID)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   songResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (s *SongController) GetSongBySongID(ctx *gin.Context) {
	songid := ctx.Param("songid")
	songResponse := s.songService.GetSongBySongID(songid)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   songResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (s *SongController) GetSongByUserID(ctx *gin.Context) {
	songid := ctx.Param("userid")
	songResponse := s.songService.GetSongByUserID(songid)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   songResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (s *SongController) AddSongCount(ctx *gin.Context) {
	var AddSongCountRequest struct {
		UserID string `json:"userid"`
		SongID string `json:"songid"`
	}
	err := ctx.ShouldBindJSON(&AddSongCountRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   err.Error(),
		})
		return
	}
	s.songService.AddSongCount(AddSongCountRequest.SongID, AddSongCountRequest.UserID)
}

func (s *SongController) GetLastPlayedTrack(ctx *gin.Context) {
	userid := ctx.Param("userid")
	songResponse := s.songService.GetLastPlayedTrack(userid)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   songResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (s *SongController) GetAllSong(ctx *gin.Context) {
	songResponse := s.songService.GetAllSong()
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   songResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}
