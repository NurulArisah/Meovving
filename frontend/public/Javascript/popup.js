// frontend/javascript/popup.js

// 1. Buat HTML Pop-up secara otomatis saat script dimuat
document.addEventListener("DOMContentLoaded", () => {
    const popupHTML = `
      <div id="customPopup" class="fixed inset-0 z-[9999] hidden flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0">
        <div id="popupCard" class="bg-[#111] border border-[#333] px-6 py-5 rounded-2xl shadow-2xl flex items-center gap-5 min-w-[320px] max-w-sm transform scale-90 transition-transform duration-300">
            
            <div id="popupIconBg" class="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-opacity-20">
                <i id="popupIcon" class="text-2xl"></i>
            </div>

            <div class="flex flex-col">
                <h3 id="popupTitle" class="text-white font-bold text-lg leading-tight">Success</h3>
                <p id="popupMessage" class="text-gray-400 text-sm mt-1 leading-snug">Operation completed.</p>
            </div>

        </div>
      </div>
    `;
    
    // Masukkan ke dalam body
    document.body.insertAdjacentHTML('beforeend', popupHTML);
});

// 2. Fungsi Utama untuk Memanggil Pop-up
// type: 'success', 'error', 'warning', 'love', 'bookmark', 'lock'
function showPopup(type, title, message) {
    const popup = document.getElementById('customPopup');
    const card = document.getElementById('popupCard');
    const icon = document.getElementById('popupIcon');
    const iconBg = document.getElementById('popupIconBg');
    const titleEl = document.getElementById('popupTitle');
    const msgEl = document.getElementById('popupMessage');

    // Reset Class Warna
    iconBg.className = "w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-opacity-20";
    icon.className = "text-2xl fas"; // Reset icon base class

    // Konfigurasi Tampilan Berdasarkan Tipe
    let colorClass = "";
    
    switch (type) {
        case 'success':
            icon.classList.add('fa-check');
            colorClass = "text-[#CC361E] bg-[#CC361E]"; // Brand Color (Orange/Red)
            break;
        case 'error':
            icon.classList.add('fa-times');
            colorClass = "text-red-600 bg-red-600";
            break;
        case 'love': // Untuk Favorites
            icon.classList.add('fa-heart');
            colorClass = "text-[#CC361E] bg-[#CC361E]";
            break;
        case 'bookmark': // Untuk Watchlist
            icon.classList.add('fa-bookmark'); // Atau fa-folder-plus
            colorClass = "text-[#CC361E] bg-[#CC361E]";
            break;
        case 'lock': // Untuk PIN
            icon.classList.add('fa-lock');
            colorClass = "text-[#CC361E] bg-[#CC361E]";
            break;
        default: // Info/Warning
            icon.classList.add('fa-info');
            colorClass = "text-blue-500 bg-blue-500";
    }

    // Terapkan Warna
    icon.classList.add(colorClass.split(" ")[0]); // Text color
    iconBg.classList.add(colorClass.split(" ")[1]); // Bg color

    // Isi Teks
    titleEl.innerText = title;
    msgEl.innerText = message;

    // TAMPILKAN POPUP (Animasi)
    popup.classList.remove('hidden');
    // Sedikit delay biar transisi opacity jalan
    setTimeout(() => {
        popup.classList.remove('opacity-0');
        card.classList.remove('scale-90');
        card.classList.add('scale-100');
    }, 10);

    // HILANGKAN OTOMATIS SETELAH 2 DETIK
    setTimeout(() => {
        hidePopup();
    }, 2000);
}

function hidePopup() {
    const popup = document.getElementById('customPopup');
    const card = document.getElementById('popupCard');

    popup.classList.add('opacity-0');
    card.classList.remove('scale-100');
    card.classList.add('scale-90');

    setTimeout(() => {
        popup.classList.add('hidden');
    }, 300);
}