package database

import (
	"fmt"

	"github.com/cixilation/tpaweb/helper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "postgresql"
	dbname   = "NJotify"
)

func ConnectionDatabase() *gorm.DB {
	sqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s", host, port, user, password, dbname)

	database, err := gorm.Open(postgres.Open(sqlInfo), &gorm.Config{})

	helper.CheckPanic(err)

	return database
}
