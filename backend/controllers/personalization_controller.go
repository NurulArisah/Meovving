// /controllers/personalization_controller.go

package controllers

import (
	"errors" 
	"log"       // Wajib di-import untuk log.Printf
	"net/http"
	"strconv"   // Wajib di-import untuk konversi string ke int di Delete
	"time"
	
	"meovving-project-web-fiks/config"
	"meovving-project-web-fiks/models"
	"meovving-project-web-fiks/services"

	"firebase.google.com/go/auth"
	"github.com/gin-gonic/gin"
)

// Struct untuk menampung hasil concurrent dari TMDB
type MovieDetailResult struct {
	Movie models.Movie
	Error error
}

// PersonalizationController sekarang memiliki dua Service
type PersonalizationController struct {
	PService services.PersonalizationService 
	TMDBService services.TMDBService 
}

// NewPersonalizationController adalah konstruktor controller
func NewPersonalizationController(p services.PersonalizationService, t services.TMDBService) *PersonalizationController {
	return &PersonalizationController{
		PService: p,
		TMDBService: t,
	}
}

// === FAVORITE HANDLERS ===

// AddFavoriteHandler: POST /api/v1/premium/favorites
func (ctrl *PersonalizationController) AddFavoriteHandler(c *gin.Context) {
	userID, _ := c.Get("user_uid")
	
	var req models.Favorite
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request tidak valid", "details": err.Error()})
		return
	}
	
	if req.MovieID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Movie ID harus disertakan"})
		return
	}

	err := ctrl.PService.AddFavorite(c.Request.Context(), userID.(string), req)
	
	if errors.Is(err, services.ErrFavoriteExists) {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan favorit", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Film berhasil ditambahkan ke favorit", "movie_id": req.MovieID})
}

// GetFavoritesHandler: GET /api/v1/premium/favorites
func (ctrl *PersonalizationController) GetFavoritesHandler(c *gin.Context) {
	userID, _ := c.Get("user_uid")
	ctx := c.Request.Context()

	// 1. Ambil list Favorite (ID film) dari Firestore
	favorites, err := ctrl.PService.GetFavorites(ctx, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil daftar favorit"})
		return
	}

	if len(favorites) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "Daftar favorit kosong", "favorites": []interface{}{}})
		return
	}

	// 2. Persiapan untuk Concurrency (Mengambil Detail Film dari TMDB)
	resultsChan := make(chan MovieDetailResult, len(favorites))
	
	for _, fav := range favorites {
		if fav.MovieID == 0 {
			continue 
		}
		
		go func(movieID int) {
			movie, err := ctrl.TMDBService.GetMovieDetail(ctx, movieID)
			resultsChan <- MovieDetailResult{
				Movie: movie,
				Error: err,
			}
		}(fav.MovieID)
	}

	// 3. Kumpulkan Hasil dari Channel
	fullDetails := make([]models.Movie, 0)
	
	for i := 0; i < len(favorites); i++ {
		result := <-resultsChan
		
		if result.Error == nil {
			fullDetails = append(fullDetails, result.Movie)
		} else {
			log.Printf("Gagal mengambil detail film dari TMDB (ID: %d): %v", result.Movie.ID, result.Error)
		}
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Detail film favorit berhasil diambil",
		"favorites": fullDetails,
	})
}

// DeleteFavoriteHandler: DELETE /api/v1/premium/favorites/:movie_id
func (ctrl *PersonalizationController) DeleteFavoriteHandler(c *gin.Context) {
	userID, _ := c.Get("user_uid")
	
	// 1. Ambil Movie ID dari URL parameter
	movieIDStr := c.Param("movie_id")
	movieID, err := strconv.Atoi(movieIDStr) // Konversi ke integer
	if err != nil || movieID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Movie ID tidak valid"})
		return
	}

	// 2. Panggil Service untuk menghapus
	err = ctrl.PService.RemoveFavorite(c.Request.Context(), userID.(string), movieID)
	
	if errors.Is(err, services.ErrFavoriteNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()}) // Status 404 jika tidak ditemukan
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus favorit", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Film berhasil dihapus dari favorit", "movie_id": movieID})
}

// === HISTORY HANDLERS ===

// GetSearchHistoryHandler: GET /api/v1/premium/search/history
func (ctrl *PersonalizationController) GetSearchHistoryHandler(c *gin.Context) {
	userID, _ := c.Get("user_uid")

	history, err := ctrl.PService.GetSearchHistory(c.Request.Context(), userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil riwayat pencarian"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Riwayat pencarian berhasil diambil",
		"history": history,
	})
}

func (ctrl *PersonalizationController) CreateProfileHandler(c *gin.Context) {
    var req struct {
        Name   string `json:"name" binding:"required"`
        IsKids bool   `json:"is_kids"`
        PIN    string `json:"pin" binding:"required,len=4"` // Validasi PIN 4 digit
    }
    
    // Bind JSON
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "Input tidak valid"})
        return
    }

    userID, _ := c.Get("user_uid")

    // PANGGIL SERVICE (Sekarang kirim 5 parameter)
    err := ctrl.PService.CreateProfile(c.Request.Context(), userID.(string), req.Name, req.IsKids, req.PIN)
    
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }

    c.JSON(201, gin.H{"message": "Profil berhasil dibuat"})
}

func (ctrl *PersonalizationController) GetProfilesHandler(c *gin.Context) {
    userID, _ := c.Get("user_uid")

    profiles, err := ctrl.PService.GetProfiles(c.Request.Context(), userID.(string))
    if err != nil {
        c.JSON(500, gin.H{"error": "Gagal mengambil daftar profil"})
        return
    }

    c.JSON(200, gin.H{"profiles": profiles})
}

