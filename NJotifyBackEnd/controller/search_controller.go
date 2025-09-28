package controller

import (
	"fmt"
	"net/http"

	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/gin-gonic/gin"
)

type SearchController struct {
	SearchService service_interfaces.SearchService
}

func NewSearchController(service service_interfaces.SearchService) *SearchController {
	return &SearchController{
		SearchService: service,
	}
}

func (s *SearchController) Search(ctx *gin.Context) {
	search := ctx.Param("search")
	dataResponse := s.SearchService.Search(search)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   dataResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}

func (s *SearchController) Save(ctx *gin.Context) {
	var searchesRequest request.RecentSearchRequest
	err := ctx.ShouldBindJSON(&searchesRequest)
	if err != nil {
		fmt.Println(err)
	}
	s.SearchService.Save(searchesRequest)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Notification Saved Successfully!",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (s *SearchController) GetRecentByUserId(ctx *gin.Context) {
	userid := ctx.Param("userid")
	dataResponse := s.SearchService.GetRecentSearchByUserID(userid)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   dataResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.JSON(http.StatusOK, webResponse)
}
