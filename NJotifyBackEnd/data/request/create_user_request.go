package request

//Ini yang di diambil dari front end
type CreateUserRequest struct {
	UserName           string `json:"userName"`
	UserEmail          string `json:"email"`
	UserPassword       string `json:"password"`
	UserStatus         string `json:"status"`
	UserProfilePicture string `json:"profilePicture"`
}

// UserEmail          string    `validate:"required" json:"email"`
// UserPassword       string    `validate:"required" json:"password"`
// UserRole           string    `json:"role"`
// UserCountry        string    `json:"country"`
// UserDescription    string    `json:"description"`
// UserDOB            time.Time `json:"dob"`
// UserGender         string    `json:"gender"`
// UserProfilePicture string    `json:"profilepicture"`
// UserStatus         string    `json:"status"`
// UserBanner         string    `json:"banner"`
