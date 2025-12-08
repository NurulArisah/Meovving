package models

// Movie merepresentasikan struktur data film dari TMDB
type Movie struct {
	ID          	int    `json:"id"`
	Title       	string `json:"title"`
	Overview    	string `json:"overview"`
	ReleaseDate 	string `json:"release_date"`
	Genres      	[]Genre  `json:"genres"`
	PosterPath  	string `json:"poster_path"`
	VoteAverage 	float64 `json:"vote_average"`
	OriginalLanguage string `json:"original_language"`
	Cast         	[]Cast   `json:"cast"`
	Platforms    	[]string `json:"watch_on"`
	// Tambahkan field lain sesuai kebutuhan (Genre, Rating Umur, dll.)
}

// TmdbPopularResponse adalah struktur respons array dari endpoint /movie/popular
type PopularMoviesResponse struct {
	Page    int     `json:"page"`
	Results []Movie `json:"results"`
}

type Cast struct {
    Name      string `json:"name"`
    Character string `json:"character"`
    ImageURL  string `json:"profile_path"`
}

type Genre struct {
    Name string `json:"name"`
}