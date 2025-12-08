// ==========================================
// 1. CONFIG & GLOBAL STATE
// ==========================================
const API_BASE_URL = "http://localhost:8080/api/v1/premium";
const token = localStorage.getItem('firebaseToken');
 

// Ambil Plan untuk batasan jumlah profil
const storedPlan = localStorage.getItem('selectedPlanName'); 
const CURRENT_PLAN = storedPlan ? storedPlan.toLowerCase() : 'individual'; 

const PLAN_LIMITS = {
  'individual': 1,
  'duo': 2,
  'family': 5,
};

let profiles = []; // State data dari Firestore

// ==========================================
// 2. FETCH DATA DARI BACKEND
// ==========================================

async function fetchProfiles() {
    try {
        const response = await fetch(`${API_BASE_URL}/profiles`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil profil");
        }

        const data = await response.json();

        // ⬇️ KODE YANG KAMU TANYA MASUK DI SINI
        profiles = data.profiles.map(p => ({
            id: p.profile_id,
            name: p.profile_name || 'User',
            isKids: p.is_kids_account,
            color: p.is_kids_account ? 'bg-pink-500' : 'bg-blue-700'
        }));

        updateUI();

    } catch (error) {
        console.error("Error mengambil profil:", error);
    }
}

// ==========================================
// 3. RENDER UI KE HTML (ProfilesContainer)
// ==========================================

function renderProfiles() {
    const container = document.getElementById('profilesContainer');
    if (!container) return;

    container.innerHTML = ''; 
    const maxLimit = PLAN_LIMITS[CURRENT_PLAN] || 1;

    // Menyesuaikan layout grid
    if (CURRENT_PLAN === 'individual') {
        container.className = "flex flex-col items-center justify-center w-full animate-fade-in";
    } else {
        container.className = "grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-12 sm:gap-y-14 content-center animate-fade-in";
    }

    profiles.forEach(profile => {
        const initial = profile.name.charAt(0);
        const profileHTML = `
            <div class="flex flex-col items-center group cursor-pointer" onclick="selectProfile('${profile.id}', '${profile.name}', ${profile.isKids})">
                <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ${profile.color} rounded-[10px] sm:rounded-[15px] shadow-lg mb-3 group-hover:scale-105 transition-all flex items-center justify-center relative overflow-hidden">
                    ${profile.isKids ? '<div class="absolute bottom-0 w-full bg-black/20 backdrop-blur-sm text-[10px] text-center py-1 font-bold text-white">KIDS</div>' : ''}
                    <span class="text-3xl sm:text-4xl font-anton font-bold text-white uppercase select-none">${initial}</span>
                </div>
                <span class="text-sm sm:text-base font-medium text-gray-400 group-hover:text-white truncate w-24 sm:w-32 text-center">
                    ${profile.name}
                </span>
            </div>
        `;
        container.innerHTML += profileHTML;
    });

    // Render tombol (+) jika kuota paket belum penuh
    if (profiles.length < maxLimit) {
        container.innerHTML += `
            <div class="flex flex-col items-center group cursor-pointer" onclick="openModal()">
                <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-2 border-[#3A3A3A] hover:border-white rounded-[10px] sm:rounded-[15px] flex items-center justify-center mb-3 group-hover:bg-[#1a1a1a] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-10 w-10 text-gray-500 group-hover:text-white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </div>
                <span class="text-sm sm:text-base font-medium text-gray-500 group-hover:text-white">Add Profile</span>
            </div>
        `;
    }
}

// ==========================================
// 4. LOGIKA MODAL & SAVE PROFILE (POST)
// ==========================================

async function saveNewProfile() {
    const inputName = document.getElementById('newProfileName');
    const name = inputName.value.trim();
    if (!name) return alert("Masukkan nama!");

    try {
        const response = await fetch(`${API_BASE_URL}/profiles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, is_kids: false, pin: "0000" })
        });

        if (response.ok) {
            closeModal();
            fetchProfiles(); // Refresh Firestore data
        } else {
            const err = await response.json();
            alert(err.error || "Gagal simpan");
        }
    } catch (error) {
        console.error("Error Save:", error);
    }
}

// ==========================================
// 5. SELECT PROFILE & REDIRECT
// ==========================================

function selectProfile(profileId, name, isKids) {
    // MENYIMPAN ID PROFIL UNTUK HEADER X-ACTIVE-PROFILE-ID NANTI
    localStorage.setItem('selected_profile_id', profileId);
    localStorage.setItem('activeProfile', name);
    localStorage.setItem('isKidsMode', isKids);

    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 400);
}

// Helper Modal
function openModal() { document.getElementById('addProfileModal').classList.remove('hidden'); }
function closeModal() { document.getElementById('addProfileModal').classList.add('hidden'); }

// Run
document.addEventListener('DOMContentLoaded', fetchProfiles);