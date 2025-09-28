package controller

import (
	"fmt"
	"net/http"
	"net/smtp"
	"time"

	"github.com/cixilation/tpaweb/data/request"
	"github.com/cixilation/tpaweb/data/response"
	"github.com/cixilation/tpaweb/helper"
	"github.com/cixilation/tpaweb/service/service_interfaces"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("i love the world - VU24-1")

type UserController struct {
	userService service_interfaces.UserService
}

func NewUserController(service service_interfaces.UserService) *UserController {
	return &UserController{
		userService: service,
	}
}

func (controller *UserController) GetAll(ctx *gin.Context) {
	userResponse := controller.userService.GetAll()
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   userResponse,
	}
	ctx.Header("Access-Control-Allow-Credentials", "true")
	ctx.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-Max")
	ctx.JSON(http.StatusOK, webResponse)

}

func (controller *UserController) Create(ctx *gin.Context) {
	// userDOBString := ctx.Param("userDOB")
	// userDOB, _ := time.Parse("2006-01-02", userDOBString)
	var userRequest request.CreateUserRequest
	err := ctx.ShouldBindJSON(&userRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   err.Error(),
		})
		return
	}
	helper.CheckPanic(err)
	userInDB := controller.userService.GetUserByUserEmail(userRequest.UserEmail)
	var webResponse response.WebResponse

	if userInDB.UserID == "" {
		user := request.CreateUserRequest{
			UserEmail:          userRequest.UserEmail,
			UserName:           userRequest.UserName,
			UserPassword:       userRequest.UserPassword,
			UserStatus:         userRequest.UserStatus,
			UserProfilePicture: userRequest.UserProfilePicture,
		}

		controller.userService.Create(user)
		userInDB := controller.userService.GetUserByUserEmail(user.UserEmail)
		sendVerificationEmail(userInDB.UserID, []string{userInDB.UserEmail})
		webResponse = response.WebResponse{
			Code:   http.StatusOK,
			Status: "Succesfully created user!",
			Data:   nil,
		}
	} else {
		webResponse = response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Email already exist! Log in your account?",
			Data:   nil,
		}
	}

	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func sendVerificationEmail(userID string, userEmail []string) {
	auth := smtp.PlainAuth(
		"",
		"marvellavians6@gmail.com",
		"kpqz czag brjm sctx",
		"smtp.gmail.com",
	)
	activationLink := fmt.Sprintf("http://localhost:5173/AccountActivation/%s", userID)
	subject := "Subject: Verification Email for NJotify\r\n"
	body := fmt.Sprintf("Please activate your account using the following link: \n %s", activationLink)
	msg := []byte(subject + "\r\n" + body)
	err := smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		"marvellavians6@gmail.com",
		userEmail,
		msg,
	)
	if err != nil {
		fmt.Println(err)
	}
}
func (controller *UserController) LoginWithGoogle(ctx *gin.Context) {
	fmt.Println("Logging in with Google!")
	var userRequest request.CreateUserRequest
	err := ctx.ShouldBindJSON(&userRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   err.Error(),
		})
		fmt.Println(err)
		return
	}
	helper.CheckPanic(err)

	userInDB := controller.userService.GetUserByUserEmail(userRequest.UserEmail)
	var webResponse response.WebResponse
	var message string

	if userInDB.UserID == "" {
		user := request.CreateUserRequest{
			UserEmail:          userRequest.UserEmail,
			UserName:           userRequest.UserName,
			UserPassword:       userRequest.UserPassword,
			UserStatus:         userRequest.UserStatus,
			UserProfilePicture: userRequest.UserProfilePicture,
		}
		controller.userService.Create(user)
		userInDB = controller.userService.GetUserByUserEmail(user.UserEmail)
		message = "Welcome to NJotify! Reset your password to log in Normally."

	} else {
		message = "Welcome back!"
	}
	controller.PutCookie(ctx, userInDB.UserEmail)
	userResponse := response.UserResponse{
		UserID:             userInDB.UserID,
		UserEmail:          userInDB.UserEmail,
		UserName:           userInDB.UserName,
		UserRole:           userInDB.UserRole,
		UserCountry:        userInDB.UserCountry,
		UserDOB:            userInDB.UserDOB,
		UserGender:         userInDB.UserGender,
		UserProfilePicture: userInDB.UserProfilePicture,
		UserStatus:         userInDB.UserStatus,
	}
	ctx.Header("Content-type", "application/json")
	webResponse = response.WebResponse{
		Code:   http.StatusOK,
		Status: message,
		Data:   userResponse,
	}
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *UserController) ActivateUser(ctx *gin.Context) {
	fmt.Println("Getting User")
	userId := ctx.Param("userID")
	controller.userService.ActivateAccount(userId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Account has been activated!",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *UserController) Login(ctx *gin.Context) {

	fmt.Println("Manual Login")
	var userRequest request.CreateUserRequest
	err := ctx.ShouldBindJSON(&userRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   err.Error(),
		})
		fmt.Println(err)
		return
	}
	helper.CheckPanic(err)

	userInDB := controller.userService.GetUserByUserEmail(userRequest.UserEmail)
	var webResponse response.WebResponse
	var message string
	var code int

	if userInDB.UserID == "" {
		fmt.Println("User dosen't exist!")
		message = "User dosen't exist!"
		code = http.StatusBadRequest

	} else {
		fmt.Printf("user already exist " + userInDB.UserID)
		if controller.userService.CompareUserPassword(userRequest.UserPassword, userInDB.UserEmail) {
			if userInDB.UserStatus == "Unactivated" {
				message = "Please activate your account in your email!"
				code = http.StatusBadGateway
			} else {
				code = http.StatusOK
				message = "Welcome back!"
				controller.PutCookie(ctx, userInDB.UserEmail)
			}
		} else {
			if !controller.userService.PasswordExist(userInDB.UserEmail) {
				code = http.StatusBadGateway
				message = "Password has not beet set for this user!"
			} else {

				code = http.StatusBadRequest
				message = "Credential is Wrong!"
			}
		}
	}
	userResponse := response.UserResponse{
		UserID:             userInDB.UserID,
		UserEmail:          userInDB.UserEmail,
		UserName:           userInDB.UserName,
		UserRole:           userInDB.UserRole,
		UserCountry:        userInDB.UserCountry,
		UserDOB:            userInDB.UserDOB,
		UserGender:         userInDB.UserGender,
		UserProfilePicture: userInDB.UserProfilePicture,
		UserStatus:         userInDB.UserStatus,
	}

	fmt.Println(userResponse)
	webResponse = response.WebResponse{
		Code:   code,
		Status: message,
		Data:   userResponse,
	}

	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *UserController) PutCookie(ctx *gin.Context, userEmail string) {
	userInDB := controller.userService.GetUserByUserEmail(userEmail)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userInDB.UserID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to crate token",
		})
	}
	ctx.SetSameSite(http.SameSiteLaxMode)
	ctx.SetCookie("Authorization", tokenString, 3600*24*30, "/", "", false, true)
}

