// /middlewares/profile_middleware.go

package middlewares

import (
	"context"
	"log"
	"net/http"

	"meovving-project-web-fiks/config" // Asumsi client Firestore ada di sini
	"meovving-project-web-fiks/models" // Asumsi struct Profile ada di sini

	"github.com/gin-gonic/gin"
)

// ProfileMiddleware mengecek profil aktif user dan menetapkan status Kids Account ke konteks.
func ProfileMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		
		// 1. Ambil userID dari konteks (sudah diset oleh AuthMiddleware)
		userID, exists := c.Get("user_uid")
		if !exists {
			// Jika user_uid tidak ada (seharusnya tidak terjadi jika AuthMiddleware sudah dipanggil)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User ID tidak ditemukan di konteks"})
			return
		}

		// 2. Ambil ID Profil dari Header (Asumsi Frontend mengirimkan ini)
		profileID := c.GetHeader("X-Active-Profile-ID")
		if profileID == "" {
			// Jika tidak ada header, asumsikan profil utama atau profil default (bukan anak)
			log.Println("Peringatan: Header X-Active-Profile-ID kosong. Mengasumsikan profil standar.")
			c.Set("is_kids_profile", false) 
			c.Next()
			return
		}

		ctx := context.Background()
		
		// 3. Query Firestore untuk mendapatkan detail profil
		profileDocRef := config.FirestoreClient.
			Collection("users").Doc(userID.(string)).
			Collection("profiles").Doc(profileID)

		docSnap, err := profileDocRef.Get(ctx)
		if err != nil {
			log.Printf("Error mengambil profil ID %s: %v", profileID, err)
			
			// Jika profil tidak ditemukan, anggap tidak valid dan batalkan
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Profil aktif tidak ditemukan atau tidak valid"})
			return
		}

		var profile models.Profile
		if err := docSnap.DataTo(&profile); err != nil {
			log.Printf("Error memetakan data profil ID %s: %v", profileID, err)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Gagal memproses data profil"})
			return
		}
		
		// 4. Set status Kids Account ke konteks Gin
		// Controller film akan membaca nilai ini untuk menerapkan filter konten
		c.Set("is_kids_profile", profile.IsKidsAccount)
		
		log.Printf("Profil aktif: %s, Kids Status: %t", profile.ProfileName, profile.IsKidsAccount)

		c.Next()
	}
}