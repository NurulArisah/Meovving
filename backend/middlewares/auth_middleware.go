// /middlewares/auth_middleware.go (Contoh Sederhana)
package middlewares

import (
    "context"
    "net/http"
    "strings"

    "meovving-project-web-fiks/config" // Ganti dengan nama module Anda
    
    "github.com/gin-gonic/gin"
)

// AuthMiddleware memverifikasi token Firebase ID pada setiap request
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Ambil Header Authorization
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Header Authorization tidak ditemukan"})
            c.Abort()
            return
        }

        // 2. Cek format (Harus 'Bearer <token>')
        tokenParts := strings.Split(authHeader, " ")
        if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Format token tidak valid (Harus Bearer)"})
            c.Abort()
            return
        }

        idToken := tokenParts[1]

        // 3. Verifikasi Token menggunakan Firebase Admin SDK
        token, err := config.FirebaseAuth.VerifyIDToken(context.Background(), idToken)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Token tidak valid atau kadaluarsa", "details": err.Error()})
            c.Abort()
            return
        }

        // 4. Token valid, simpan UID ke Gin Context
        c.Set("user_uid", token.UID)
        
        // Lanjutkan ke handler/middleware berikutnya
        c.Next()
    }
}

// Tambahkan struct User untuk memetakan data dari Firestore
type User struct {
    StatusPembayaran bool `firestore:"status_pembayaran"`
}

// PremiumMiddleware memverifikasi apakah user sudah membayar
func PremiumMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Ambil UID dari Context (disediakan oleh AuthMiddleware)
        uid, exists := c.Get("user_uid")
        if !exists {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "UID pengguna tidak ditemukan di context"})
            c.Abort()
            return
        }

        // 2. Query Firestore untuk mendapatkan status pembayaran
        // Catatan: Gunakan config.FirestoreClient yang sudah diinisialisasi di main.go
        userDocRef := config.FirestoreClient.Collection("users").Doc(uid.(string))
        docSnapshot, err := userDocRef.Get(c.Request.Context())
        
        if err != nil || !docSnapshot.Exists() {
            // Ini bisa terjadi jika user sudah login di Firebase Auth tapi recordnya hilang di Firestore
            c.JSON(http.StatusForbidden, gin.H{"error": "Data pengguna tidak ditemukan di database"})
            c.Abort()
            return
        }

        var user User
        docSnapshot.DataTo(&user)

        // 3. Cek Status Pembayaran (KUNCI AKSES)
        if !user.StatusPembayaran {
            c.JSON(http.StatusPaymentRequired, gin.H{
                "error": "Akses ditolak. Silakan lakukan pembayaran untuk mengakses fitur premium.",
            })
            c.Abort()
            return
        }

        // Lanjutkan: Status Pembayaran OK!
        c.Next()
    }
}