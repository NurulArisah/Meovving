// Lokasi: frontend/javascript/dashboard.js

// --- 1. DATA DUMMY (ADULT CONTENT - TOP 10 TRENDING) ---
const ADULT_CONTENT = {
  trending: [
    { title: "Stranger Things", image: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg" },
    { title: "Wednesday", image: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg" },
    { title: "The Last of Us", image: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg" },
    { title: "Squid Game", image: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg" },
    { title: "Money Heist", image: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg" },
    { title: "Trolls 2", image: "https://image.tmdb.org/t/p/w500/1rOY8NCGEpOGVQ2EzMJb6B7Ni6X.jpg" },
    { title: "Breaking Bad", image: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg" },
    { title: "Game of Thrones", image: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg" },
    { title: "The Witcher", image: "https://image.tmdb.org/t/p/w500/cRLz8VjRHyqUaV0F0YvJ4Jjq4tD.jpg" },
    { title: "Loki", image: "https://image.tmdb.org/t/p/w500/voHUmluYmKyleFk7mnVRwnINLOC.jpg" },
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

// --- DATA DUMMY (KIDS CONTENT) ---
const KIDS_CONTENT = {
  trending: [
    { title: "Super Mario Bros", image: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg" },
    { title: "Minions: The Rise of Gru", image: "https://image.tmdb.org/t/p/w500/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg" },
    { title: "Zootopia 2", image: "https://image.tmdb.org/t/p/w500/3Wg1LBCiTEXTxRrkNKOqJyyIFyF.jpg" },
    { title: "Encanto", image: "https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg" },
    { title: "Sing 2", image: "https://image.tmdb.org/t/p/w500/aWeKITRFbbwY8txG5uCj4rMCfSP.jpg" },
  ],
  topRating: [
    { title: "Coco", rating: 9.8, image: "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg" },
    { title: "Toy Story", rating: 9.7, image: "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg" },
    { title: "Inside Out", rating: 9.6, image: "https://image.tmdb.org/t/p/w500/lRHE0vzf3oYJrhbsHXjIkF4y53E.jpg" },
    { title: "Up", rating: 9.5, image: "https://image.tmdb.org/t/p/w500/vpbaStTMt8qqXaEgnOR2EE4DNJk.jpg" },
    { title: "Lion King", rating: 9.4, image: "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg" },
  ]
};

// --- 2. LOGIKA UTAMA ---
document.addEventListener('DOMContentLoaded', () => {
  const isKidsMode = localStorage.getItem('isKidsMode') === 'true';
  const activeUser = localStorage.getItem('activeProfile') || 'User';

  console.log(`Dashboard Loaded. User: ${activeUser}, Kids Mode: ${isKidsMode}`);

  const data = isKidsMode ? KIDS_CONTENT : ADULT_CONTENT;
  renderDashboard(data, isKidsMode);
});

// --- 3. FUNGSI RENDER HTML ---
function renderDashboard(data, isKids) {
  const container = document.getElementById('mainContent');
  container.innerHTML = ''; 

  // --- SECTION 1: TRENDING 10 (FIXED) ---
  const trendingSection = `
    <div class="flex flex-col gap-4 animate-fade-in">
      <h2 class="text-white text-lg font-semibold px-6">Trending 10 Now</h2>
      
      <div class="flex overflow-x-auto overflow-y-hidden gap-6 px-6 pb-16 pt-2 scrollbar-hide items-end h-auto w-full">
        ${data.trending.map((movie, index) => `
          <div class="relative flex-shrink-0 w-36 cursor-pointer hover:scale-105 transition-transform duration-300 group">
            
            <img src="${movie.image}" alt="${movie.title}" class="w-full h-52 object-cover rounded-xl shadow-lg border border-transparent group-hover:border-gray-500 relative z-10">
            
            <h1 class="absolute -bottom-10 -left-6 text-[100px] font-anton text-black select-none z-20 pointer-events-none" 
                style="-webkit-text-stroke: 2px #CC361E; text-stroke: 2px #CC361E; line-height: 1; text-shadow: 2px 2px 0px rgba(0,0,0,0.5);">
              ${index + 1}
            </h1>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  container.innerHTML += trendingSection;

  // --- SECTION 2: TOP RATING ---
  container.innerHTML += createSectionHTML("Top Rating", data.topRating);
  
  // --- SECTION 3: POPULAR ---
  container.innerHTML += createSectionHTML("Popular Movies", [...data.trending].reverse());
  
  // --- SECTION 4: SERIES ---
  if (!isKids) {
    container.innerHTML += createSectionHTML("Top Series", ADULT_CONTENT.topRating); 
  }
}

// --- HELPER FUNCTION (Digunakan untuk section selain Trending) ---
function createSectionHTML(title, movies) {
  return `
    <div class="flex flex-col gap-4 animate-fade-in pb-8">
      <h2 class="text-white text-lg font-semibold px-6">${title}</h2>
      
      <div class="flex overflow-x-auto gap-4 px-6 pb-4 scrollbar-hide">
        ${movies.map(movie => `
          <div class="relative flex-shrink-0 w-32 cursor-pointer hover:scale-105 transition-transform duration-300">
            <img src="${movie.image}" alt="${movie.title}" class="w-full h-48 object-cover rounded-xl shadow-md">
            
            ${movie.rating ? `
            <div class="flex items-center gap-1 mt-2">
              <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              <span class="text-xs text-gray-300 font-medium">${movie.rating}</span>
            </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}