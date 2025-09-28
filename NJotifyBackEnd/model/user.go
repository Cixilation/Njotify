package model

type User struct {
	UserID             string `gorm:"type:varchar(255);primary_key"`
	UserEmail          string `gorm:"type:varchar(255);unique"`
	UserName           string `gorm:"type:varchar(255)"`
	UserPassword       string `gorm:"type:varchar(255)"`
	UserRole           string `gorm:"type:varchar(255)"`
	UserCountry        string `gorm:"type:varchar(255)"`
	UserDOB            string `gorm:"type:varchar(20)"`
	UserGender         string `gorm:"type:varchar(255)"`
	UserProfilePicture string `gorm:"type:varchar(255)"`
	UserStatus         string `gorm:"type:varchar(255)"`
}
