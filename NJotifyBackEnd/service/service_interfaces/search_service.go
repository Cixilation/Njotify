package service_interfaces

import (
	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
)

type SearchService interface {
	Search(search string) response.SearchResult
	Save(searchesRequest request.RecentSearchRequest)
	GetRecentSearchByUserID(userid string) []response.RecentSearchResponse
}
