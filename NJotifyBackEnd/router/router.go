package router

import (
	"github.com/cixilation/tpaweb/controller"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter(searchController *controller.SearchController, userController *controller.UserController, artistController *controller.ArtistController, advertisementController *controller.AdvertisementController, notificationController *controller.NotificationController, followingController *controller.FollowingController, songController *controller.SongController, playlistController *controller.PlaylistController, albumController *controller.AlbumController) *gin.Engine {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8888", "http://localhost:5173", "http://localhost:6369"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "Origin", "Accept"},
		AllowCredentials: true,
	}))
	//User
	router.Static("/profile_pictures", "./assets/profile_picture")
	router.GET("/user/:userID", userController.GetUserByUserID)
	router.PUT("/user/activateaccount/:userID", userController.ActivateUser)
	router.GET("/user/requiresauth", userController.RequireAuth)
	router.GET("/user/getAll", userController.GetAll)
	router.POST("/user/register", userController.Create)
	router.POST("/user/googlelogin", userController.LoginWithGoogle)
	router.POST("/user/login", userController.Login)
	router.POST("/user/logout/:userID", userController.LogOutUser)
	router.POST("/user/forgotaccount/:userEmail", userController.SendForgottenEmail)
	router.POST("/user/resetpassword", userController.ResetPassword)
	router.POST("/user/edituser", userController.SaveUserData)
	router.POST("/user/createadmin", userController.CreateAdminFunction)
	router.POST("/user/updateuserprofile", userController.UpdateUserProfile)

	//Artist
	router.Static("/banner", "./assets/banner")
	router.POST("/user/getverified", artistController.Create)
	router.GET("/user/getverifyrequest", artistController.GetArtistVerificationRequest)
	router.GET("/artist/:artistid", artistController.GetArtist)
	router.POST("/artist/accept/:userid", artistController.AccceptArtistRequest)
	router.POST("/artist/reject/:userid", artistController.RejectArtistRequest)

	//Advertisement
	router.GET("/advertisement", advertisementController.GetAdvertisementByRandom)

	//Notification
	router.PUT("/notification/update", notificationController.UpdateNotificationRequest)
	router.GET("/notification/getNotif/:userid", notificationController.GetNotificationUserPreferences)

	//Following
	router.POST("/follow/delete", followingController.DeleteFollowing)
	router.POST("/follow/create", followingController.CreateFollowing)
	router.GET("/follow/getfollowing/:userid", followingController.GetFollowing)
	router.GET("/follow/getfollower/:userid", followingController.GetFollower)
	router.GET("/follow/getmutuals/:userid1/:userid2", followingController.GetMutual)
	//Using the SSE
	router.GET("/followers/events/:userid", followingController.SSE)

	//Playlist
	router.POST("/playlist/create", playlistController.Create)
	router.GET("/playlist/getuserplaylist/:userid", playlistController.GetPlaylistByUserID)
	router.GET("/playlist/getplaylistbyuserid/:playlistid", playlistController.GetPlaylistByPlaylistID)
	router.POST("/playlist/delete/:playlistid", playlistController.DeletePlaylist)
	router.POST("/playlist/addtoplaylist", playlistController.AddToPlaylist)
	router.GET("/playlist/getplaylistsong/:playlistid", playlistController.GetPlaylistDetailByPlaylistID)
	router.POST("/playlistDetail/delete", playlistController.DeletePlaylistDetail)
	router.GET("/playlist/getpublicplaylist/:userid", playlistController.GetPublicPlaylist)
	router.GET("/playlist/getfeaturedplaylist/:userid", playlistController.GetFeaturedPlaylist)

	//Album
	router.Static("/album/picture", "./assets/album/")
	router.POST("/album/create", albumController.Create)
	router.GET("/album/getalbumbyuserid/:userid", albumController.GetAlbumByUserId)
	router.GET("/album/getalbumbyalbumid/:albumid", albumController.GetAlbumByAlbumID)
	router.GET("/album/getallalbum", albumController.GetAllAlbum)

	//Song
	router.Static("/song/advertisement", "./assets/advertisement/")
	router.Static("/song/song", "./assets/song/")
	router.POST("/song/create", songController.Save)
	router.GET("/song/getallsong", songController.GetAllSong)
	router.GET("/song/getsongbyalbumid/:albumid", songController.GetSongByAlbumID)
	router.GET("/song/getsongbysongid/:songid", songController.GetSongBySongID)
	router.GET("/song/getsongbyuserid/:userid", songController.GetSongByUserID)
	router.POST("/song/addsongcount", songController.AddSongCount)
	router.GET("/song/getlastplayedtrack/:userid", songController.GetLastPlayedTrack)

	//Searches
	router.GET("/searches/search/:search", searchController.Search)
	router.GET("/searches/getrecent/:userid", searchController.GetRecentByUserId)
	router.POST("/searches/save", searchController.Save)

	return router
}
