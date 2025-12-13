// Konfigurasi Pipa ke Laptop Backend Go Anda
const API_BASE_URL = 'http://localhost:8080/api/v1/premium';
const TOKEN = localStorage.getItem('firebaseToken');
const PROFILE_ID = localStorage.getItem('activeProfileID'); // Dari whos-watching.js

let CURRENT_ACTIVE_DATA = { trending: [], topRating: [], anime: [], drakor: [] };
let IS_KIDS_MODE = false;

// 1. FUNGSI UTAMA: Ambil Data Real-time dari Backend
async function fetchRealDashboard() {
    if (!TOKEN || !PROFILE_ID) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Panggil endpoint gabungan yang kita rancang di main.go
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
            headers: { 
                'Authorization': `Bearer ${TOKEN}`,
                'X-Active-Profile-ID': PROFILE_ID // Penting untuk filter profil
            }
        });

        const result = await response.json();
        
        // Simpan ke variabel global untuk fungsi Search
        CURRENT_ACTIVE_DATA = {
            trending: result.trending_now || [],
            topRating: result.trending_now || [], // Gunakan trending sebagai fallback top rating
            anime: result.anime || [],
            drakor: result.korean || []
        };

        IS_KIDS_MODE = localStorage.getItem('isKidsMode') === 'true';
        renderDashboard(CURRENT_ACTIVE_DATA, IS_KIDS_MODE);
    } catch (error) {
        console.error("Gagal load dashboard:", error);
        alert("Gagal terhubung ke Server Go.");
    }
}

// Lokasi: frontend/javascript/dashboard.js

function handleModalWatchlist() {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const index = watchlist.findIndex(m => m.title === currentModalMovie.title);

    if (index === -1) {
        // Tambah
        watchlist.push(currentModalMovie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        
        // --- POPUP CUSTOM ---
        showPopup('bookmark', 'Added to Watchlist', `${currentModalMovie.title} saved.`);
    } else {
        // Hapus (Opsional: jika ingin fitur toggle hapus)
        // watchlist.splice(index, 1);
        // localStorage.setItem('watchlist', JSON.stringify(watchlist));
        
        // --- POPUP CUSTOM ---
        showPopup('error', 'Already Added', 'Movie is in your watchlist.');
    }
    
    updateWatchlistButtonState();
}

function handleModalDetails() {
    // Arahkan ke halaman detail
    window.location.href = 'movie-detail.html';
}

function closeModal(e) { if (e.target === modal) closeModalDirect(); }

function closeModalDirect() {
    modal.classList.add('opacity-0');
    setTimeout(() => { modal.classList.remove('flex'); modal.classList.add('hidden'); }, 300);
}

// --- RENDER UTAMA ---
function renderDashboard(data, isKids) {
    const container = document.getElementById('mainContent');
    if (!container) return;
    container.innerHTML = ''; 

    // --- POPULAR MOVIE (TRENDING) ---
    const trendingHTML = `
        <div class="flex flex-col gap-4 animate-fade-in">
            <h2 class="text-white text-lg font-semibold px-6 border-l-4 border-brand ml-6">Popular Movie</h2>
            <div class="flex overflow-x-auto gap-10 px-8 pb-10 pt-4 scrollbar-hide snap-x">
                ${data.trending.map((movie, index) => `
                    <div class="relative flex-shrink-0 w-[140px] cursor-pointer group snap-center" 
                        onclick="openMovieModal(${movie.id})">
                        <h1 class="absolute -bottom-6 -left-8 text-[120px] font-anton text-outline-shadow z-20 pointer-events-none">${index + 1}</h1>
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="w-full h-[210px] object-cover rounded-xl z-10 group-hover:border-gray-500 border border-transparent">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    container.innerHTML += trendingHTML;

    // --- ANIME & KOREA ---
    if (data.anime.length > 0) container.innerHTML += createSectionHTML("Top Anime", data.anime);
    if (data.drakor.length > 0) container.innerHTML += createSectionHTML("Korean Series", data.drakor);
}

function createSectionHTML(title, movies) {
    return `
        <div class="flex flex-col gap-4 animate-fade-in pb-8">
            <h2 class="text-white text-lg font-semibold px-6 ml-6">${title}</h2>
            <div class="flex overflow-x-auto gap-4 px-6 pb-4 scrollbar-hide snap-x">
                ${movies.map(movie => `
                    <div class="relative flex-shrink-0 w-32 cursor-pointer hover:scale-105 transition-all group snap-start" onclick="openMovieModal(${movie.id})">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="w-full h-48 object-cover rounded-xl">
                        <div class="flex items-center gap-1 mt-2">
                            <i class="fas fa-star text-yellow-400 text-xs"></i>
                            <span class="text-xs text-gray-300">${movie.vote_average.toFixed(1)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 3. MODAL LOGIC: Panggil GetMovieDetail dari Go
async function openMovieModal(movieId) {
    const modal = document.getElementById('movieModal');
    try {
        const res = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
            headers: { 'Authorization': `Bearer ${TOKEN}`, 'X-Active-Profile-ID': PROFILE_ID }
        });
        const movie = await res.json();

        document.getElementById('modalTitle').innerText = movie.title;
        document.getElementById('modalRating').innerText = movie.vote_average.toFixed(1);
        document.getElementById('modalImage').src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    } catch (err) {
        console.error("Gagal ambil detail:", err);
    }
}

// 4. SEARCH LOGIC (LOKAL BERDASARKAN DATA FETCH)
function handleOverlayInput(keyword) {
    const resultSec = document.getElementById('overlaySearchResults');
    if (!keyword) { resultSec.classList.add('hidden'); return; }

    resultSec.classList.remove('hidden');
    const lowerKeyword = keyword.toLowerCase();
    
    // Cari di semua kategori yang sudah di-fetch
    let allMovies = [...CURRENT_ACTIVE_DATA.trending, ...CURRENT_ACTIVE_DATA.anime, ...CURRENT_ACTIVE_DATA.drakor];
    const results = allMovies.filter(m => m.title.toLowerCase().includes(lowerKeyword));

    resultSec.innerHTML = results.map(movie => `
        <div class="flex items-center gap-3 bg-[#1a1a1a] p-2 rounded-lg cursor-pointer" onclick="openMovieModal(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w92${movie.poster_path}" class="w-12 h-16 object-cover rounded">
            <div>
                <div class="font-bold text-sm">${movie.title}</div>
                <div class="text-xs text-gray-400"><i class="fas fa-star text-yellow-500"></i> ${movie.vote_average.toFixed(1)}</div>
            </div>
        </div>
    `).join('');
}

// Event Listeners Dasar
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('translate-x-full'); }
function closeModalDirect() { document.getElementById('movieModal').classList.add('hidden'); }
function goToAccount() { window.location.href = 'account.html'; }
function handleLogout() { localStorage.clear(); window.location.href = 'login.html'; }

// Inisialisasi
document.addEventListener('DOMContentLoaded', fetchRealDashboard);