func (controller *UserController) RequireAuth(ctx *gin.Context) {
	ctx.Next()
	tokenString, err := ctx.Cookie("Authorization")
	code := http.StatusOK
	status := "It is the same user!"
	userID := ""
	if err != nil {
		fmt.Println(err)
	}
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			fmt.Println(err)
		}
		return jwtSecret, nil
	})
	if err != nil {
		code = http.StatusBadRequest
		status = "User Cookie Expired!"
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		//Expired
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			ctx.SetCookie("Authorization", "", -1, "/", "", false, true)
			code = http.StatusGatewayTimeout
			status = "User Cookie Expired!"
		}
		userID = claims["sub"].(string)
	} else {
		code = http.StatusBadRequest
		status = "JWT token is not valid!"
	}
	userResponse := controller.userService.GetUserByUserID(userID)
	webResponse := response.WebResponse{
		Code:   code,
		Status: status,
		Data:   userResponse,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *UserController) LogOutUser(ctx *gin.Context) {
	ctx.Header("Access-Control-Allow-Credentials", "true")
	fmt.Println("Logging user out!!!!!!!")

	userID := ctx.Param("userID")
	fmt.Println("UserID from param:", userID)
	tokenString, err := ctx.Cookie("Authorization")
	if err != nil {
		// Handle error if the cookie is not found or there is an issue
		fmt.Println("Error retrieving cookie:", err)
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "No authorization token provided",
			Data:   nil,
		})
		return
	}
	fmt.Println("Authorization token:", tokenString)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		fmt.Println("Error parsing token:", err)
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Invalid authorization token",
			Data:   nil,
		})
		return
	}

	cookieUserID := ""
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		cookieUserID = claims["sub"].(string)
	} else {
		ctx.JSON(http.StatusUnauthorized, response.WebResponse{
			Code:   http.StatusUnauthorized,
			Status: "Unauthorized request detected!",
			Data:   nil,
		})
		return
	}

	if userID != cookieUserID {
		ctx.JSON(http.StatusUnauthorized, response.WebResponse{
			Code:   http.StatusUnauthorized,
			Status: "Unauthorized request detected!",
			Data:   nil,
		})
		return
	}
	ctx.SetCookie("Authorization", "", -1, "/", "", false, true)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Successfully logged out!",
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *UserController) GetUserByUserID(ctx *gin.Context) {
	userId := ctx.Param("userID")
	userResponse := controller.userService.GetUserByUserID(userId)

	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Ok",
		Data:   userResponse,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *UserController) SendForgottenEmail(ctx *gin.Context) {
	userEmail := ctx.Param("userEmail")
	userInDb := controller.userService.GetUserByUserEmail(userEmail)
	code := http.StatusOK
	status := "Please check your email to reset your password!"

	auth := smtp.PlainAuth(
		"",
		"marvellavians6@gmail.com",
		"kpqz czag brjm sctx",
		"smtp.gmail.com",
	)

	if userInDb.UserID == "" {
		code = http.StatusBadRequest
		status = "Account does not exist!"

	} else {
		activationLink := fmt.Sprintf("http://localhost:5173/ResetPassword/%s", userInDb.UserID)
		subject := "Subject: Forgotten Account NJotify\r\n"
		body := fmt.Sprintf("Retrieve your account by reseting your password.\n  Continues with to this link: \n %s", activationLink)
		msg := []byte(subject + "\r\n" + body)

		email := []string{userEmail}
		err := smtp.SendMail(
			"smtp.gmail.com:587",
			auth,
			"marvellavians6@gmail.com",
			email,
			msg,
		)
		if err != nil {
			fmt.Println(err)
		}
	}
	webResponse := response.WebResponse{
		Code:   code,
		Status: status,
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *UserController) ResetPassword(ctx *gin.Context) {
	var ResetPassword struct {
		UserId       string `json:"userid"`
		UserPassword string `json:"password"`
	}
	err := ctx.ShouldBindJSON(&ResetPassword)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   err.Error(),
		})
		fmt.Println(err)
		return
	}
	userPassword := ResetPassword.UserPassword
	userId := ResetPassword.UserId
	userInDb := controller.userService.GetUserByUserID(userId)
	webResponse := response.WebResponse{
		Code:   http.StatusOK,
		Status: "Password has been resetted! Continue to Log in!",
		Data:   nil,
	}
	if controller.userService.CompareUserPassword(userPassword, userInDb.UserEmail) {
		webResponse = response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Password Invalid! (It's the same as your last password!)",
			Data:   nil,
		}
	} else {
		controller.userService.ResetPassword(userId, userPassword)
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *UserController) SaveUserData(ctx *gin.Context) {
	message = "Data has been saved!"
	var ChangeUserSettingRequest struct {
		Id      string `json:"userid"`
		Gender  string `json:"gender"`
		Country string `json:"country"`
		Dob     string `json:"dob"`
	}
	err := ctx.ShouldBindJSON(&ChangeUserSettingRequest)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Bad Request",
			Data:   err.Error(),
		})
		fmt.Println(err)
		return
	}
	controller.userService.SaveUserData(ChangeUserSettingRequest.Id, ChangeUserSettingRequest.Dob, ChangeUserSettingRequest.Gender, ChangeUserSettingRequest.Country)
	webResponse := response.WebResponse{
		Code:   code,
		Status: message,
		Data:   nil,
	}
	ctx.Header("Content-type", "application/json")
	ctx.JSON(http.StatusOK, webResponse)
}

func (controller *UserController) CreateAdminFunction(ctx *gin.Context) {
	createUserRequest := request.CreateUserRequest{
		UserEmail:    "TPAWEB241",
		UserPassword: "PASTIINISIAL",
		UserName:     "TPAWEB241",
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(createUserRequest.UserPassword), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println(err)
	}
	createUserRequest.UserPassword = string(hashedPassword)
	controller.userService.CreateAdminFunction(createUserRequest)
}

func (controller *UserController) UpdateUserProfile(ctx *gin.Context) {
	file, _ := ctx.FormFile("picture")
	userid := ctx.PostForm("userid")

	filePath := "assets/profile_picture/" + userid + ".jpeg"
	if err := ctx.SaveUploadedFile(file, filePath); err != nil {
		ctx.JSON(http.StatusInternalServerError, response.WebResponse{
			Code:   http.StatusBadRequest,
			Status: "Failed to save file",
			Data:   nil,
		})
		return
	}

	path := userid + ".jpeg"
	controller.userService.UpdateUserProfile(userid, path)

	ctx.JSON(http.StatusOK, response.WebResponse{
		Code:   http.StatusOK,
		Status: "File uploaded successfully",
		Data:   nil,
	})

}
