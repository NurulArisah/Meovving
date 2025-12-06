// GANTI DISINI UNTUK CEK TAMPILAN ('individual', 'duo', 'family')
const CURRENT_PLAN = 'family'; 

const PLAN_LIMITS = {
  'individual': 1,
  'duo': 2,
  'family': 10
};

let profiles = [
  { id: 1, name: 'Brr Patapim', color: 'bg-blue-700' }
];

const colorPalette = [
  'bg-blue-600', 'bg-orange-500', 'bg-pink-600', 
  'bg-purple-600', 'bg-green-600', 'bg-teal-500',
  'bg-indigo-600', 'bg-rose-600'
];

function renderProfiles() {
  const container = document.getElementById('profilesContainer');
  container.innerHTML = ''; 
  const maxLimit = PLAN_LIMITS[CURRENT_PLAN];

  //LOGIKA PERBAIKAN POSISI (FIX CENTER)
  // jika paket INDIVIDUAL (cuma 1 item),pakai FLEX agar pas ditengah
  // jika paket DUO/FAMILY (banyak item), pakai GRID 2 kolom
  
  if (CURRENT_PLAN === 'individual') {
    // mode Flexbox (untuk 1 item pas ditengah)
    container.className = "flex flex-col items-center justify-center w-full";
  } else {
    // Mode Grid (Untuk banyak item)
    container.className = "grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-12 content-center";
  }
  // ---------------------------------------------

  // 1. Render Profil User
  profiles.forEach(profile => {
    const profileHTML = `
      <div class="flex flex-col items-center group cursor-pointer animate-fade-in" onclick="selectProfile('${profile.name}')">
        <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ${profile.color} rounded-[20px] shadow-lg mb-3 group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 flex items-center justify-center">
           <span class="text-3xl font-bold text-white/20 uppercase select-none">${profile.name.charAt(0)}</span>
        </div>
        <span class="text-sm sm:text-base font-medium text-gray-300 group-hover:text-white transition-colors truncate w-24 sm:w-32 text-center">
          ${profile.name}
        </span>
      </div>
    `;
    container.innerHTML += profileHTML;
  });

  // 2. Render Tombol Add (+) jika bukan paket Individual dan belum limit
if (CURRENT_PLAN !== 'individual' && profiles.length < maxLimit) {
    // --- PERUBAHAN DI BAGIAN SVG INI ---
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

  const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

  profiles.push({
    id: Date.now(),
    name: name,
    color: randomColor
  });

  closeModal();
  renderProfiles();
}

function selectProfile(name) {
  console.log("Login sebagai:", name);
  localStorage.setItem('activeProfile', name);
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s';
  setTimeout(() => {
    window.location.href = 'dashboard.html'; 
  }, 500);
}

function goToDashboard() {
  const activeUser = profiles[0].name;
  localStorage.setItem('activeProfile', activeUser);
  window.location.href = 'dashboard.html';
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

inputName.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') saveNewProfile();
});

document.addEventListener('DOMContentLoaded', renderProfiles);