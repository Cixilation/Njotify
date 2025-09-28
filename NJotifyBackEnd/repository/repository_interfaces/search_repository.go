package repository_interfaces

import "github.com/cixilation/tpaweb/model"

type SearchRepository interface {
	Save(search model.RecentSearches)
	GetRecentSearchByUserID(UserID string) []model.RecentSearches
}
