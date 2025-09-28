package repository_implementation

import (
	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"gorm.io/gorm"
)

type SearchRepositoryImpl struct {
	Db *gorm.DB
}

func NewSearchRepositoryImpl(db *gorm.DB) repository_interfaces.SearchRepository {
	return &SearchRepositoryImpl{Db: db}
}

func (s *SearchRepositoryImpl) Save(search model.RecentSearches) {
	result := s.Db.Save(&search)
	helper.CheckPanic(result.Error)
}

func (s *SearchRepositoryImpl) GetRecentSearchByUserID(UserID string) []model.RecentSearches {
	var recentSearches []model.RecentSearches
	result := s.Db.Where("recent_user_id = ?", UserID).Order("id desc").Find(&recentSearches)
	helper.CheckPanic(result.Error)

	uniqueSearchesMap := make(map[string]model.RecentSearches)
	var uniqueSearches []model.RecentSearches

	for _, search := range recentSearches {
		if _, exists := uniqueSearchesMap[search.SomeID]; !exists {
			uniqueSearchesMap[search.SomeID] = search
			uniqueSearches = append(uniqueSearches, search)
			if len(uniqueSearches) == 4 {
				break
			}
		}
	}

	return uniqueSearches
}
