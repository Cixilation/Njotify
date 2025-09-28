package response

//Ini yang di kasih ke front end
type UserResponse struct {
	UserID             string `json:"id"`
	UserEmail          string `json:"email"`
	UserName           string `json:"name"`
	UserRole           string `json:"role"`
	UserCountry        string `json:"country"`
	UserDOB            string `json:"dob"`
	UserGender         string `json:"gender"`
	UserProfilePicture string `json:"profilepicture"`
	UserStatus         string `json:"status"`
}
