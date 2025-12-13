// Lokasi: frontend/javascript/dashboard.js

const isKids = localStorage.getItem('isKidsMode') === 'true';

if (isKids) {
   console.log("Mode Anak Aktif: Filter film 18+");
} else {
   console.log("Mode Dewasa: Tampilkan semua");
}

// --- 1. DATA DUMMY (ADULT) ---
const ADULT_CONTENT = {
  trending: [
    { title: "Stranger Things", image: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg", rating: "8.6" },
    { title: "Wednesday", image: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg", rating: "8.5" },
    { title: "The Last of Us", image: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg", rating: "9.0" },
    { title: "Squid Game", image: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg", rating: "8.4" },
    { title: "Money Heist", image: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg", rating: "8.3" },
    { title: "Trolls 2", image: "https://image.tmdb.org/t/p/w500/1rOY8NCGEpOGVQ2EzMJb6B7Ni6X.jpg", rating: "6.8" },
    { title: "Breaking Bad", image: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", rating: "9.5" },
    { title: "Game of Thrones", image: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg", rating: "9.3" },
    { title: "The Witcher", image: "https://image.tmdb.org/t/p/w500/cRLz8VjRHyqUaV0F0YvJ4Jjq4tD.jpg", rating: "8.1" },
    { title: "Loki", image: "https://image.tmdb.org/t/p/w500/voHUmluYmKyleFk7mnVRwnINLOC.jpg", rating: "8.2" },
  ],
  topRating: [
    { title: "The Shawshank Redemption", rating: 9.3, image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg" },
    { title: "The Godfather", rating: 9.2, image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg" },
    { title: "The Dark Knight", rating: 9.0, image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
    { title: "Pulp Fiction", rating: 8.9, image: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg" },
    { title: "Interstellar", rating: 8.7, image: "https://image.tmdb.org/t/p/w500/gEU2QniL6C8z1BHu8sqQjsuw0nw.jpg" },
    { title: "Fight Club", rating: 8.4, image: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7Qf4n6a87u0.jpg" },
  ],
  anime: [
    { title: "One Piece", rating: 8.9, image: "https://image.tmdb.org/t/p/w500/cMD9Ygz11yjJNZ1lFBTNn30DNWQ.jpg" },
    { title: "Demon Slayer", rating: 8.7, image: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEYdB9authIx.jpg" },
    { title: "Jujutsu Kaisen", rating: 8.6, image: "https://image.tmdb.org/t/p/w500/hD8yEwdAwLjCWOgF9VtpO0wlo28.jpg" },
    { title: "Attack on Titan", rating: 9.0, image: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg" },
    { title: "Spy x Family", rating: 8.5, image: "https://image.tmdb.org/t/p/w500/3r4LYFuXGw36ai2K8mnxQnB5nNR.jpg" },
    { title: "Naruto Shippuden", rating: 8.6, image: "https://image.tmdb.org/t/p/w500/zAYRe2bJxpWTVrwwmBc00VFkAf4.jpg" },
    { title: "Chainsaw Man", rating: 8.4, image: "https://image.tmdb.org/t/p/w500/npdB6eFzizki0WaZ1OvKcJrWe97.jpg" },
  ],
  drakor: [
    { title: "Queen of Tears", rating: 8.8, image: "https://image.tmdb.org/t/p/w500/a3IePLf348450YJ10e82D4jP6f.jpg" }, 
    { title: "The Glory", rating: 8.9, image: "https://image.tmdb.org/t/p/w500/6jI4yYtMOLjY3ib5dC3k2mN6P5g.jpg" },
    { title: "All of Us Are Dead", rating: 8.5, image: "https://image.tmdb.org/t/p/w500/pTEFqAjLdnhBVjS5tScG1jWskGb.jpg" },
    { title: "Vincenzo", rating: 8.8, image: "https://image.tmdb.org/t/p/w500/dvXJgEDVxWWKp95h8N1T8tqD3N2.jpg" },
    { title: "Moving", rating: 8.9, image: "https://image.tmdb.org/t/p/w500/vf54116vVb5E8i2LzD1aI9dG6w.jpg" }, 
    { title: "Sweet Home", rating: 8.3, image: "https://image.tmdb.org/t/p/w500/u8d8w15y5a5V5x5G5a5F5a5h5.jpg" }, 
    { title: "Reply 1988", rating: 9.0, image: "https://image.tmdb.org/t/p/w500/2q2iY8u8G6f8y8G8.jpg" }, 
  ]
};

// --- DATA DUMMY (KIDS) ---
const KIDS_CONTENT = {
  trending: [
    { title: "Super Mario Bros", image: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg", rating: "7.8" },
    { title: "Minions: The Rise of Gru", image: "https://image.tmdb.org/t/p/w500/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg", rating: "7.6" },
    { title: "Zootopia 2", image: "https://image.tmdb.org/t/p/w500/3Wg1LBCiTEXTxRrkNKOqJyyIFyF.jpg", rating: "8.0" },
    { title: "Encanto", image: "https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg", rating: "7.7" },
    { title: "Sing 2", image: "https://image.tmdb.org/t/p/w500/aWeKITRFbbwY8txG5uCj4rMCfSP.jpg", rating: "7.5" },
    { title: "Frozen II", image: "https://image.tmdb.org/t/p/w500/mINJaa34MtknCYl5A41xIK16bD8.jpg", rating: "7.2" },
    { title: "Moana", image: "https://image.tmdb.org/t/p/w500/4YZkIvzf.jpg", rating: "7.6" },
    { title: "Kung Fu Panda 4", image: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg", rating: "7.1" },
    { title: "Inside Out", image: "https://image.tmdb.org/t/p/w500/lRHE0vzf3oYJrhbsHXjIkF4y53E.jpg", rating: "8.2" },
    { title: "Despicable Me 3", image: "https://image.tmdb.org/t/p/w500/6t3cGoVx8tC7W7QvLdDq8I8yNq3.jpg", rating: "6.4" },
  ],
  topRating: [
    { title: "Coco", rating: 9.8, image: "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg" },
    { title: "Toy Story", rating: 9.7, image: "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg" },
    { title: "Inside Out 2", rating: 9.6, image: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg" },
    { title: "Up", rating: 9.5, image: "https://image.tmdb.org/t/p/w500/vpbaStTMt8qqXaEgnOR2EE4DNJk.jpg" },
    { title: "Lion King", rating: 9.4, image: "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg" },
  ],
  anime: [
    { title: "Pokemon", rating: 8.0, image: "https://image.tmdb.org/t/p/w500/rS5l5i30Nl3rZ195yUj8YhX6d.jpg" },
    { title: "Doraemon", rating: 8.2, image: "https://image.tmdb.org/t/p/w500/3k7g0iW1H5g1.jpg" }, 
    { title: "Digimon", rating: 7.9, image: "https://image.tmdb.org/t/p/w500/wlQ3d2W3h7.jpg" }, 
    { title: "Dragon Ball", rating: 8.5, image: "https://image.tmdb.org/t/p/w500/tZ0j3.jpg" }, 
    { title: "Beyblade", rating: 7.0, image: "https://image.tmdb.org/t/p/w500/kZ0.jpg" } 
  ],
  drakor: [
    { title: "Pororo", rating: 8.5, image: "https://image.tmdb.org/t/p/w500/k0.jpg" }, 
    { title: "Tayo the Little Bus", rating: 8.2, image: "https://image.tmdb.org/t/p/w500/k1.jpg" },
    { title: "Robocar Poli", rating: 7.9, image: "https://image.tmdb.org/t/p/w500/k2.jpg" },
    { title: "Larva", rating: 8.0, image: "https://image.tmdb.org/t/p/w500/k3.jpg" },
    { title: "Super Wings", rating: 7.5, image: "https://image.tmdb.org/t/p/w500/k4.jpg" }
  ]
};

// Data Dummy "Riwayat Pencarian"
const POPULAR_SEARCHES = [
    "Boston Blue",
    "Black Phone 2",
    "The Woman In Cabin 10",
    "The Diplomat",
    "Monster",
    "Task"
];

let CURRENT_ACTIVE_DATA = {}; 
let IS_KIDS_MODE = false;

document.addEventListener('DOMContentLoaded', () => {
  IS_KIDS_MODE = localStorage.getItem('isKidsMode') === 'true';
  const activeUser = localStorage.getItem('activeProfile') || 'User';
  console.log(`Dashboard Loaded. User: ${activeUser}, Kids Mode: ${IS_KIDS_MODE}`);
  
  CURRENT_ACTIVE_DATA = IS_KIDS_MODE ? KIDS_CONTENT : ADULT_CONTENT;
  
  // Render Dashboard
  renderDashboard(CURRENT_ACTIVE_DATA, IS_KIDS_MODE);
  
  // Render Dummy Popular Searches
  renderPopularSearches();
  
  // Setup tombol filter agar bisa diklik (UI only)
  setupFilterButtons();
});

// --- SEARCH LOGIC (OVERLAY STYLE) ---

function openSearchOverlay() {
    const overlay = document.getElementById('searchOverlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    document.getElementById('overlaySearchInput').focus();
    // Default: Tampilkan Popular, Sembunyikan Filter & Result
    document.getElementById('popularSearchSection').classList.remove('hidden');
    document.getElementById('filterSection').classList.add('hidden');
    document.getElementById('overlaySearchResults').classList.add('hidden');
}

function closeSearchOverlay() {
    const overlay = document.getElementById('searchOverlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
}

function renderPopularSearches() {
    const list = document.getElementById('popularList');
    list.innerHTML = POPULAR_SEARCHES.map(item => `
        <li class="flex items-center gap-3 cursor-pointer hover:text-white transition group" onclick="searchFromHistory('${item}')">
            <i class="fas fa-arrow-trend-up text-gray-500 group-hover:text-brand"></i>
            <span>${item}</span>
        </li>
    `).join('');
}

function searchFromHistory(keyword) {
    document.getElementById('overlaySearchInput').value = keyword;
    handleOverlayInput(keyword);
}

function handleOverlayInput(keyword) {
    const popularSec = document.getElementById('popularSearchSection');
    const resultSec = document.getElementById('overlaySearchResults');
    const filterSec = document.getElementById('filterSection');

    if (!keyword) {
        // Jika kosong, tampilkan popular lagi
        popularSec.classList.remove('hidden');
        resultSec.classList.add('hidden');
        filterSec.classList.add('hidden');
        return;
    }

    // Sembunyikan Popular & Filter saat mengetik
    popularSec.classList.add('hidden');
    filterSec.classList.add('hidden'); 
    resultSec.classList.remove('hidden');

    // Lakukan pencarian
    const lowerKeyword = keyword.toLowerCase();
    let results = [];
    Object.keys(CURRENT_ACTIVE_DATA).forEach(category => {
        const matches = CURRENT_ACTIVE_DATA[category].filter(movie => 
            movie.title.toLowerCase().includes(lowerKeyword)
        );
        results = [...results, ...matches];
    });
    results = [...new Set(results)];

    if (results.length === 0) {
        resultSec.innerHTML = `<div class="col-span-2 text-center text-gray-500 mt-10">No results found</div>`;
    } else {
        resultSec.innerHTML = results.map(movie => `
            <div class="flex items-center gap-3 bg-[#1a1a1a] p-2 rounded-lg cursor-pointer hover:bg-[#222]" 
                 onclick="openModal('${movie.title.replace(/'/g, "\\'")}', '${movie.rating || 'N/A'}', '${movie.image}')">
                <img src="${movie.image}" class="w-16 h-20 object-cover rounded-md">
                <div>
                    <div class="font-bold text-sm">${movie.title}</div>
                    <div class="text-xs text-gray-400"><i class="fas fa-star text-yellow-500"></i> ${movie.rating || 'N/A'}</div>
                </div>
            </div>
        `).join('');
    }
}

// FILTER LOGIC UI
function toggleFilterSection() {
    const filterSec = document.getElementById('filterSection');
    const popularSec = document.getElementById('popularSearchSection');
    const resultSec = document.getElementById('overlaySearchResults');
    const input = document.getElementById('overlaySearchInput');

    input.value = '';
    
    if (filterSec.classList.contains('hidden')) {
        filterSec.classList.remove('hidden');
        popularSec.classList.add('hidden');
        resultSec.classList.add('hidden');
    } else {
        filterSec.classList.add('hidden');
        popularSec.classList.remove('hidden');
    }
}

function setupFilterButtons() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });
}

function applyFilter() {
    // UI Mockup: Kembali ke tampilan popular atau tutup filter
    toggleFilterSection();
}

// --- UI HELPERS ---

function resetDashboard() {
    window.location.reload();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('translate-x-full');
}

// --- MODAL LOGIC (DIPERBARUI) ---
const modal = document.getElementById('movieModal');
const modalTitle = document.getElementById('modalTitle');
const modalRating = document.getElementById('modalRating');
const modalImage = document.getElementById('modalImage');

// Variabel untuk menyimpan data film yang sedang dibuka di modal
let currentModalMovie = {};

function openModal(title, rating, imageUrl) {
    // 1. Update UI Modal
    modalTitle.innerText = title;
    modalRating.innerText = rating;
    modalImage.src = imageUrl;

    // 2. Simpan Data Film Sementara
    currentModalMovie = {
        id: title, // Sederhana: gunakan judul sebagai ID
        title: title,
        rating: rating,
        image: imageUrl
    };

    // 3. Update Status Tombol Watchlist (Cek apakah sudah ada di profile)
    updateWatchlistButtonState();

    // 4. Tampilkan Modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => { modal.classList.remove('opacity-0'); }, 10);
}

function updateWatchlistButtonState() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const exists = watchlist.some(m => m.title === currentModalMovie.title);
    
    const btnText = document.getElementById('modalWatchlistText');
    const btnIcon = document.getElementById('modalWatchlistIcon');

    if (exists) {
        btnText.innerText = "Added";
        btnIcon.className = "fas fa-check"; // Ubah ikon jadi centang
    } else {
        btnText.innerText = "Watchlist";
        btnIcon.className = "fas fa-plus"; // Kembali ke ikon plus
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
  container.innerHTML = ''; 

  // 1. TRENDING 10
  const trendingSection = `
    <div class="flex flex-col gap-4 animate-fade-in">
      <h2 class="text-white text-lg font-semibold px-6 border-l-4 border-brand ml-6">Popular Movie</h2>
      <div class="flex overflow-x-auto overflow-y-hidden gap-10 px-8 pb-10 pt-4 scrollbar-hide items-end h-auto w-full snap-x">
        ${data.trending.map((movie, index) => `
          <div class="relative flex-shrink-0 w-[140px] cursor-pointer group snap-center" 
               onclick="openModal('${movie.title.replace(/'/g, "\\'")}', '${movie.rating || 'N/A'}', '${movie.image}')">
            
            <h1 class="absolute -bottom-6 -left-8 text-[120px] font-anton leading-none z-20 pointer-events-none text-outline-shadow select-none drop-shadow-md">
              ${index + 1}
            </h1>

            <img src="${movie.image}" alt="${movie.title}" class="w-full h-[210px] object-cover rounded-xl shadow-lg border border-transparent group-hover:border-gray-500 relative z-10">
          </div>
        `).join('')}
        <div class="w-8 flex-shrink-0"></div>
      </div>
    </div>
  `;
  container.innerHTML += trendingSection;

  // 2. TOP RATING
  container.innerHTML += createSectionHTML("Top Rating", data.topRating);

  // 3. ANIME
  if (data.anime && data.anime.length > 0) {
    container.innerHTML += createSectionHTML("Anime", data.anime);
  }

  // 4. DRAKOR
  if (data.drakor && data.drakor.length > 0) {
    container.innerHTML += createSectionHTML("Korea", data.drakor);
  }
}

function createSectionHTML(title, movies) {
  return `
    <div class="flex flex-col gap-4 animate-fade-in pb-8">
      <h2 class="text-white text-lg font-semibold px-6 ml-6">${title}</h2>
      <div class="flex overflow-x-auto gap-4 px-6 pb-4 scrollbar-hide snap-x">
        ${movies.map(movie => `
          <div class="relative flex-shrink-0 w-32 cursor-pointer hover:scale-105 transition-transform duration-300 group snap-start"
               onclick="openModal('${movie.title.replace(/'/g, "\\'")}', '${movie.rating || 'N/A'}', '${movie.image}')">
            <div class="overflow-hidden rounded-xl">
               <img src="${movie.image}" alt="${movie.title}" class="w-full h-48 object-cover rounded-xl shadow-md">
            </div>
            ${movie.rating ? `
            <div class="flex items-center gap-1 mt-2">
              <i class="fas fa-star text-yellow-400 text-xs"></i>
              <span class="text-xs text-gray-300 font-medium">${movie.rating}</span>
            </div>
            ` : ''}
          </div>
        `).join('')}
        <div class="w-4 flex-shrink-0"></div>
      </div>
    </div>
  `;
}

// Navbar logic
function goToProfile() {
    window.location.href = 'profile.html';
}

// ke Account
function goToAccount() {
    window.location.href = 'account.html';
}

function handleLogout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('activeProfile');
        localStorage.removeItem('isKidsMode');
        window.location.href = 'login.html';
    }
}