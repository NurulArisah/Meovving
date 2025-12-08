package models

import "time"

// Favorite menyimpan data film yang difavoritkan user
type Favorite struct {
    MovieID      int       `json:"movie_id" firestore:"movie_id"`
    Title        string    `json:"title" firestore:"title"`
    AddedAt      time.Time `json:"added_at" firestore:"added_at"`
    // Anda bisa menambahkan detail lain seperti poster_path di sini
}

// SearchHistory menyimpan riwayat pencarian user
type SearchHistory struct {
    Query        string    `json:"query" firestore:"query"`
    SearchedAt   time.Time `json:"searched_at" firestore:"searched_at"`
}

// UserProfile (Diperluas untuk menyimpan array referensi ke koleksi lain)
type UserProfile struct {
    FavoritesCollection string `firestore:"favorites_collection"` // Misal: users/UID/favorites
    HistoryCollection   string `firestore:"history_collection"`   // Misal: users/UID/history
}