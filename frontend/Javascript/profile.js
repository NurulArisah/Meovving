// Lokasi: frontend/javascript/profile.js

// --- DATA DUMMY ---
const dummyMovies = [
  { title: "Wednesday", img: "https://image.tmdb.org/t/p/w200/9PFonBhy4cQy7Jz20NpMygczOkv.jpg" },
  { title: "Stranger Things", img: "https://image.tmdb.org/t/p/w200/49WJfeN0moxb9IPfGn8AIqMGskD.jpg" },
  { title: "1899", img: "https://image.tmdb.org/t/p/w200/gZleGu1tv7y4gJCTSk95i204N6h.jpg" },
  { title: "Coco", img: "https://image.tmdb.org/t/p/w200/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg" },
  { title: "Elemental", img: "https://image.tmdb.org/t/p/w200/6oH378KUfCEtmvT3oyxrsQk8dYx.jpg" },
];

// --- SELECTOR ELEMENT ---
const viewMode = document.getElementById('viewMode');
const editMode = document.getElementById('editMode');
const pinMode = document.getElementById('pinMode');

const displayName = document.getElementById('displayName');
const avatarInitial = document.getElementById('avatarInitial');
const editNameInput = document.getElementById('editNameInput');
const editAvatarInitial = document.getElementById('editAvatarInitial');
const newPinInput = document.getElementById('newPinInput');

// Header Controls
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

function renderMovieLists() {
    const lists = ['recentContainer', 'favoriteContainer', 'watchlistContainer'];
    lists.forEach(containerId => {
        const container = document.getElementById(containerId);
        const shuffled = [...dummyMovies].sort(() => 0.5 - Math.random());
        container.innerHTML = shuffled.map(movie => `
            <div class="flex-none w-28 group cursor-pointer">
                <div class="w-28 h-40 rounded-lg overflow-hidden shadow-md relative">
                    <img src="${movie.img}" alt="${movie.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                </div>
            </div>
        `).join('');
    });
}

// --- NAVIGASI MODE (View -> Edit) ---

function openEditMode() {
    viewMode.classList.add('hidden');
    editMode.classList.remove('hidden');
    // Ubah Header jadi "Edit Profile" kalau mau, atau biarkan MEOWING
}

function saveProfile() {
    const newName = editNameInput.value.trim();
    if (newName) {
        localStorage.setItem('activeProfile', newName);
        alert("Profile Name Updated!");
        loadProfileData();
        
        // Balik ke View Mode
        editMode.classList.add('hidden');
        viewMode.classList.remove('hidden');
    } else {
        alert("Name cannot be empty!");
    }
}

// --- NAVIGASI PIN MODE (Edit -> Pin) ---

function openPinMode() {
    // Sembunyikan Edit Mode
    editMode.classList.add('hidden');
    
    // Tampilkan Pin Mode
    pinMode.classList.remove('hidden');
    
    // Reset input pin
    newPinInput.value = '';
    newPinInput.focus();

    // Atur Header (Sembunyikan Logo & Tombol X, Tampilkan Back Arrow)
    pageTitle.classList.add('hidden');
    mainBackBtn.classList.add('hidden');
    pinBackBtn.classList.remove('hidden');
}

function closePinMode() {
    // Balik ke Edit Mode
    pinMode.classList.add('hidden');
    editMode.classList.remove('hidden');

    // Kembalikan Header Normal
    pageTitle.classList.remove('hidden');
    mainBackBtn.classList.remove('hidden');
    pinBackBtn.classList.add('hidden');
}

function saveNewPin() {
    // Ambil value dan hapus spasi di awal/akhir
    const pin = newPinInput.value.trim();
    
    if (pin.length > 0) {
        
        // Simpan ke Local Storage
        localStorage.setItem('userPin', pin);
        
        alert("Success! PIN Saved.");
        closePinMode(); // Tutup mode PIN & balik ke Edit Profile
        
    } else {
        alert("PIN cannot be empty!");
    }
}

// --- NAVIGASI UTAMA ---

function goBack() {
    // Kalau sedang di edit mode, tombol X akan mengembalikan ke view mode dulu
    if (!editMode.classList.contains('hidden')) {
        editMode.classList.add('hidden');
        viewMode.classList.remove('hidden');
        loadProfileData(); // Reset data
    } else {
        // Kalau di view mode, baru balik ke Dashboard
        window.location.href = 'dashboard.html';
    }
}

function goToDashboard() {
    window.open('https://www.themoviedb.org/', '_blank');
}