// /services/tmdb_service.go

package services

import (
	"context" 
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"meovving-project-web-fiks/models"
)

// TMDBService adalah Interface yang digunakan oleh Controller
type TMDBService interface {
	FetchPopularMovies(ctx context.Context) ([]models.Movie, error)
	GetMovieDetail(ctx context.Context, movieID int) (models.Movie, error) // <--- INTERFACE BARU
	SearchMovies(ctx context.Context, query string) ([]models.Movie, error)
	FetchKidsMovies(ctx context.Context) ([]models.Movie, error)
	FetchMoviesByGenre(ctx context.Context, genreID string, isKids bool) ([]models.Movie, error)
	FetchMoviesByRegion(ctx context.Context, region string, isKids bool) ([]models.Movie, error)

}

// tmdbService adalah Struct Implementasi (huruf kecil)
type tmdbService struct {
	Client  *http.Client
	BaseURL string
	APIKey  string
}

// NewTMDBService adalah konstruktor
func NewTMDBService() TMDBService {
	apiKey := os.Getenv("TMDB_API_KEY")
	baseURL := os.Getenv("TMDB_BASE_URL")

	if baseURL == "" {
		baseURL = "https://api.themoviedb.org/3"
	}

	return &tmdbService{
		Client:  &http.Client{Timeout: 10 * time.Second},
		BaseURL: baseURL,
		APIKey: apiKey,
	}
}

// FetchPopularMovies mengambil film terpopuler dari TMDB
func (s *tmdbService) FetchPopularMovies(ctx context.Context) ([]models.Movie, error) { 
	url := fmt.Sprintf("%s/movie/popular?api_key=%s&language=id-ID", s.BaseURL, s.APIKey)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat request TMDB: %w", err) 
	}
	
	resp, err := s.Client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error melakukan request TMDB: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body) 
		return nil, fmt.Errorf("TMDB API Error %d: %s", resp.StatusCode, string(body))
	}

	var tmdbResponse models.PopularMoviesResponse
	if err := json.NewDecoder(resp.Body).Decode(&tmdbResponse); err != nil {
		return nil, fmt.Errorf("error decoding JSON TMDB: %w", err)
	}

	limit := 10
	if len(tmdbResponse.Results) < limit {
		limit = len(tmdbResponse.Results)
	}
	
	return tmdbResponse.Results[:limit], nil
}

// GetMovieDetail mengambil detail lengkap sebuah film berdasarkan ID.
// Asumsi detailnya sama dengan struct models.Movie.
func (s *tmdbService) GetMovieDetail(ctx context.Context, movieID int) (models.Movie, error) {
    
    // URL endpoint untuk detail film: /movie/{movie_id}
    url := fmt.Sprintf("%s/movie/%d?api_key=%s&language=id-ID&append_to_response=credits", s.BaseURL, movieID, s.APIKey)

    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return models.Movie{}, fmt.Errorf("gagal membuat request detail film TMDB: %w", err) 
    }
    
    resp, err := s.Client.Do(req)
    if err != nil {
        return models.Movie{}, fmt.Errorf("error melakukan panggilan detail film TMDB: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        body, _ := io.ReadAll(resp.Body) 
        return models.Movie{}, fmt.Errorf("TMDB Detail API Error %d: %s", resp.StatusCode, string(body))
    }

    var movieDetail models.Movie
    if err := json.NewDecoder(resp.Body).Decode(&movieDetail); err != nil {
        return models.Movie{}, fmt.Errorf("gagal unmarshal JSON detail film TMDB: %w", err)
    }
    
    return movieDetail, nil
}

