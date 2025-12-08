// Lokasi: frontend/javascript/whos-watching.js

// AMBIL DATA DINAMIS DARI LOCAL STORAGE

// Ambil paket yang dipilih dari halaman Package
// Jika tidak ada data (misal langsung login), default ke 'individual'
const storedPlan = localStorage.getItem('selectedPlanName'); 
const CURRENT_PLAN = storedPlan ? storedPlan.toLowerCase() : 'individual'; 

// Ambil username dari halaman Login/Signup
// JIKA tidak ada data, default ke 'Me'
const mainUserName = localStorage.getItem('activeUser') || 'Me'; 

// ==========================================

const PLAN_LIMITS = {
  'individual': 1,
  'duo': 2,
  'family': 5,
  'premium': 5 // jaga-jaga nama paketnya 'premium' tapi fiturnya sama kayak family
};

// Data profil awal (Otomatis menggunakan nama user utama)
let profiles = [
  { id: 1, name: mainUserName, color: 'bg-blue-700', isKids: false }
];

// --- LOGIKA KHUSUS FAMILY: AUTO ADD KIDS PROFILE ---
// Cek apakah paket mengandung kata "family" (biar aman jika datanya "Family Plan" dll)
if (CURRENT_PLAN.includes('family')) {
  // Cek apakah sudah ada akun Kids biar tidak duplikat
  const hasKids = profiles.some(p => p.name === 'Kids');
  if (!hasKids) {
    profiles.push({ 
      id: 999, 
      name: 'Kids', 
      color: 'bg-pink-500', // Warna pink khas profil anak
      isKids: true          // Penanda khusus untuk filtering konten nanti
    });
  }
}

// palette warna untuk profil baru (random pick)
const colorPalette = [
  'bg-blue-600', 'bg-orange-500', 'bg-pink-600', 
  'bg-purple-600', 'bg-green-600', 'bg-teal-500',
  'bg-indigo-600', 'bg-rose-600', 'bg-yellow-600'
];

// Fungsi Utama: Merender tampilan profil ke HTML 
function renderProfiles() {
  const container = document.getElementById('profilesContainer');
  if (!container) return; // Error safety

  container.innerHTML = ''; 
  
  // Ambil batas kuota berdasarkan paket. Jika paket tidak dikenali, default 1
  const maxLimit = PLAN_LIMITS[CURRENT_PLAN] || 1;

  // Logika Layout: Tengah untuk Individual, Grid untuk Duo/Family
  if (CURRENT_PLAN === 'individual') {
    container.className = "flex flex-col items-center justify-center w-full animate-fade-in";
  } else {
    // Grid responsif (2 kolom)
    container.className = "grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-12 sm:gap-y-14 content-center animate-fade-in";
  }

  // 1. Render Kartu Profil User
  profiles.forEach(profile => {
    // Menyiapkan nilai boolean untuk dikirim ke fungsi onclick
    const isKidsValue = profile.isKids ? true : false;

    // Menentukan inisial nama (huruf pertama)
    const initial = profile.name.charAt(0);

    const profileHTML = `
      <div class="flex flex-col items-center group cursor-pointer" onclick="selectProfile('${profile.name}', ${isKidsValue})">
        <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ${profile.color} rounded-[10px] sm:rounded-[15px] shadow-lg mb-3 group-hover:scale-105 group-hover:ring-4 group-hover:ring-white/80 transition-all duration-300 flex items-center justify-center relative overflow-hidden">
           
           ${isKidsValue ? '<div class="absolute bottom-0 w-full bg-black/20 backdrop-blur-sm text-[10px] text-center py-1 font-bold tracking-widest text-white">KIDS</div>' : ''}
           
           <span class="text-3xl sm:text-4xl font-bold text-white/90 drop-shadow-md uppercase select-none font-anton">${initial}</span>
        </div>
        
        <span class="text-sm sm:text-base font-medium text-gray-400 group-hover:text-white transition-colors truncate w-24 sm:w-32 text-center">
          ${profile.name}
        </span>
      </div>
    `;
    container.innerHTML += profileHTML;
  });

  // 2. Render Tombol Add (+) jika kuota belum penuh
  if (CURRENT_PLAN !== 'individual' && profiles.length < maxLimit) {
    const addBtnHTML = `
      <div class="flex flex-col items-center group cursor-pointer" onclick="openModal()">
        <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-transparent border-2 border-[#3A3A3A] hover:border-white rounded-[10px] sm:rounded-[15px] flex items-center justify-center mb-3 group-hover:bg-[#1a1a1a] transition-all duration-300 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-10 w-10 sm:h-12 sm:w-12 text-gray-500 group-hover:text-white transition-colors">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <span class="text-sm sm:text-base font-medium text-gray-500 group-hover:text-white transition-colors">Add Profile</span>
      </div>
    `;
    container.innerHTML += addBtnHTML;
  }
}

// --- NAVIGASI LOGIN ---
function selectProfile(name, isKids) {
  console.log(`Login attempt: ${name} | Kids Mode: ${isKids}`);
  
  localStorage.setItem('activeProfile', name);
  localStorage.setItem('isKidsMode', isKids); 

  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease-in-out';
  
  setTimeout(() => {
    window.location.href = 'dashboard.html'; 
  }, 400);
}

// --- LOGIKA MODAL (POPUP) ---
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
  
  if (!name) {
    alert("Please enter a name");
    return;
  }

  // Validasi Nama Kids & Duplikat
  if (name.toLowerCase() === 'kids') {
    alert("Nama 'Kids' sudah dipesan!");
    return;
  }
  const isDuplicate = profiles.some(p => p.name.toLowerCase() === name.toLowerCase());
  if (isDuplicate) {
    alert("Nama sudah ada!");
    return;
  }

  const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

  profiles.push({
    id: Date.now(),
    name: name,
    color: randomColor,
    isKids: false 
  });

  closeModal();
  renderProfiles();
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

inputName.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') saveNewProfile();
});

document.addEventListener('DOMContentLoaded', renderProfiles);