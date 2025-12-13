// frontend/javascript/popup.js

// 1. Definisikan Icon SVG sesuai desain (Orange/Red theme)
const popupIcons = {
    // Icon Centang Orange (Success/General)
    success: `
        <svg class="w-12 h-12 text-[#FF5722]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" fill="currentColor"/>
        </svg>`,
    
    // Icon Silang Merah (Error)
    error: `
        <svg class="w-12 h-12 text-[#CC361E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill="currentColor"/>
        </svg>`,
    
    // Icon Hati dengan Centang (Favorites)
    love: `
        <svg class="w-12 h-12 text-[#FF5722]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            <circle cx="18" cy="18" r="5" fill="#111" />
            <path d="M16.5 19.5L15 18l-1-1 2.5-2.5 4 4L22 17" stroke="#FF5722" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
    
    // Icon Folder dengan Centang (Watchlist)
    watchlist: `
        <svg class="w-12 h-12 text-[#FF5722]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
            <path d="M10 14l2 2 4-4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,

    // Icon Gembok (PIN/Password)
    lock: `
         <svg class="w-12 h-12 text-[#FF5722]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3 3.1-3s3.1 1.29 3.1 3v2z"/>
         </svg>`
};

// 2. Buat Elemen HTML Popup (Posisi Fixed Top)
document.addEventListener("DOMContentLoaded", () => {
    // Hapus popup lama jika ada (untuk mencegah duplikasi)
    const existing = document.getElementById('customPopup');
    if (existing) existing.remove();

    const popupHTML = `
      <div id="customPopup" class="fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999] 
           bg-[#111] border border-[#222] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 
           min-w-[320px] max-w-md transition-all duration-500 ease-in-out opacity-0 -translate-y-20 pointer-events-none">
            
            <div id="popupIcon" class="flex-shrink-0"></div>

            <div class="flex flex-col">
                <h3 id="popupTitle" class="text-white font-bold text-base tracking-wide">Success</h3>
                <p id="popupMessage" class="text-gray-400 text-xs mt-0.5">Operation completed.</p>
            </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
});

// 3. Fungsi Utama Show Popup
function showPopup(type, title, message) {
    const popup = document.getElementById('customPopup');
    const iconContainer = document.getElementById('popupIcon');
    const titleEl = document.getElementById('popupTitle');
    const msgEl = document.getElementById('popupMessage');

    if (!popup) return; // Guard clause

    // A. Pilih Icon berdasarkan tipe
    // Jika tipe tidak ada di daftar, pakai 'success' sebagai default
    const svgIcon = popupIcons[type] || popupIcons['success'];
    iconContainer.innerHTML = svgIcon;

    // B. Set Teks
    titleEl.innerText = title;
    msgEl.innerText = message;

    // C. Tampilkan (Animasi Turun)
    popup.classList.remove('opacity-0', '-translate-y-20', 'pointer-events-none');
    popup.classList.add('opacity-100', 'translate-y-0');

    // D. Hilangkan otomatis setelah 3 detik
    setTimeout(() => {
        hidePopup();
    }, 3000);
}

function hidePopup() {
    const popup = document.getElementById('customPopup');
    if(popup) {
        // Animasi Naik ke atas & hilang
        popup.classList.remove('opacity-100', 'translate-y-0');
        popup.classList.add('opacity-0', '-translate-y-20', 'pointer-events-none');
    }
}