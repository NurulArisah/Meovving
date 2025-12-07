// Lokasi: frontend/javascript/dashboard.js

// --- 1. DATA DUMMY --- 
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
  ]
};

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
  ]
};

let CURRENT_ACTIVE_DATA = {}; 
let IS_KIDS_MODE = false;

document.addEventListener('DOMContentLoaded', () => {
  IS_KIDS_MODE = localStorage.getItem('isKidsMode') === 'true';
  const activeUser = localStorage.getItem('activeProfile') || 'User';
  console.log(`Dashboard Loaded. User: ${activeUser}, Kids Mode: ${IS_KIDS_MODE}`);
  
  CURRENT_ACTIVE_DATA = IS_KIDS_MODE ? KIDS_CONTENT : ADULT_CONTENT;
  renderDashboard(CURRENT_ACTIVE_DATA, IS_KIDS_MODE);
});

// SEARCH LOGIC
function toggleSearch() {
    const input = document.getElementById('searchInput');
    if (input.style.width === '0px' || input.value === '') {
        input.focus();
    } else {
        doSearch(input.value);
    }
}
function handleEnter(e) {
    if (e.key === 'Enter') doSearch(e.target.value);
}
function doSearch(keyword) {
    if (!keyword) return;
    const lowerKeyword = keyword.toLowerCase();
    let results = [];
    Object.keys(CURRENT_ACTIVE_DATA).forEach(category => {
        const matches = CURRENT_ACTIVE_DATA[category].filter(movie => 
            movie.title.toLowerCase().includes(lowerKeyword)
        );
        results = [...results, ...matches];
    });
    results = [...new Set(results)];
    renderSearchResults(results, keyword);
}
function renderSearchResults(results, keyword) {
    const container = document.getElementById('mainContent');
    if (results.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-500 mt-20 text-xl">No results found for "${keyword}"</div>`;
        return;
    }
    container.innerHTML = `
        <div class="flex flex-col gap-4 animate-fade-in pb-8">
            <h2 class="text-white text-xl font-bold px-6">Search Results: "${keyword}"</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-6">
                ${results.map(movie => `
                    <div class="relative cursor-pointer group hover:scale-105 transition-transform"
                         onclick="openModal('${movie.title.replace(/'/g, "\\'")}', '${movie.rating || 'N/A'}', '${movie.image}')">
                        <img src="${movie.image}" alt="${movie.title}" class="w-full h-64 object-cover rounded-lg">
                        <div class="mt-2 text-sm text-center font-semibold">${movie.title}</div>
                    </div>
                `).join('')}
            </div>
            <button onclick="resetDashboard()" class="mx-auto mt-10 bg-brand px-6 py-2 rounded-full hover:bg-red-700 transition text-white font-bold">Back to Home</button>
        </div>
    `;
}
function resetDashboard() {
    document.getElementById('searchInput').value = '';
    renderDashboard(CURRENT_ACTIVE_DATA, IS_KIDS_MODE);
}

// SIDEBAR & MODAL LOGIC
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('translate-x-full');
}
const modal = document.getElementById('movieModal');
const modalTitle = document.getElementById('modalTitle');
const modalRating = document.getElementById('modalRating');
const modalImage = document.getElementById('modalImage');

function openModal(title, rating, imageUrl) {
    modalTitle.innerText = title;
    modalRating.innerText = rating;
    modalImage.src = imageUrl;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => { modal.classList.remove('opacity-0'); }, 10);
}
function closeModal(e) { if (e.target === modal) closeModalDirect(); }
function closeModalDirect() {
    modal.classList.add('opacity-0');
    setTimeout(() => { modal.classList.remove('flex'); modal.classList.add('hidden'); }, 300);
}

// RENDER UTAMA
function renderDashboard(data, isKids) {
  const container = document.getElementById('mainContent');
  container.innerHTML = ''; 

  // TRENDING 10 (Angka di Depan + Shadow Outline)
  const trendingSection = `
    <div class="flex flex-col gap-4 animate-fade-in">
      <h2 class="text-white text-lg font-semibold px-6 border-l-4 border-brand ml-6">Trending 10 Now</h2>
      
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

  // SECTION LAINNYA
  container.innerHTML += createSectionHTML("Top Rating", data.topRating);
  container.innerHTML += createSectionHTML("Popular Movies", [...data.trending].reverse());
  
  if (!isKids) {
    container.innerHTML += createSectionHTML("Top Series", ADULT_CONTENT.topRating); 
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