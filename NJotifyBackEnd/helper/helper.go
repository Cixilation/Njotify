package helper

func CheckPanic(err error) {
	if err != nil {
		panic("Failed to connect to database")
	}
}
