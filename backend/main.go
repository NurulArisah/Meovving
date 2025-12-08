// /main.go

package main

import (
	// Pastikan semua path import ini sudah benar sesuai go.mod Anda
	"meovving-project-web-fiks/config"
	"meovving-project-web-fiks/controllers"
	"meovving-project-web-fiks/middlewares"
	"meovving-project-web-fiks/services"

	"github.com/gin-contrib/cors"

	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Muat Konfigurasi & Init Firebase
	cfg := config.LoadConfig()
	config.InitFirebase(cfg)

	// 2. Inisialisasi SERVICE Layer (Business Logic)
	authService := services.NewAuthService()
	tmdbService := services.NewTMDBService() 
	paymentService := services.NewPaymentService() // Service Payment
	personalizationService := services.NewPersonalizationService()

	// 3. Inisialisasi CONTROLLER Layer (HTTP Handling)
	authController := controllers.NewAuthController(authService)
	movieController := controllers.NewMovieController(tmdbService, personalizationService)
	personalizationController := controllers.NewPersonalizationController(personalizationService, tmdbService) 
	paymentController := controllers.NewPaymentController(paymentService, authService, cfg) // Controller Payment
	
	// 4. Inisialisasi Gin Router
	router := gin.Default()

	// KONFIGURASI CORS
    router.Use(cors.New(cors.Config{
        // Izinkan frontend Anda (misalnya React/Vue di port 3000)
        AllowOrigins:     []string{"*"}, 
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Active-Profile-ID", "X-Requested-With"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true, // Penting untuk cookie/otentikasi
        MaxAge: 12 * time.Hour,
    }))

	// --- GROUP ROUTE PUBLIK (Tidak Butuh Auth/Premium) ---
	// Endpoint ini harus bisa diakses tanpa token (misalnya Sign Up)
	publicRoutes := router.Group("/api/v1")
	{
		authRoutes := publicRoutes.Group("/auth")
		{
			authRoutes.POST("/signup", authController.SignUp)

			authRoutes.GET("/signup", func(c *gin.Context) {
            	c.JSON(200, gin.H{"message": "Koneksi OK, tapi Anda harus menggunakan POST untuk daftar!"})
			})

			authRoutes.POST("/login", authController.Login)
		}
		
		// WEBHOOK MIDTRANS (HARUS PUBLIC!)
		// Midtrans yang memanggil endpoint ini, BUKAN user.
		publicRoutes.POST("/payment/notification", paymentController.XenditWebhookHandler)
	}


	// --- GROUP ROUTE PREMIUM (Butuh Auth & Payment Status) ---
	premiumRoutes := router.Group("/api/v1/premium")
	// Terapkan Middleware Otorisasi (Auth, Pembayaran, Profil)
	premiumRoutes.Use(
		middlewares.AuthMiddleware(), 
		middlewares.PremiumMiddleware(),
		middlewares.ProfileMiddleware(),
	) 
	{
		// Endpoints Film
		premiumRoutes.GET("/dashboard", movieController.GetDashboardMovies)
		premiumRoutes.GET("/movies/popular", movieController.GetPopularMovies)
		premiumRoutes.GET("/movies/:id", movieController.GetMovieDetailHandler)
		premiumRoutes.GET("/search", movieController.SearchMoviesHandler)
		
		// Fitur Favorit & Riwayat
		premiumRoutes.POST("/favorites", personalizationController.AddFavoriteHandler)
		premiumRoutes.GET("/favorites", personalizationController.GetFavoritesHandler)
		premiumRoutes.DELETE("/favorites/:movie_id", personalizationController.DeleteFavoriteHandler)
		premiumRoutes.GET("/search/history", personalizationController.GetSearchHistoryHandler)
		
		// CHECKOUT (Butuh user_uid, jadi di premium route)
		premiumRoutes.POST("/profiles", personalizationController.CreateProfileHandler)
		premiumRoutes.GET("/profiles", personalizationController.GetProfilesHandler)
		premiumRoutes.POST("/preferences", personalizationController.SetInitialPreferenceHandler)

		premiumRoutes.PUT("/profiles/:id", personalizationController.UpdateProfileHandler)
		premiumRoutes.PUT("/profiles/:id/pin", personalizationController.UpdatePINHandler)
		premiumRoutes.GET("/profiles/dashboard", personalizationController.GetProfileDashboardHandler)

		premiumRoutes.POST("/user/change-email-request", personalizationController.RequestChangeEmailHandler)
		premiumRoutes.POST("/user/change-password", authController.UpdateAccountHandler)
		premiumRoutes.POST("/user/verify-email-otp", personalizationController.VerifyEmailOTP)
	}

	paymentRoutes := router.Group("/api/v1/payment")
	paymentRoutes.Use(middlewares.AuthMiddleware()) 
	{
		// PINDAHKAN CHECKOUT KE SINI
		paymentRoutes.POST("/checkout", paymentController.CheckoutHandler)
	}
	
	// 5. Run Server
	port := cfg.Port 
	if port == "" {
		port = "8080"
	}
	
	log.Printf("Server berjalan di port: %s\n", port)
	router.Run("0.0.0.0:" + port)
}