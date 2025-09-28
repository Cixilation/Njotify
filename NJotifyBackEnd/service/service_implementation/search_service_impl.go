package service_implementation

import (
	"fmt"
	"sort"

	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_interfaces"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/go-playground/validator/v10"
)

type SearchServiceImpl struct {
	Validate         *validator.Validate
	SearchRepository repository_interfaces.SearchRepository
	AlbumRepository  repository_interfaces.AlbumRepository
	SongRepository   repository_interfaces.SongRepository
	ArtistRepository repository_interfaces.ArtistRepository
	UserRespository  repository_interfaces.UserRepository
}

func NewSearchServiceImpl(validate *validator.Validate, UserRespository repository_interfaces.UserRepository, SearchRepository repository_interfaces.SearchRepository, AlbumRepository repository_interfaces.AlbumRepository, SongRepository repository_interfaces.SongRepository, ArtistRepository repository_interfaces.ArtistRepository) service_interfaces.SearchService {
	return &SearchServiceImpl{
		Validate:         validate,
		UserRespository:  UserRespository,
		SearchRepository: SearchRepository,
		ArtistRepository: ArtistRepository,
		SongRepository:   SongRepository,
		AlbumRepository:  AlbumRepository,
	}
}

func (s *SearchServiceImpl) GetRecentSearchByUserID(userid string) []response.RecentSearchResponse {
	searchModel := s.SearchRepository.GetRecentSearchByUserID(userid)
	var searchResultResponse []response.RecentSearchResponse
	for _, result := range searchModel {
		searchResult := response.RecentSearchResponse{
			Type:   result.Type,
			Image:  result.Picture,
			SomeID: result.SomeID,
		}
		if searchResult.Type == "Album" {
			album := s.AlbumRepository.GetAlbumByAlbumID(searchResult.SomeID)
			searchResult.Name = album.AlbumName
		} else if searchResult.Type == "Track" {
			song := s.SongRepository.GetSongBySongID(searchResult.SomeID)
			searchResult.Name = song.SongName
		} else if searchResult.Type == "VerifiedArtist" {
			user := s.UserRespository.GetUserByUserID(searchResult.SomeID)
			searchResult.Name = user.UserName
		}
		searchResultResponse = append(searchResultResponse, searchResult)
	}
	return searchResultResponse
}

func (s *SearchServiceImpl) Save(searchesRequest request.RecentSearchRequest) {
	searchModel := model.RecentSearches{
		SomeID:       searchesRequest.SomeID,
		Type:         searchesRequest.Type,
		RecentUserID: searchesRequest.RecentUserID,
		Picture:      searchesRequest.Image,
	}
	s.SearchRepository.Save(searchModel)

}
func Min(a, b, c, d int) int {
	min := a
	if b < min {
		min = b
	}
	if c < min {
		min = c
	}
	if d < min {
		min = d
	}
	return min
}

func DamerauLevenshteinDistance(a, b string) int {
	da := make(map[rune]int)
	d := make([][]int, len(a)+2)
	for i := range d {
		d[i] = make([]int, len(b)+2)
	}
	maxdist := len(a) + len(b)
	d[0][0] = maxdist
	for i := 1; i <= len(a)+1; i++ {
		d[i][0] = maxdist
		d[i][1] = i - 1
	}
	for j := 1; j <= len(b)+1; j++ {
		d[0][j] = maxdist
		d[1][j] = j - 1
	}
	for i := 2; i <= len(a)+1; i++ {
		db := 0
		for j := 2; j <= len(b)+1; j++ {
			k := da[rune(b[j-2])]
			l := db
			cost := 0
			if a[i-2] != b[j-2] {
				cost = 1
				db = j - 1
			}
			d[i][j] = Min(d[i-1][j-1]+cost, d[i][j-1]+1, d[i-1][j]+1, d[k][l]+(i-k-1)+1+(j-l-1))
		}
		da[rune(a[i-2])] = i - 1
	}
	return d[len(a)+1][len(b)+1]
}

