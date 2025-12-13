package config

import (
	"context"
	"log"
	"os" 

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
)

var (
	FirebaseApp     *firebase.App
	FirebaseAuth    *auth.Client
	FirestoreClient *firestore.Client
)

func InitFirebase() {
	ctx := context.Background()

	// 1. Mengambil kunci JSON dari Environment Variable FIREBASE_SERVICE_ACCOUNT
	serviceAccountJSON := os.Getenv("FIREBASE_SERVICE_ACCOUNT")
	if serviceAccountJSON == "" {
		// Log fatal karena ini adalah konfigurasi wajib untuk deployment
		log.Fatal("FIREBASE_SERVICE_ACCOUNT environment variable not set! Wajib untuk deployment Railway.")
	}

	// 2. Menginisialisasi Firebase menggunakan string JSON
	opt := option.WithCredentialsJSON([]byte(serviceAccountJSON))

	// 3. Inisialisasi aplikasi Firebase
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("Gagal inisialisasi Firebase App: %v", err)
	}
	FirebaseApp = app

	// 4. Inisialisasi Auth Client (untuk verifikasi token)
	authClient, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("Gagal mendapatkan Firebase Auth Client: %v", err)
	}
	FirebaseAuth = authClient

	// 5. Inisialisasi Firestore Client (untuk data user/favorit/pembayaran)
	fsClient, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalf("Gagal mendapatkan Firestore Client: %v", err)
	}
	FirestoreClient = fsClient

	log.Println("Firebase Admin SDK dan Firestore Client berhasil terhubung menggunakan Environment Variable.")
}