func (s *tmdbService) SearchMovies(ctx context.Context, query string) ([]models.Movie, error) {
    
    // Gunakan url.QueryEscape agar string pencarian aman untuk URL
    url := fmt.Sprintf("%s/search/movie?api_key=%s&language=id-ID&query=%s", 
        s.BaseURL, s.APIKey, query)

    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, fmt.Errorf("gagal membuat request search TMDB: %w", err) 
    }
    
    resp, err := s.Client.Do(req)
    if err != nil {
        return nil, fmt.Errorf("error melakukan panggilan search TMDB: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        body, _ := io.ReadAll(resp.Body) 
        return nil, fmt.Errorf("TMDB Search API Error %d: %s", resp.StatusCode, string(body))
    }

    var tmdbResponse models.PopularMoviesResponse // Kita gunakan struct response yang sama
    if err := json.NewDecoder(resp.Body).Decode(&tmdbResponse); err != nil {
        return nil, fmt.Errorf("gagal unmarshal JSON search TMDB: %w", err)
    }
    
    // Mengembalikan semua hasil yang ditemukan (bukan hanya 10 seperti popular movies)
    return tmdbResponse.Results, nil
}

func (s *tmdbService) FetchKidsMovies(ctx context.Context) ([]models.Movie, error) {
    // 1. URL TMDB khusus filter rating 'G' (General/Anak-anak)
    url := fmt.Sprintf("%s/discover/movie?api_key=%s&language=id-ID&sort_by=popularity.desc&certification_country=US&certification=G&include_adult=false", 
        s.BaseURL, s.APIKey)

    // 2. Buat Request
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, fmt.Errorf("gagal membuat request kids movies: %w", err)
    }

    // 3. Panggil API
    resp, err := s.Client.Do(req)
    if err != nil {
        return nil, fmt.Errorf("error panggilan API TMDB Kids: %w", err)
    }
    defer resp.Body.Close()

    // 4. Decode JSON
    var result models.PopularMoviesResponse
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return nil, fmt.Errorf("gagal unmarshal data kids movies: %w", err)
    }

    // 5. Batasi 10 hasil
    limit := 10
    if len(result.Results) < limit {
        limit = len(result.Results)
    }
    return result.Results[:limit], nil
}

// FetchMoviesByGenre mengambil film berdasarkan ID Genre (Anime TMDB ID: 16)
func (s *tmdbService) FetchMoviesByGenre(ctx context.Context, genreID string, isKids bool) ([]models.Movie, error) {
    url := fmt.Sprintf("%s/discover/movie?api_key=%s&language=id-ID&with_genres=%s&sort_by=popularity.desc", s.BaseURL, s.APIKey, genreID)
    
    // Logika tambahan jika isKids: true (Tambahkan filter rating G)
    if isKids {
        url += "&certification_country=US&certification=G&include_adult=false"
    }

    return s.doRequest(ctx, url, 20) // Gunakan helper s.doRequest (lihat di bawah)
}

// FetchMoviesByRegion mengambil film berdasarkan Wilayah (Korea: KR)
func (s *tmdbService) FetchMoviesByRegion(ctx context.Context, region string, isKids bool) ([]models.Movie, error) {
    url := fmt.Sprintf("%s/discover/movie?api_key=%s&language=id-ID&with_origin_country=%s&sort_by=popularity.desc", s.BaseURL, s.APIKey, region)
    
    if isKids {
        url += "&certification_country=US&certification=G&include_adult=false"
    }

    return s.doRequest(ctx, url, 20)
}

// Tambahkan/Update fungsi helper doRequest di bagian paling bawah
func (s *tmdbService) doRequest(ctx context.Context, url string, limit int) ([]models.Movie, error) {
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, err
    }

    resp, err := s.Client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("TMDB API Error: %d", resp.StatusCode)
    }

    var result models.PopularMoviesResponse
    // PERBAIKAN: Gunakan pemrosesan error pada decoding
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return nil, fmt.Errorf("failed to decode JSON: %w", err)
    }

    // Pastikan limitasi array aman
    resLen := len(result.Results)
    if resLen == 0 {
        return []models.Movie{}, nil
    }
    if resLen > limit {
        return result.Results[:limit], nil
    }
    
    return result.Results, nil
}