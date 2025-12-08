package controllers

import (
    "net/http"
    "errors"
    "time"
    
    "meovving-project-web-fiks/config"
    "meovving-project-web-fiks/models" 
    "meovving-project-web-fiks/services"
    "github.com/gin-gonic/gin"
)

// AuthController menyimpan referensi ke AuthService
type AuthController struct {
    AuthService services.AuthService
}

// NewAuthController membuat instance baru dari AuthController
func NewAuthController(s services.AuthService) *AuthController {
    return &AuthController{
        AuthService: s,
    }
}

// SignUp menangani HTTP request untuk pendaftaran
func (ctrl *AuthController) SignUp(c *gin.Context) {
    var req models.SignUpRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Permintaan tidak valid"})
        return
    }

    // 1. Panggil Service untuk menjalankan logika bisnis
    uid, err := ctrl.AuthService.SignUp(c.Request.Context(), req.Email, req.Password, req.Username)

    // 2. Tentukan Response berdasarkan error yang dikembalikan Service
    if err != nil {
        if errors.Is(err, services.ErrUserAlreadyExists) {
            c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
            return
        }
        // Error umum atau error verifikasi token
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    // 3. Response Sukses
    c.JSON(http.StatusCreated, gin.H{
        "message": "Pendaftaran berhasil. Silakan lakukan pembayaran untuk mengakses fitur premium.",
        "uid":     uid,
    })
}

func (ctrl *AuthController) Login(c *gin.Context) {
    var input struct {
        IDToken string `json:"id_token"`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(400, gin.H{"error": "Token required"})
        return
    }

    // 1. Verifikasi ID Token via Firebase Admin SDK
    token, err := config.FirebaseAuth.VerifyIDToken(c.Request.Context(), input.IDToken)
    if err != nil {
        c.JSON(401, gin.H{"error": "Invalid token"})
        return
    }

    // 2. CEK APAKAH USER SUDAH ADA DI FIRESTORE
    // Kita gunakan token.UID sebagai kunci dokumen di Firestore
    userDocRef := config.FirestoreClient.Collection("users").Doc(token.UID)
    doc, err := userDocRef.Get(c.Request.Context())

    if err != nil || !doc.Exists() {
        // Jika dokumen TIDAK ADA, berarti ini user baru (Sign Up via Google)
        
        // Ambil data tambahan dari token Google
        email := token.Claims["email"].(string)
        name, _ := token.Claims["name"].(string)

        newUser := models.User{
            FirebaseUID:      token.UID,
            Email:            email,
            Username:         name,
            TanggalDaftar:    time.Now(),
            StatusPembayaran: false, // Default false sebelum ke halaman package
            PackageName:      "",    // Kosongkan karena belum pilih paket
        }

        // Simpan ke Firestore
        _, err = userDocRef.Set(c.Request.Context(), newUser)
        if err != nil {
            c.JSON(500, gin.H{"error": "Gagal mencatat profil ke Firestore"})
            return
        }
    }

    // 3. Response Sukses
    c.JSON(200, gin.H{
        "message": "Authenticated successfully and profile synced",
        "uid":     token.UID,
    })
}

func (a *AuthController) UpdateAccountHandler(c *gin.Context) {
    var input struct {
        NewPassword string `json:"new_password"`
        NewEmail    string `json:"new_email"`
    }
    
    // Bind JSON dari account.js
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(400, gin.H{"error": "Data tidak valid"})
        return
    }

    userID := c.GetString("user_id") // Didapat dari middleware auth
    authSvc := services.NewAuthService()

    // Jika ada input password
    if input.NewPassword != "" {
        err := authSvc.UpdatePassword(c.Request.Context(), userID, input.NewPassword)
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
    }

    // Jika ada input email baru
    if input.NewEmail != "" {
        _, err := authSvc.RequestEmailChange(c.Request.Context(), userID, input.NewEmail)
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
    }

    c.JSON(200, gin.H{"message": "Permintaan akun berhasil diproses!"})
}