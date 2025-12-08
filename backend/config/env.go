package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// EnvConfig akan menyimpan semua variabel yang dibaca dari .env
type EnvConfig struct {
	Port                string
	TMDBAPIKey          string
	FirebaseServicePath string
}

// LoadConfig membaca file .env dan mengembalikan struct EnvConfig
func LoadConfig() *EnvConfig {
	// Muat file .env. Jika gagal, log error.
	err := godotenv.Load()
	if err != nil {
		log.Println("Perhatian: Tidak dapat menemukan file .env. Menggunakan Environment Variables Sistem.")
	}

	return &EnvConfig{
		Port:                os.Getenv("PORT"),
		TMDBAPIKey:          os.Getenv("TMDB_API_KEY"),
		FirebaseServicePath: os.Getenv("FIREBASE_SERVICE_ACCOUNT_PATH"),
	}
}