package controllers

import (
    "net/http"
    "errors"
    
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

    // Verifikasi ID Token via Firebase Admin SDK
    token, err := config.FirebaseAuth.VerifyIDToken(c, input.IDToken)
    if err != nil {
        c.JSON(401, gin.H{"error": "Invalid token"})
        return
    }

    // Token valid! 'token.UID' adalah ID user di Firebase
    c.JSON(200, gin.H{
        "message": "Authenticated successfully",
        "uid":     token.UID,
    })
}