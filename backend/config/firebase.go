package config

import (
	"context"
	"log"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	// "firebase.google.com/go/db"
	"cloud.google.com/go/firestore" 
	"google.golang.org/api/option"
)

var (
	FirebaseApp     *firebase.App
	FirebaseAuth    *auth.Client
	FirestoreClient *firestore.Client 
)

// InitFirebase menginisialisasi Firebase Admin SDK
func InitFirebase(cfg *EnvConfig) {
	ctx := context.Background()

	// 1. Opsi menggunakan file service account JSON
	opt := option.WithCredentialsFile(cfg.FirebaseServicePath)
	
	// 2. Inisialisasi aplikasi Firebase
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("Gagal inisialisasi Firebase App: %v", err)
	}
	FirebaseApp = app

	// 3. Inisialisasi Auth Client (untuk verifikasi token)
	authClient, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("Gagal mendapatkan Firebase Auth Client: %v", err)
	}
	FirebaseAuth = authClient

	// 4. Inisialisasi Firestore Client (untuk data user/favorit/pembayaran)
	fsClient, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalf("Gagal mendapatkan Firestore Client: %v", err)
	}
	FirestoreClient = fsClient

	log.Println("Firebase Admin SDK dan Firestore Client berhasil terhubung.")
}
