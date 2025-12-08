package controllers

import (
	"context"
	"log"
	"net/http"
	"strconv"
	"time"

	"meovving-project-web-fiks/models"
	"meovving-project-web-fiks/services"
	"github.com/gin-gonic/gin"
)

// 1. MovieController struct untuk Dependency Injection
type MovieController struct {
	TMDBService services.TMDBService
	PService    services.PersonalizationService
}

// 2. Buat konstruktor
func NewMovieController(t services.TMDBService, p services.PersonalizationService) *MovieController {
	return &MovieController{
		TMDBService: t,
		PService:    p,
	}
}

// 3. GetPopularMovies - Menangani logika Kids vs Dewasa
func (ctrl *MovieController) GetPopularMovies(c *gin.Context) {
	var movies []models.Movie
	var err error

	isKids, _ := c.Get("is_kids_profile")

	if isKids != nil && isKids.(bool) {
		// TAMBAHKAN FILTER RATING ANAK KE TMDB
		movies, err = ctrl.TMDBService.FetchKidsMovies(c.Request.Context())
	} else {
		// Memanggil service film populer standar
		movies, err = ctrl.TMDBService.FetchPopularMovies(c.Request.Context())
	} // <--- PERBAIKAN: Menutup blok else

	// 4. Error Handling
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Gagal mengambil data film dari TMDB",
			"details": err.Error(),
		})
		return
	}

	// Response Sukses
	c.JSON(http.StatusOK, gin.H{"data": movies})
}

// SearchMoviesHandler: GET /api/v1/premium/search?q=...
func (ctrl *MovieController) SearchMoviesHandler(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter pencarian 'q' harus disertakan"})
		return
	}

	// 1. Panggil TMDB Service
	movies, err := ctrl.TMDBService.SearchMovies(c.Request.Context(), query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal melakukan pencarian film", "details": err.Error()})
		return
	}

	// 2. Simpan riwayat pencarian (asynchronous)
	userID, exists := c.Get("user_uid")
	if exists {
		go func() {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			if err := ctrl.PService.SaveSearchQuery(ctx, userID.(string), query); err != nil {
				log.Printf("Gagal menyimpan riwayat pencarian: %v", err)
			}
		}()
	}

	// 3. Kirim Response
	c.JSON(http.StatusOK, gin.H{"query": query, "results": movies})
}

// GetMovieDetailHandler: GET /api/v1/premium/movies/:id
func (ctrl *MovieController) GetMovieDetailHandler(c *gin.Context) {
	// 1. Ambil ID Film dari URL parameter
	movieIDStr := c.Param("id")
	movieID, err := strconv.Atoi(movieIDStr)
	if err != nil || movieID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID film tidak valid"})
		return
	}

	// 2. Panggil TMDB Service
	movieDetail, err := ctrl.TMDBService.GetMovieDetail(c.Request.Context(), movieID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil detail film", "details": err.Error()})
		return
	}

	// 3. Kirim Response
	c.JSON(http.StatusOK, movieDetail)
}

// Method baru untuk mengambil data dashboard lengkap ( Trending + Anime + Korea )
func (ctrl *MovieController) GetDashboardMovies(c *gin.Context) {
    isKids, _ := c.Get("is_kids_profile")
    ctx := c.Request.Context()
    kidsFlag := isKids.(bool)

    type result struct {
        data []models.Movie
        key  string
    }
    resChan := make(chan result, 3)

    go func() {
        d, _ := ctrl.TMDBService.FetchPopularMovies(ctx)
        resChan <- result{d, "trending"}
    }()
    go func() {
        d, _ := ctrl.TMDBService.FetchMoviesByGenre(ctx, "16", kidsFlag)
        resChan <- result{d, "anime"}
    }()
    go func() {
        d, _ := ctrl.TMDBService.FetchMoviesByRegion(ctx, "KR", kidsFlag)
        resChan <- result{d, "korean"}
    }()

    finalData := make(map[string][]models.Movie)
    for i := 0; i < 3; i++ {
        res := <-resChan
        finalData[res.key] = res.data
    }

    c.JSON(http.StatusOK, gin.H{
        "trending_now": finalData["trending"],
        "anime":        finalData["anime"],
        "korean":       finalData["korean"],
    })
}