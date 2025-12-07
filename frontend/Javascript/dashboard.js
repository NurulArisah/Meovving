// Lokasi: frontend/javascript/dashboard.js

// --- 1. DATA DUMMY (Ganti URL image dengan file aset lokalmu nanti) ---

const ADULT_CONTENT = {
  trending: [
    { title: "Money Heist", image: "https://image.tmdb.org/t/p/w200/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg" },
    { title: "Stranger Things", image: "https://image.tmdb.org/t/p/w200/49WJfeN0moxb9IPfGn8AIqMGskD.jpg" },
    { title: "1899", image: "https://image.tmdb.org/t/p/w200/gZleGu1tv7y9FCmjlD7Ipwzn2uv.jpg" },
    { title: "Dark", image: "https://image.tmdb.org/t/p/w200/apbrbWs8M9lyOpJAXam93KUbWU.jpg" },
  ],
  topRating: [
    { title: "Captain Marvel", rating: 9.9, image: "https://image.tmdb.org/t/p/w200/AtsgWhDnVBXzFqspCel1llPM5ii.jpg" },
    { title: "Harry Potter", rating: 9.9, image: "https://image.tmdb.org/t/p/w200/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg" },
    { title: "Captain America", rating: 9.8, image: "https://image.tmdb.org/t/p/w200/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg" },
  ]
};

const KIDS_CONTENT = {
  trending: [
    { title: "The Good Dinosaur", image: "https://image.tmdb.org/t/p/w200/8cGZ476v98rEB7n6lEpsu0Y4u85.jpg" },
    { title: "Zootopia", image: "https://image.tmdb.org/t/p/w200/hlK0e0wAQ3V0CsVLz1No7nFGv13.jpg" },
    { title: "Inside Out", image: "https://image.tmdb.org/t/p/w200/lRHE0vzf3oYJrhbsHXjIkF4y53E.jpg" },
    { title: "Minions", image: "https://image.tmdb.org/t/p/w200/q0R4crx2SehcEEQJhYXIjNRQ866.jpg" },
  ],
  topRating: [
    { title: "The Good Dinosaur", rating: 9.9, image: "https://image.tmdb.org/t/p/w200/8cGZ476v98rEB7n6lEpsu0Y4u85.jpg" },
    { title: "Zootopia", rating: 9.9, image: "https://image.tmdb.org/t/p/w200/hlK0e0wAQ3V0CsVLz1No7nFGv13.jpg" },
    { title: "Inside Out", rating: 9.8, image: "https://image.tmdb.org/t/p/w200/lRHE0vzf3oYJrhbsHXjIkF4y53E.jpg" },
  ]
};

// --- 2. LOGIKA UTAMA ---

document.addEventListener('DOMContentLoaded', () => {
  // Cek Status: Apakah yang login ini Kids?
  const isKidsMode = localStorage.getItem('isKidsMode') === 'true';
  const activeUser = localStorage.getItem('activeProfile') || 'User';

  console.log(`Dashboard Loaded. User: ${activeUser}, Kids Mode: ${isKidsMode}`);

  // Pilih Data yang sesuai
  const data = isKidsMode ? KIDS_CONTENT : ADULT_CONTENT;

  // Render Halaman
  renderDashboard(data, isKidsMode);
});

// --- 3. FUNGSI RENDER HTML ---

function renderDashboard(data, isKids) {
  const container = document.getElementById('mainContent');
  container.innerHTML = ''; // Bersihkan loading text

  // A. SECTION 1: TRENDING NOW (Ada Angka Besar 1, 2, 3)
  const trendingSection = `
    <div class="flex flex-col gap-4 animate-fade-in">
      <h2 class="text-white text-lg font-semibold px-6">Trending Now</h2>
      
      <div class="flex overflow-x-auto gap-4 px-6 pb-4 scrollbar-hide">
        ${data.trending.map((movie, index) => `
          <div class="relative flex-shrink-0 w-36 cursor-pointer hover:scale-105 transition-transform duration-300">
            <img src="${movie.image}" alt="${movie.title}" class="w-full h-52 object-cover rounded-xl shadow-lg">
            
            <h1 class="absolute -bottom-4 -left-4 text-[80px] font-anton text-black" 
                style="-webkit-text-stroke: 2px #CC361E; text-stroke: 2px #CC361E; line-height: 1;">
              ${index + 1}
            </h1>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  container.innerHTML += trendingSection;


  // B. SECTION 2: TOP RATING (Ada Bintang Kuning)
  // Kita pakai fungsi helper biar kodingan rapi karena layoutnya sama untuk kategori lain
  container.innerHTML += createSectionHTML("Top Rating", data.topRating);
  
  // C. SECTION 3: TOP RATING MOVIE (Duplikasi data biar terlihat penuh)
  container.innerHTML += createSectionHTML("Top Rating Movie", data.topRating);
  
  // D. SECTION 4: TOP RATING SERIES (Hanya muncul kalau bukan Kids, opsional)
  if (!isKids) {
    container.innerHTML += createSectionHTML("Top Rating Series", ADULT_CONTENT.topRating); 
  }
}

// Helper Function untuk membuat section standar
function createSectionHTML(title, movies) {
  return `
    <div class="flex flex-col gap-4 animate-fade-in">
      <h2 class="text-white text-lg font-semibold px-6">${title}</h2>
      
      <div class="flex overflow-x-auto gap-4 px-6 pb-4 scrollbar-hide">
        ${movies.map(movie => `
          <div class="relative flex-shrink-0 w-32 cursor-pointer hover:scale-105 transition-transform duration-300">
            <img src="${movie.image}" alt="${movie.title}" class="w-full h-48 object-cover rounded-xl shadow-md">
            
            <div class="flex items-center gap-1 mt-2">
              <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              <span class="text-xs text-gray-300 font-medium">${movie.rating}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}