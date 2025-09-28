package repository_interfaces

import "github.com/cixilation/tpaweb/model"

type AdvertisementRepository interface {
	GetAdvertisementByRandom() model.Advertisement
}
