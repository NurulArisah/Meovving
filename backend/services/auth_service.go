// /services/auth_service.go

package services

import (
	"context"
	"errors"
	"time"
	"strings"
	"log"
	// "fmt"

	"cloud.google.com/go/firestore"
	"firebase.google.com/go/auth"

	"meovving-project-web-fiks/config"
	"meovving-project-web-fiks/models"
)

// Definisikan error kustom
var ErrUserAlreadyExists = errors.New("pengguna sudah terdaftar di Firestore")

// AuthServiceInterface mendefinisikan kontrak service
type AuthService interface {
	// Diubah: Menerima email, password, username (untuk Sign Up)
	SignUp(ctx context.Context, email, password, username string) (string, error) 
	UpdateUserPackage(ctx context.Context, userID string, packageName string) error
}

// authService adalah implementasi dari AuthServiceInterface
type authService struct{}

// NewAuthService membuat instance baru dari AuthService
func NewAuthService() AuthService {
	return &authService{}
}

// SignUp menangani logika pendaftaran: membuat user di Firebase Auth dan simpan data ke Firestore
// Signature fungsi SINKRON dengan interface
func (s *authService) SignUp(ctx context.Context, email, password, username string) (string, error) { 
	
	// 1. BUAT USER di Firebase Authentication
	params := (&auth.UserToCreate{}).
		Email(email).
		Password(password).
		DisplayName(username)

	userRecord, err := config.FirebaseAuth.CreateUser(ctx, params)
	if err != nil {
        // PERBAIKAN: Ganti logika IsEmailAlreadyExists dengan pengecekan error string yang lebih umum
        
        // Error yang dikembalikan oleh Firebase SDK ketika email sudah terdaftar
        if strings.Contains(err.Error(), "email-already-exists") {
			return "", errors.New("email sudah terdaftar")
        }
			return "", errors.New("gagal membuat pengguna di Firebase Auth: " + err.Error())
	}
	
	userID := userRecord.UID // Ambil UID yang baru dibuat

	// 2. Cek apakah user sudah terdaftar di Firestore (Optional, tapi bagus untuk keamanan)
	// Walaupun Firebase Auth sudah mengecek email, kita cek untuk kasus Social Login sebelumnya.
	userDocRef := config.FirestoreClient.Collection("users").Doc(userID)
	doc, err := userDocRef.Get(ctx)
	if err == nil && doc.Exists() {
		return "", ErrUserAlreadyExists
	}
	
	// 3. Buat Data User Baru
	newUser := models.User{
		FirebaseUID: userID,
		Email: email, // Ambil email dari input
		Username: username,
		StatusPembayaran: false, 
		TanggalDaftar: time.Now(),
		// Tambahkan field lain seperti package_name, max_profiles dengan nilai default 0
		PackageName: "",
		MaxProfiles: 0, 
	}

	// 4. Simpan Record ke Firestore
	_, err = userDocRef.Set(ctx, newUser)
	if err != nil {
		//return "", fmt.Errorf("Firestore Error: %v", err)
		return "", errors.New("gagal menyimpan data pengguna ke Firestore")
	}

	return userID, nil
}

// UpdateUserPackage (Kode ini sudah benar, tidak perlu diubah)
func (s *authService) UpdateUserPackage(ctx context.Context, userID string, packageName string) error {
    log.Printf("Mencoba mengaktifkan paket %s untuk user UID: %s", packageName, userID)

    // Normalisasi input paket (Huruf besar di awal)
    packageName = strings.Title(strings.ToLower(packageName))

    var maxProfiles int
    switch packageName {
    case "Family":
        maxProfiles = 5
    case "Duo":
        maxProfiles = 2
    case "Individual":
        maxProfiles = 1
    default: 
        log.Printf("Error: Paket %s tidak terdaftar", packageName)
        return errors.New("nama paket tidak valid")
    }

    userDocRef := config.FirestoreClient.Collection("users").Doc(userID)

    // Gunakan UPDATE untuk efisiensi
    _, err := userDocRef.Update(ctx, []firestore.Update{
        {Path: "status_pembayaran", Value: true}, // PASTIKAN NAMA INI SAMA DENGAN DI FIREBASE
        {Path: "package_name",      Value: packageName},
        {Path: "max_profiles",      Value: maxProfiles},
    })
    
    if err != nil {
        log.Printf("Gagal update Firestore user %s: %v", userID, err)
        return err
    }

    // --- Pembuatan Profil (Sub-koleksi) ---
    profilesColl := userDocRef.Collection("profiles")

    // Buat Main Profile
    _, _ = profilesColl.NewDoc().Set(ctx, map[string]interface{}{
        "profile_name":     "Main Profile",
        "is_kids_account":  false,
        "profile_pin":      "0000",
        "created_at":       time.Now(),
    })

    if packageName == "Family" {
        _, _ = profilesColl.NewDoc().Set(ctx, map[string]interface{}{
            "profile_name":     "Kids Account",
            "is_kids_account":  true,
            "profile_pin":      "",
            "created_at":       time.Now(),
        })
    }

    log.Println("Aktivasi Firestore Berhasil!")
    return nil
}