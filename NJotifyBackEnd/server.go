package main

import (
	"net/http"

	"github.com/cixilation/tpaweb/controller"
	"github.com/cixilation/tpaweb/database"
	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/model"
	"github.com/cixilation/tpaweb/repository/repository_implementation"
	"github.com/cixilation/tpaweb/router"
	"github.com/cixilation/tpaweb/service/service_implementation"
	"github.com/go-playground/validator/v10"
)

func main() {

	db := database.ConnectionDatabase()
	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.Following{})
	db.AutoMigrate(&model.Notification{})
	db.AutoMigrate(&model.Artist{})
	db.AutoMigrate(&model.Playlist{})
	db.AutoMigrate(&model.Album{})
	db.AutoMigrate(&model.Song{})
	db.AutoMigrate(&model.PlaylistDetail{})
	db.AutoMigrate(&model.Advertisement{})
	db.AutoMigrate(&model.RecentSearches{})
	db.AutoMigrate(&model.ViewedSong{})

	redis := database.RedisConnection()

	validator := validator.New()

	//Repository
	albumRepository := repository_implementation.NewAlbumRepositoryImpl(db, redis)
	userRepository := repository_implementation.NewUserRepositoryImplementation(db, redis)
	artistRepository := repository_implementation.NewArtistRepositoryImplementation(db, redis)
	advertisementRepository := repository_implementation.NewAdvertisementRepositoryImpl(db)
	notifcationRepository := repository_implementation.NewNotificationRepositoryImpl(db, redis)
	songRepository := repository_implementation.NewSongRepositoryImpl(db, redis)
	followingRepository := repository_implementation.NewFollowingRepositoryImpl(db)
	playlistRepository := repository_implementation.NewPlaylistRepositoryImpl(db, redis)
	searchRepository := repository_implementation.NewSearchRepositoryImpl(db)

	//Service
	playlistService := service_implementation.NewPlaylistServiceImpl(playlistRepository, albumRepository, userRepository, validator)
	userService := service_implementation.NewUserServiceImpl(userRepository, validator)
	artistService := service_implementation.NewArtistServiceImpl(artistRepository, validator)
	songService := service_implementation.NewSongServiceImpl(songRepository, artistRepository, userRepository, validator, albumRepository)
	followingService := service_implementation.NewFollowingServiceImpl(followingRepository, validator)
	albumService := service_implementation.NewAlbumServiceImpl(albumRepository, songRepository, validator)
	notificationService := service_implementation.NewNotificationServiceImpl(notifcationRepository, validator)
	advertisementService := service_implementation.NewAdvertisementService(advertisementRepository, validator)
	searchService := service_implementation.NewSearchServiceImpl(validator, userRepository, searchRepository, albumRepository, songRepository, artistRepository)

	//Controller
	followingController := controller.NewFollowingController(followingService, userService, notificationService)
	notificationController := controller.NewNotificationController(notificationService)
	albumController := controller.NewAlbumController(albumService, userService, followingService, notificationService)
	songController := controller.NewSongController(songService)
	advertisementController := controller.NewAdvertisementController(advertisementService)
	playlistController := controller.NewPlaylistController(playlistService)
	artistController := controller.NewArtistController(artistService, userService)
	userController := controller.NewUserController(userService)
	searchController := controller.NewSearchController(searchService)

	routes := router.NewRouter(searchController, userController, artistController, advertisementController, notificationController, followingController, songController, playlistController, albumController)

	server := &http.Server{
		Addr:    ":8888",
		Handler: routes,
	}

	err := server.ListenAndServe()
	helper.CheckPanic(err)
}