func (s *SearchServiceImpl) Search(search string) response.SearchResult {
	var searchResult response.SearchResult

	allAlbums := s.AlbumRepository.GetAllAlbum()
	allSongs := s.SongRepository.GetAllSong()
	allArtists := s.ArtistRepository.GetAllArtists()

	var matchedAlbums []response.AlbumResponse
	var matchedSongs []response.SongResponse
	var matchedArtists []response.ArtistResponse

	minDistance := 100
	var TopSong response.SongResponse
	var TopAlbum response.AlbumResponse
	var TopArtist response.ArtistResponse
	topResultType := ""

	// Search albums
	for _, album := range allAlbums {
		distance := DamerauLevenshteinDistance(search, album.AlbumName)
		if distance <= 5 {
			albumResponse := response.AlbumResponse{
				AlbumID:    album.AlbumID,
				AlbumImage: album.AlbumImage,
				AlbumName:  album.AlbumName,
				UserID:     album.AlbumUserID,
			}
			matchedAlbums = append(matchedAlbums, albumResponse)
			if distance < minDistance {
				topResultType = "Album"
				minDistance = distance
				TopAlbum = albumResponse
			}
		}
	}

	// Search songs
	for _, song := range allSongs {
		distance := DamerauLevenshteinDistance(search, song.SongName)
		if distance <= 5 {
			songResponse := response.SongResponse{
				SongID:   song.SongID,
				SongName: song.SongName,
				AlbumID:  song.SongAlbumID,
			}
			matchedSongs = append(matchedSongs, songResponse)
			if distance < minDistance {
				topResultType = "Song"
				minDistance = distance
				TopSong = songResponse
			}
		}
	}

	// Search artists
	for _, artist := range allArtists {
		user := s.UserRespository.GetUserByUserID(artist.ArtistUser.UserID)
		distance := DamerauLevenshteinDistance(search, user.UserName)
		if distance <= 5 {
			userResponse := response.UserResponse{
				UserID:             user.UserID,
				UserName:           user.UserName,
				UserProfilePicture: user.UserProfilePicture,
			}
			artistResponse := response.ArtistResponse{
				UserResponse: userResponse,
			}
			matchedArtists = append(matchedArtists, artistResponse)
			if distance < minDistance {
				topResultType = "Artist"
				minDistance = distance
				TopArtist = artistResponse
			}
		}
	}

	var albumsRessultReponse []response.PlaylistDetailResponse
	for _, album := range matchedAlbums {
		user := s.UserRespository.GetUserByUserID(album.UserID)
		userResponse := response.UserResponse{
			UserID:             user.UserID,
			UserName:           user.UserName,
			UserProfilePicture: user.UserProfilePicture,
		}
		albumRessultReponse := response.PlaylistDetailResponse{
			AlbumResponse: album,
			UserResponse:  userResponse,
		}
		albumsRessultReponse = append(albumsRessultReponse, albumRessultReponse)
	}

	var songsResultResponse []response.PlaylistDetailResponse
	if len(matchedSongs) > 5 {
		matchedSongs = matchedSongs[:5]
	}
	for _, song := range matchedSongs {
		album := s.AlbumRepository.GetAlbumByAlbumID(song.AlbumID)
		albumResponse := response.AlbumResponse{
			AlbumID:    album.AlbumID,
			AlbumName:  album.AlbumName,
			AlbumImage: album.AlbumImage,
		}
		user := s.UserRespository.GetUserByUserID(album.AlbumUserID)
		userResponse := response.UserResponse{
			UserID:             user.UserID,
			UserName:           user.UserName,
			UserProfilePicture: user.UserProfilePicture,
		}

		songResultResponse := response.PlaylistDetailResponse{
			SongResponse:  song,
			UserResponse:  userResponse,
			AlbumResponse: albumResponse,
		}
		songsResultResponse = append(songsResultResponse, songResultResponse)
	}
	searchResult.Albums = albumsRessultReponse
	searchResult.Songs = songsResultResponse
	searchResult.Artist = matchedArtists

	if topResultType == "Album" {
		user := s.UserRespository.GetUserByUserID(TopAlbum.UserID)
		userResponse := response.UserResponse{
			UserID:             user.UserID,
			UserName:           user.UserName,
			UserProfilePicture: user.UserProfilePicture,
		}
		albumRessultReponse := response.PlaylistDetailResponse{
			AlbumResponse: TopAlbum,
			UserResponse:  userResponse,
		}
		song := s.SongRepository.GetSongByAlbumID(TopAlbum.AlbumID)
		var songResponses []response.PlaylistDetailResponse
		for _, songModel := range song {
			songResponse := response.SongResponse{
				SongID:   songModel.SongID,
				SongName: songModel.SongName,
			}
			songs := response.PlaylistDetailResponse{
				SongResponse:  songResponse,
				AlbumResponse: albumRessultReponse.AlbumResponse,
				UserResponse:  albumRessultReponse.UserResponse,
			}
			songResponses = append(songResponses, songs)
		}
		searchResult.Songs = songResponses
		searchResult.TopAlbum = albumRessultReponse
	} else if topResultType == "Artist" {
		searchResult.TopArtist = TopArtist
		song := s.SongRepository.GetSongByUserID(TopArtist.UserResponse.UserID)
		var songResponses []response.SongResponse
		for _, songModel := range song {
			songListenCount := s.SongRepository.GetSongListenCount(songModel.SongID)
			songResponse := response.SongResponse{
				SongID:            songModel.SongID,
				SongName:          songModel.SongName,
				AlbumID:           songModel.SongAlbumID,
				SongTotalListened: fmt.Sprintf("%d", songListenCount),
			}
			songResponses = append(songResponses, songResponse)
		}
		sort.Slice(songResponses, func(i, j int) bool {
			return songResponses[i].SongTotalListened > songResponses[j].SongTotalListened
		})
		if len(songResponses) > 5 {
			songResponses = songResponses[:5]
		}
		var playlistDetail []response.PlaylistDetailResponse
		for _, songResponse := range songResponses {
			album := s.AlbumRepository.GetAlbumByAlbumID(songResponse.AlbumID)
			albumResponse := response.AlbumResponse{
				AlbumID:    album.AlbumID,
				AlbumName:  album.AlbumName,
				AlbumImage: album.AlbumImage,
			}
			pd := response.PlaylistDetailResponse{
				AlbumResponse:  albumResponse,
				SongResponse:   songResponse,
				ArtistResponse: TopArtist,
			}
			playlistDetail = append(playlistDetail, pd)
		}
		searchResult.Songs = playlistDetail
	} else if topResultType == "Song" {
		album := s.AlbumRepository.GetAlbumByAlbumID(TopSong.AlbumID)
		user := s.UserRespository.GetUserByUserID(album.AlbumUserID)
		albumResponse := response.AlbumResponse{
			AlbumID:    album.AlbumID,
			AlbumName:  album.AlbumName,
			AlbumImage: album.AlbumImage,
		}
		userResponse := response.UserResponse{
			UserID:             user.UserID,
			UserName:           user.UserName,
			UserProfilePicture: user.UserProfilePicture,
		}
		songResultResponse := response.PlaylistDetailResponse{
			SongResponse:  TopSong,
			AlbumResponse: albumResponse,
			UserResponse:  userResponse,
		}
		searchResult.TopSongs = songResultResponse
	}
	return searchResult
}
