package database

import (
	"github.com/go-redis/redis/v8"
)

func RedisConnection() *redis.Client {
	redisdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	return redisdb

	// Example
	// Set a key
	//   err := rdb.Set(ctx, "name", "Elliot", 0).Err()
	//   if err != nil {
	// 	  log.Fatalf("Could not set key: %v", err)
	//   }

	//   // Get the key
	//   val, err := rdb.Get(ctx, "name").Result()
	//   if err != nil {
	// 	  log.Fatalf("Could not get key: %v", err)
	//   }

	//   fmt.Println("name:", val)
}
