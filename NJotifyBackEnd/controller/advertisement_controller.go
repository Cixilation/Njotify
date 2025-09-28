package controller

import (
	"net/http"

	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/gin-gonic/gin"
)

type AdvertisementController struct {
	advertisementService service_interfaces.AdvertisementService
}

func NewAdvertisementController(service service_interfaces.AdvertisementService) *AdvertisementController {
	return &AdvertisementController{
		advertisementService: service,
	}
}

func (controller *AdvertisementController) GetAdvertisementByRandom(ctx *gin.Context) {
	advertisementResponse := controller.advertisementService.GetAdvertisementByRandom()
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   advertisementResponse,
	}

	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

// Insert Query
// INSERT INTO advertisements (ad_image, ad_publisher, ad_file)
// VALUES
// ('/profile_pictures/placeholder.png', 'SLC', 'http://localhost:8888/song/advertisement/ads1 - nar.mp3'),
// ('/profile_pictures/placeholder.png', 'Cool Song', 'http://localhost:8888/song/advertisement/ads2 - cool songs.mp3'),
// ('/profile_pictures/placeholder.png', 'NANI', 'http://localhost:8888/song/advertisement/ads3 - open recruitment for felix weeb partner.mp3'),
// ('/profile_pictures/placeholder.png', 'Honkai Star Rail', 'http://localhost:8888/song/advertisement/ads4 - honkai star rail.mp3'),
// ('/profile_pictures/placeholder.png', 'WL', 'http://localhost:8888/song/advertisement/ads5 - merry christmas message.mp3'),
// ('/profile_pictures/placeholder.png', 'Tiktokers', 'http://localhost:8888/song/advertisement/ads6 - view videos on tiktok now!.mp3'),
// ('/profile_pictures/placeholder.png', 'Meledak', 'http://localhost:8888/song/advertisement/ads7 - nar.m4a'),
// ('/profile_pictures/placeholder.png', 'Koko Subco', 'http://localhost:8888/song/advertisement/ads8 - acad600.m4a');