// /controllers/personalization_controller.go

func (ctrl *PersonalizationController) SetInitialPreferenceHandler(c *gin.Context) {
    userID, _ := c.Get("user_uid")
    
    // 1. Ambil pilihan genre dari body (misal: ["Action", "Comedy"])
    var genres []string
    if err := c.ShouldBindJSON(&genres); err != nil {
        c.JSON(400, gin.H{"error": "Genre tidak valid"})
        return
    }

    // 2. Simpan Genre ke Firestore user utama
    // ... logic Simpan Genre ...

    // 3. Panggil service untuk BUAT PROFIL OTOMATIS
    // Ambil data user dulu untuk tau PackageName-nya
    user, _ := ctrl.PService.GetUser(c.Request.Context(), userID.(string)) 
    
    err := ctrl.PService.InitInitialProfiles(c.Request.Context(), userID.(string), user.PackageName)
    
    if err != nil {
        c.JSON(500, gin.H{"error": "Gagal inisialisasi profil"})
        return
    }

    c.JSON(200, gin.H{"message": "Preferensi disimpan & profil default dibuat!"})
}

// UpdateProfileHandler menangani perubahan Nama dan Foto
func (ctrl *PersonalizationController) UpdateProfileHandler(c *gin.Context) {
	userID, _ := c.Get("user_uid")
	profileID := c.Param("id")

	var req struct {
		Name     string `json:"name" binding:"required"`
		PhotoURL string `json:"photo_url"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Data tidak valid"})
		return
	}

	err := ctrl.PService.UpdateProfile(c.Request.Context(), userID.(string), profileID, req.Name, req.PhotoURL)
	if err != nil {
		c.JSON(500, gin.H{"error": "Gagal update profil"})
		return
	}
	c.JSON(200, gin.H{"message": "Profil diperbarui"})
}

// GetProfileDashboardHandler mengambil history, favorite, dan watchlist sekaligus
func (ctrl *PersonalizationController) GetProfileDashboardHandler(c *gin.Context) {
    userID, _ := c.Get("user_uid")
    
    // Variabel ini sekarang digunakan untuk logging atau validasi
    profileID := c.GetHeader("X-Active-Profile-ID") 
    if profileID == "" {
        log.Println("Peringatan: ProfileID kosong saat memuat dashboard profil")
    }

    ctx := c.Request.Context()

    // Ambil riwayat pencarian
    history, _ := ctrl.PService.GetSearchHistory(ctx, userID.(string))

    // Ambil favorit
    favorites, _ := ctrl.PService.GetFavorites(ctx, userID.(string))

    // TODO: Gunakan profileID untuk mengambil watchlist spesifik profil ini
    // watchlist, _ := ctrl.PService.GetWatchlist(ctx, userID.(string), profileID)

    c.JSON(200, gin.H{
        "active_profile":  profileID, // Sekarang digunakan di sini!
        "recently_viewed": history,
        "favorites":       favorites,
        "watchlist":       []string{"data watchlist"}, 
    })
}

func (ctrl *PersonalizationController) UpdatePINHandler(c *gin.Context) {
	userID, _ := c.Get("user_uid")
	profileID := c.Param("id") // Mengambil ID profil dari rute /profiles/:id/pin

	var req struct {
		NewPIN string `json:"new_pin" binding:"required,len=4"` // Validasi PIN wajib 4 digit
	}

	// 1. Validasi Input JSON
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PIN tidak valid, harus 4 digit"})
		return
	}

	// 2. Panggil Service untuk update di Firestore
	err := ctrl.PService.UpdatePIN(c.Request.Context(), userID.(string), profileID, req.NewPIN)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui PIN"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "PIN profil berhasil diperbarui"})
}

func (ctrl *PersonalizationController) VerifyEmailOTP(c *gin.Context) {
    userID, _ := c.Get("user_uid")
    var req struct { OTP string `json:"otp"` }
    c.ShouldBindJSON(&req)

    // 1. Ambil data user dari Firestore
    user, _ := ctrl.PService.GetUser(c.Request.Context(), userID.(string))

    // 2. Cek apakah OTP cocok dan belum expired
    if user.EmailOTP == req.OTP && time.Now().Before(user.OTPExpiresAt) {
        
        // 3. Update di Firebase Auth (Inti Perubahan)
        params := (&auth.UserToUpdate{}).Email(user.TempEmail)
        config.FirebaseAuth.UpdateUser(c.Request.Context(), userID.(string), params)

        // 4. Update Email di Firestore
        // ... set email ke user.TempEmail dan hapus data OTP temp ...

        c.JSON(200, gin.H{"message": "Email berhasil diganti"})
    } else {
        c.JSON(400, gin.H{"error": "OTP salah atau kedaluwarsa"})
    }
}

// RequestChangeEmailHandler menangani request awal perubahan email
func (ctrl *PersonalizationController) RequestChangeEmailHandler(c *gin.Context) {
    userID, _ := c.Get("user_uid")
    
    var req struct {
        NewEmail string `json:"new_email" binding:"required,email"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "Format email tidak valid"})
        return
    }

    // Panggil Service untuk buat OTP dan simpan email sementara
    err := ctrl.PService.RequestChangeEmail(c.Request.Context(), userID.(string), req.NewEmail)
    if err != nil {
        c.JSON(500, gin.H{"error": "Gagal mengirim request ganti email"})
        return
    }

    c.JSON(200, gin.H{"message": "OTP ganti email telah dikirim ke email baru Anda"})
}