package config

import (
    "log"
    "os"
    "github.com/joho/godotenv"
)

type EnvConfig struct {
    Port                string
    TMDBAPIKey          string
    FirebaseServicePath string
    XenditCallbackToken string // Tambahkan field ini
}

func LoadConfig() *EnvConfig {
    err := godotenv.Load()
    if err != nil {
        log.Println("Perhatian: Tidak dapat menemukan file .env. Menggunakan Environment Variables Sistem.")
    }

    return &EnvConfig{
        Port:                os.Getenv("PORT"),
        TMDBAPIKey:          os.Getenv("TMDB_API_KEY"),
        FirebaseServicePath: os.Getenv("FIREBASE_SERVICE_ACCOUNT_PATH"),
        XenditCallbackToken: os.Getenv("XENDIT_CALLBACK_TOKEN"), // Ambil dari .env
    }
}