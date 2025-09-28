package repository_implementation

import (
	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"gorm.io/gorm"
)

type AdvertisementRepositoryImpl struct {
	Db *gorm.DB
}

func NewAdvertisementRepositoryImpl(db *gorm.DB) repository_interfaces.AdvertisementRepository {
	return &AdvertisementRepositoryImpl{Db: db}
}

func (a *AdvertisementRepositoryImpl) GetAdvertisementByRandom() model.Advertisement {
	var ad model.Advertisement
	result := a.Db.Order("RANDOM()").Limit(1).Find(&ad)
	helper.CheckPanic(result.Error)
	return ad

}
