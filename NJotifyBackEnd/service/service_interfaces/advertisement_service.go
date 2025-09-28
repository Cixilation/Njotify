package service_interfaces

import "github.com/cixilation/tpaweb/data/response"

type AdvertisementService interface {
	GetAdvertisementByRandom() response.PlaylistDetailResponse
}
