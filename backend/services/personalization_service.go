// /services/personalization_service.go

package services

import (
	"context"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"time" // Hanya perlu satu import time

	"meovving-project-web-fiks/config"
	"meovving-project-web-fiks/models"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

// Definisikan error kustom
var ErrFavoriteNotFound = errors.New("film tidak ditemukan di daftar favorit")
var ErrFavoriteExists = errors.New("film sudah ada di daftar favorit")
var ErrKidsProfileExists = errors.New("profil anak sudah ada, hanya boleh satu")
var ErrMaxProfilesReached = errors.New("batas maksimum profil untuk paket ini telah tercapai")


type PersonalizationService interface {
	CreateProfile(ctx context.Context, userID string, profileName string, isKids bool, pin string) error
	AddFavorite(ctx context.Context, userID string, movie models.Favorite) error
	GetFavorites(ctx context.Context, userID string) ([]models.Favorite, error)
	RemoveFavorite(ctx context.Context, userID string, movieID int) error

	SaveSearchQuery(ctx context.Context, userID string, query string) error
	GetSearchHistory(ctx context.Context, userID string) ([]models.SearchHistory, error)
	GetProfiles(ctx context.Context, userID string) ([]models.Profile, error)
	GetUser(ctx context.Context, userID string) (models.User, error)
	InitInitialProfiles(ctx context.Context, userID, packageName string) error

	UpdateProfile(ctx context.Context, userID, profileID string, name string, photoURL string) error
	UpdatePIN(ctx context.Context, userID, profileID string, newPIN string) error
	AddToWatchlist(ctx context.Context, userID, profileID string, movie models.Favorite) error
	GetWatchlist(ctx context.Context, userID, profileID string) ([]models.Favorite, error)
	RequestChangeEmail(ctx context.Context, userID, newEmail string) error
}

type personalizationService struct {
	db *firestore.Client
}

func NewPersonalizationService() PersonalizationService {
	return &personalizationService{
		db: config.FirestoreClient,
	}
}

func init() {
	rand.Seed(time.Now().UnixNano())
}

// === FAVORITE CRUD ===

// AddFavorite menambahkan film ke sub-collection 'favorites' user (Termasuk check duplikasi)
func (s *personalizationService) AddFavorite(ctx context.Context, userID string, movie models.Favorite) error {
	
	collectionRef := s.db.Collection("users").Doc(userID).Collection("favorites")

	// 1. Cek duplikasi film
	query := collectionRef.Where("movie_id", "==", movie.MovieID).Limit(1)
	iter := query.Documents(ctx)
	defer iter.Stop()
	
	// Jika iter.Next() tidak mengembalikan error (yaitu menemukan dokumen), maka film sudah ada
	if _, err := iter.Next(); err == nil {
		return ErrFavoriteExists
	}

	// 2. Jika tidak ada duplikasi, tambahkan
	movie.AddedAt = time.Now()
	
	// Gunakan NewDoc() agar Firestore memberikan ID dokumen unik
	_, err := collectionRef.NewDoc().Set(ctx, movie)
	return err
}

// GetFavorites mengambil semua film favorit user
func (s *personalizationService) GetFavorites(ctx context.Context, userID string) ([]models.Favorite, error) {
	
	ref := s.db.Collection("users").Doc(userID).Collection("favorites")
	
	docs, err := ref.Documents(ctx).GetAll()
	if err != nil {
		log.Printf("Gagal mengambil favorit untuk user %s: %v", userID, err)
		return nil, err
	}

	favorites := make([]models.Favorite, 0)
	for _, doc := range docs {
		var fav models.Favorite
		if err := doc.DataTo(&fav); err == nil {
			favorites = append(favorites, fav)
		} else {
			// Tambahkan logging jika ada data yang gagal dipetakan (untuk debugging)
			log.Printf("Gagal memetakan data favorit: %v", err)
		}
	}
	return favorites, nil
}

// RemoveFavorite menghapus film dari favorit berdasarkan movieID
func (s *personalizationService) RemoveFavorite(ctx context.Context, userID string, movieID int) error {
	
	collectionRef := s.db.Collection("users").Doc(userID).Collection("favorites")

	// 1. Cari dokumen favorit berdasarkan movie_id
	query := collectionRef.Where("movie_id", "==", movieID).Limit(1)
	
	iter := query.Documents(ctx)
	doc, err := iter.Next()
	
	if err == iterator.Done {
		// Jika film tidak ditemukan
		return ErrFavoriteNotFound 
	}
	if err != nil {
		log.Printf("Gagal mencari dokumen favorit untuk dihapus: %v", err)
		return err
	}

	// 2. Hapus dokumen yang ditemukan
	_, err = doc.Ref.Delete(ctx)
	return err
}

// === SEARCH HISTORY CRUD ===

// SaveSearchQuery menyimpan query pencarian user ke sub-collection 'history'
func (s *personalizationService) SaveSearchQuery(ctx context.Context, userID string, query string) error {
	
	ref := s.db.Collection("users").Doc(userID).Collection("history")
	
	historyItem := models.SearchHistory{
		Query:      query,
		SearchedAt: time.Now(),
	}

	_, err := ref.NewDoc().Set(ctx, historyItem)
	return err
}

// GetSearchHistory mengambil riwayat pencarian user, diurutkan dari yang terbaru
func (s *personalizationService) GetSearchHistory(ctx context.Context, userID string) ([]models.SearchHistory, error) {
	
	ref := s.db.Collection("users").Doc(userID).Collection("history")
	
	// Query untuk mengambil 20 hasil terbaru, diurutkan berdasarkan waktu pencarian (descending)
	query := ref.OrderBy("searched_at", firestore.Desc).Limit(20)

	docs, err := query.Documents(ctx).GetAll()
	if err != nil {
		log.Printf("Gagal mengambil riwayat pencarian untuk user %s: %v", userID, err)
		return nil, err
	}

	history := make([]models.SearchHistory, 0)
	for _, doc := range docs {
		var h models.SearchHistory
		if err := doc.DataTo(&h); err == nil {
			history = append(history, h)
		}
	}
	return history, nil
}

// CreateProfile membuat profil baru di sub-collection, mengecek batas paket
func (s *personalizationService) CreateProfile(ctx context.Context, userID string, profileName string, isKids bool, pin string) error {
    
    userDocRef := s.db.Collection("users").Doc(userID)
    
    // 1. Ambil data user utama untuk cek batas paket
    userSnap, err := userDocRef.Get(ctx)
    if err != nil {
        return errors.New("data user tidak ditemukan")
    }
    
    var user models.User
    if err := userSnap.DataTo(&user); err != nil {
        return errors.New("gagal membaca data user")
    }

    // PENTING: Cek status pembayaran
    if !user.StatusPembayaran {
        return errors.New("pengguna belum melakukan pembayaran paket")
    }

    // 2. Hitung jumlah profil saat ini
    currentProfiles := 0
    profileIter := userDocRef.Collection("profiles").Documents(ctx)
    // Gunakan loop untuk menghitung jumlah dokumen profil yang ada
    for {
        _, err := profileIter.Next()
        if err == iterator.Done {
            break
        }
        if err != nil {
            return errors.New("gagal menghitung profil")
        }
        currentProfiles++
    }
    
    // 3. CEK LOGIC PAKET: Batas Maksimum (Individu:1, Duo:2, Family:5)
    if currentProfiles >= user.MaxProfiles {
        return ErrMaxProfilesReached
    }

    // 4. CEK LOGIC KIDS: Batas 1 Akun Anak per Akun Utama
    if isKids {
        kidsQuery := userDocRef.Collection("profiles").Where("is_kids_account", "==", true).Limit(1)
        kidsIter := kidsQuery.Documents(ctx)
        defer kidsIter.Stop()
        
        if _, err := kidsIter.Next(); err == nil {
            return ErrKidsProfileExists // Sudah ada akun kids
        }
    }

    // 5. Buat Profil Baru dengan PIN
    newProfile := models.Profile{
        ProfileName:   profileName,
        IsKidsAccount: isKids,
        ProfilePIN:    pin, // <--- PERBAIKAN: Masukkan PIN ke struct profile
    }
    
    // Simpan ke Firestore
    _, err = userDocRef.Collection("profiles").NewDoc().Set(ctx, newProfile)
    return err
}

func (s *personalizationService) GetProfiles(ctx context.Context, userID string) ([]models.Profile, error) {
    ref := s.db.Collection("users").Doc(userID).Collection("profiles")
    
    docs, err := ref.Documents(ctx).GetAll()
    if err != nil {
        return nil, err
    }

    var profiles []models.Profile
    for _, doc := range docs {
        var p models.Profile
        if err := doc.DataTo(&p); err == nil {
            p.ProfileID = doc.Ref.ID
			profiles = append(profiles, p)
        }
    }
    return profiles, nil
}
// /services/personalization_service.go

func (s *personalizationService) InitInitialProfiles(ctx context.Context, userID, packageName string) error {
    userDocRef := s.db.Collection("users").Doc(userID)
    profilesColl := userDocRef.Collection("profiles")

    // Data profil utama yang selalu ada
    mainProfile := map[string]interface{}{
        "profile_name":    "Main Profile",
        "is_kids_account": false,
        "profile_pin":     "0000", // PIN Default, bisa diubah nanti
    }

    switch packageName {
    case "Family":
        // Buat 1 Utama, 1 Kids (Tanpa PIN), sisanya slot kosong
        profilesColl.NewDoc().Set(ctx, mainProfile)
        profilesColl.NewDoc().Set(ctx, map[string]interface{}{
            "profile_name":    "Kids Account",
            "is_kids_account": true,
            "profile_pin":     "", // Kosongkan PIN untuk Kids
        })
    case "Duo":
        // Buat 1 Utama, 1 Profil ke-2
        profilesColl.NewDoc().Set(ctx, mainProfile)
        profilesColl.NewDoc().Set(ctx, map[string]interface{}{
            "profile_name":    "Profile 2",
            "is_kids_account": false,
            "profile_pin":     "0000",
        })
    case "Individual":
        // Hanya 1 Utama
        profilesColl.NewDoc().Set(ctx, mainProfile)
    }

    return nil
}

func (s *personalizationService) GetUser(ctx context.Context, userID string) (models.User, error) {
    // Referensi ke dokumen user utama
    docRef := s.db.Collection("users").Doc(userID)
    
    docSnap, err := docRef.Get(ctx)
    if err != nil {
        return models.User{}, err
    }

    var user models.User
    if err := docSnap.DataTo(&user); err != nil {
        return models.User{}, err
    }

    return user, nil
}

func (s *personalizationService) UpdateProfile(ctx context.Context, userID, profileID string, name string, photoURL string) error {
	ref := s.db.Collection("users").Doc(userID).Collection("profiles").Doc(profileID)
	_, err := ref.Update(ctx, []firestore.Update{
		{Path: "profile_name", Value: name},
		{Path: "profile_photo_url", Value: photoURL},
	})
	return err
}

func (s *personalizationService) UpdatePIN(ctx context.Context, userID, profileID string, newPIN string) error {
	ref := s.db.Collection("users").Doc(userID).Collection("profiles").Doc(profileID)
	_, err := ref.Update(ctx, []firestore.Update{
		{Path: "profile_pin", Value: newPIN},
	})
	return err
}

func (s *personalizationService) AddToWatchlist(ctx context.Context, userID, profileID string, movie models.Favorite) error {
	ref := s.db.Collection("users").Doc(userID).Collection("profiles").Doc(profileID).Collection("watchlist")
	_, err := ref.NewDoc().Set(ctx, movie)
	return err
}

func (s *personalizationService) GetWatchlist(ctx context.Context, userID, profileID string) ([]models.Favorite, error) {
	ref := s.db.Collection("users").Doc(userID).Collection("profiles").Doc(profileID).Collection("watchlist")
	docs, err := ref.Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	var list []models.Favorite
	for _, doc := range docs {
		var movie models.Favorite
		if err := doc.DataTo(&movie); err == nil {
			list = append(list, movie)
		}
	}
	return list, nil
}

func (s *personalizationService) RequestChangeEmail(ctx context.Context, userID, newEmail string) error {
    // 1. Generate 6 Digit OTP
    otp := fmt.Sprintf("%06d", rand.Intn(1000000)) 

    // 2. Simpan ke Firestore
    ref := s.db.Collection("users").Doc(userID)
    _, err := ref.Update(ctx, []firestore.Update{
        {Path: "temp_email", Value: newEmail},
        {Path: "email_otp", Value: otp},
        {Path: "otp_expires_at", Value: time.Now().Add(5 * time.Minute)},
    })

    // 3. KIRIM EMAIL (Dummy Logic - Gunakan SMTP Server Anda)
    // log.Printf("Mengirim email ke %s dengan OTP %s", newEmail, otp)
    return err
}