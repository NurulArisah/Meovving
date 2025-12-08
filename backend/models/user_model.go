package models

import (
    "time"
)

// User merepresentasikan struktur data pengguna di Firestore
type User struct {
    FirebaseUID     string    `json:"uid" firestore:"uid"`
    Email           string    `firestore:"email"`
    Username        string    `firestore:"username"`
    StatusPembayaran bool     `json:"status_pembayaran" firestore:"status_pembayaran"` // Default: false
    TanggalDaftar    time.Time `firestore:"tanggal_daftar"`

	PackageName      string    `json:"package_name" firestore:"package_name"`      // Contoh: "Family", "Duo", "Individual"
    MaxProfiles      int       `json:"max_profiles" firestore:"max_profiles"`      // Slot Profil Maksimum (3, 2, atau 1)
    CurrentProfiles  int       `firestore:"current_profiles"`  // Jumlah Profil yang sudah dibuat
    HasKidsProfile   bool      `firestore:"has_kids_profile"`  // True jika ada profil anak
    Genres          []string   `firestore:"favorite_genres"`
    MembershipUntil time.Time  `firestore:"membership_until"`
    TempEmail        string    `firestore:"temp_email"`
    EmailOTP         string    `firestore:"email_otp"`
    OTPExpiresAt     time.Time `firestore:"otp_expires_at"`
    // Field lainnya, misal: RiwayatPencarian []string, Preferensi map[string]interface{}
}

// SignUpRequest merepresentasikan data yang diterima dari Frontend saat Sign Up
type SignUpRequest struct {
    Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
    Username string `json:"username" binding:"required"`
}

// Struct untuk Profil Pengguna (Sub-collection)
type Profile struct {
    ProfileID       string    `firestore:"profile_id"`
    ProfileName     string    `firestore:"profile_name"`
    IsKidsAccount   bool      `firestore:"is_kids_account"` // Field yang dicek di middleware
    ProfilePIN      string    `firestore:"profile_pin"`
    ProfilePhotoURL string `firestore:"profile_photo_url"`
}