// Lokasi: frontend/javascript/profile.js

// --- SELECTOR ELEMENT ---
const viewMode = document.getElementById('viewMode');
const editMode = document.getElementById('editMode');
const pinMode = document.getElementById('pinMode');

const displayName = document.getElementById('displayName');
const avatarInitial = document.getElementById('avatarInitial');
const editNameInput = document.getElementById('editNameInput');
const editAvatarInitial = document.getElementById('editAvatarInitial');
const newPinInput = document.getElementById('newPinInput');

const pageTitle = document.getElementById('pageTitle');
const mainBackBtn = document.getElementById('mainBackBtn');
const pinBackBtn = document.getElementById('pinBackBtn');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    renderMovieLists();
});

function loadProfileData() {
    const activeProfile = localStorage.getItem('activeProfile') || localStorage.getItem('username') || 'Guest';
    displayName.textContent = activeProfile;
    editNameInput.value = activeProfile;
    
    const initial = activeProfile.charAt(0).toUpperCase();
    avatarInitial.textContent = initial;
    editAvatarInitial.textContent = initial;
}

// FUNGSI RENDER UTAMA
function renderMovieLists() {
    // 1. Ambil data asli dari LocalStorage
    const myFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const myWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    
    // Data Dummy untuk Recent (karena belum ada fitur tracking view)
    const dummyRecent = [
      { title: "Wednesday", img: "https://image.tmdb.org/t/p/w200/9PFonBhy4cQy7Jz20NpMygczOkv.jpg" },
      { title: "Stranger Things", img: "https://image.tmdb.org/t/p/w200/49WJfeN0moxb9IPfGn8AIqMGskD.jpg" },
      { title: "Coco", img: "https://image.tmdb.org/t/p/w200/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg" }
    ];

    // 2. Render Favorite Container
    renderContainer('favoriteContainer', myFavorites, "No favorites yet.");

    // 3. Render Watchlist Container
    renderContainer('watchlistContainer', myWatchlist, "Your watchlist is empty.");

    // 4. Render Recent Container (Dummy)
    renderContainer('recentContainer', dummyRecent, "No recently view yet.");
}

// Helper Function untuk Render Kartu Film
function renderContainer(containerId, movies, emptyMessage) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (movies.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-sm italic ml-2 mt-4">${emptyMessage}</p>`;
    } else {
        container.innerHTML = movies.map(movie => `
            <div class="flex-none w-28 group cursor-pointer" onclick="window.location.href='movie-detail.html'">
                <div class="w-28 h-40 rounded-lg overflow-hidden shadow-md relative border border-transparent group-hover:border-white transition-all">
                    <img src="${movie.image || movie.img}" alt="${movie.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                </div>
                <p class="text-xs text-gray-400 mt-2 truncate text-center group-hover:text-white">${movie.title}</p>
            </div>
        `).join('');
    }
}

// NAVIGASI MODE 

function openEditMode() {
    viewMode.classList.add('hidden');
    editMode.classList.remove('hidden');
}

// Lokasi: frontend/javascript/profile.js

function saveProfile() {
    const newName = editNameInput.value.trim();
    if (newName) {
        localStorage.setItem('activeProfile', newName);
        
        // POPUP
        showPopup('success', 'Profile Updated', 'New name saved successfully.');
        
        loadProfileData();
        //  logic tutup modal
    } else {
        showPopup('error', 'Failed', 'Name cannot be empty!');
    }
}

function saveNewPin() {
    const pin = newPinInput.value.trim();
    if (pin.length > 0) {
        localStorage.setItem('userPin', pin);
        
        // POPUP PIN
        showPopup('lock', 'PIN Set', 'PIN successfully changed.');
        
        closePinMode();
    } else {
        showPopup('error', 'Error', 'PIN cannot be empty!');
    }
}

// PIN MODE
function saveNewPin() {
    const pin = newPinInput.value.trim();
    if (pin.length > 0) {
        localStorage.setItem('userPin', pin);
        alert("Success! PIN Saved.");
        closePinMode();
    } else {
        alert("PIN cannot be empty!");
    }
}

function openPinMode() {
    editMode.classList.add('hidden');
    pinMode.classList.remove('hidden');
    newPinInput.value = '';
    newPinInput.focus();
    pageTitle.classList.add('hidden');
    mainBackBtn.classList.add('hidden');
    pinBackBtn.classList.remove('hidden');
}

function closePinMode() {
    pinMode.classList.add('hidden');
    editMode.classList.remove('hidden');
    pageTitle.classList.remove('hidden');
    mainBackBtn.classList.remove('hidden');
    pinBackBtn.classList.add('hidden');
}

// NAVIGASI UTAMA
function goBack() {
    if (!editMode.classList.contains('hidden')) {
        editMode.classList.add('hidden');
        viewMode.classList.remove('hidden');
        loadProfileData();
    } else {
        window.location.href = 'dashboard.html';
    }
}

function goToDashboard() {
    window.open('https://www.themoviedb.org/', '_blank');
}