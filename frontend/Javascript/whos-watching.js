// Lokasi: frontend/javascript/whos-watching.js

// ==========================================
// GANTI DISINI UNTUK CEK TAMPILAN ('individual', 'duo', 'family')
const CURRENT_PLAN = 'family'; 
// ==========================================

const PLAN_LIMITS = {
  'individual': 1,
  'duo': 2,
  'family': 5
};

// Data Dummy Awal
let profiles = [
  { id: 1, name: 'Brr Patapim', color: 'bg-blue-700', isKids: false }
];

// --- LOGIKA KHUSUS FAMILY: AUTO ADD KIDS PROFILE ---
// Jika paket family, dan belum ada akun Kids, kita tambahkan manual.
if (CURRENT_PLAN === 'family') {
  // Cek apakah sudah ada akun Kids biar tidak duplikat
  const hasKids = profiles.some(p => p.name === 'Kids');
  if (!hasKids) {
    profiles.push({ 
      id: 999, 
      name: 'Kids', 
      color: 'bg-pink-500', // Warna Pink khas profil anak
      isKids: true          // Penanda khusus
    });
  }
}

const colorPalette = [
  'bg-blue-600', 'bg-orange-500', 'bg-pink-600', 
  'bg-purple-600', 'bg-green-600', 'bg-teal-500',
  'bg-indigo-600', 'bg-rose-600'
];

function renderProfiles() {
  const container = document.getElementById('profilesContainer');
  container.innerHTML = ''; 
  const maxLimit = PLAN_LIMITS[CURRENT_PLAN];

  // Logika posisi tengah untuk Individual
  if (CURRENT_PLAN === 'individual') {
    container.className = "flex flex-col items-center justify-center w-full animate-fade-in";
  } else {
    container.className = "grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-12 content-center animate-fade-in";
  }

  // 1. Render Profil User
  profiles.forEach(profile => {
    // Kita kirim parameter 'isKids' ke fungsi selectProfile
    // profile.isKids || false --> artinya jika tidak ada properti isKids, dianggap false
    const isKidsValue = profile.isKids ? true : false;

    const profileHTML = `
      <div class="flex flex-col items-center group cursor-pointer" onclick="selectProfile('${profile.name}', ${isKidsValue})">
        <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ${profile.color} rounded-[20px] shadow-lg mb-3 group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden">
           
           ${isKidsValue ? '<div class="absolute bottom-0 w-full bg-black/20 text-[10px] text-center py-1 font-bold tracking-widest">KIDS</div>' : ''}
           
           <span class="text-3xl font-bold text-white/20 uppercase select-none">${profile.name.charAt(0)}</span>
        </div>
        <span class="text-sm sm:text-base font-medium text-gray-300 group-hover:text-white transition-colors truncate w-24 sm:w-32 text-center">
          ${profile.name}
        </span>
      </div>
    `;
    container.innerHTML += profileHTML;
  });

  // 2. Render Tombol Add (+) 
  // Batas dikurangi 1 jika ada akun Kids (karena Kids itu bawaan, bukan user tambah sendiri)
  // Tapi untuk simpelnya kita pakai panjang array profiles saja.
  if (CURRENT_PLAN !== 'individual' && profiles.length < maxLimit) {
    const addBtnHTML = `
      <div class="flex flex-col items-center group cursor-pointer" onclick="openModal()">
        <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-[#1E1E1E] border-2 border-[#3A3A3A] rounded-[20px] flex items-center justify-center mb-3 group-hover:border-gray-400 group-hover:bg-[#252525] transition-all duration-300 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-10 w-10 sm:h-12 sm:w-12 text-gray-500 group-hover:text-white transition-colors">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <span class="text-sm sm:text-base font-medium text-gray-500 group-hover:text-white transition-colors">Add Profile</span>
      </div>
    `;
    container.innerHTML += addBtnHTML;
  }
}

// --- NAVIGASI LOGIN (PENTING!) ---
function selectProfile(name, isKids) {
  console.log(`Login sebagai: ${name} | Mode Kids: ${isKids}`);
  
  // Simpan data user yang aktif
  localStorage.setItem('activeProfile', name);
  
  // Simpan Status KIDS MODE
  // Nanti di halaman Dashboard, kamu harus cek: if (localStorage.getItem('isKidsMode') === 'true') { filterFilm13() }
  localStorage.setItem('isKidsMode', isKids); 

  // Animasi Transisi
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s';
  setTimeout(() => {
    window.location.href = 'dashboard.html'; 
  }, 500);
}

// --- BAGIAN LAIN TETAP SAMA ---
const modal = document.getElementById('addProfileModal');
const inputName = document.getElementById('newProfileName');

function openModal() {
  modal.classList.remove('hidden');
  inputName.value = '';
  setTimeout(() => inputName.focus(), 100);
}

function closeModal() {
  modal.classList.add('hidden');
}

function saveNewProfile() {
  const name = inputName.value.trim();
  if (!name) return;

  // Proteksi: Jangan boleh namain profil "Kids" lagi biar gak bingung
  if (name.toLowerCase() === 'kids') {
    alert("Nama 'Kids' sudah dipesan untuk profil khusus anak!");
    return;
  }

  const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

  profiles.push({
    id: Date.now(),
    name: name,
    color: randomColor,
    isKids: false // Profil baru defaultnya DEWASA
  });

  closeModal();
  renderProfiles();
}

function goToDashboard() {
  // Tombol Next di pojok kanan bawah akan login ke user pertama (biasanya admin/dewasa)
  const firstUser = profiles[0];
  selectProfile(firstUser.name, firstUser.isKids || false);
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

inputName.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') saveNewProfile();
});

document.addEventListener('DOMContentLoaded', renderProfiles);