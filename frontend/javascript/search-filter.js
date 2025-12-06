// Lokasi: frontend/javascript/search-filter.js

// Fungsi untuk memberikan efek seleksi pada tombol genre
function toggleGenre(button) {
  // untukek apakah tombol sudah punya class 'ring-2' (tanda dipilih)
  if (button.classList.contains('ring-2')) {
    // Jika sudah dipilih, kembalikan ke semula (Unselect)
    button.classList.remove('ring-2', 'ring-[#CC361E]', 'bg-[#3A3A3A]');
    button.classList.add('bg-[#4C4F54]');
  } else {
    // Jika belum dipilih, beri highlight Merah (Select)
    button.classList.remove('bg-[#4C4F54]');
    button.classList.add('ring-2', 'ring-[#CC361E]', 'bg-[#3A3A3A]');
  }
}

// Fungsi untuk tombol Next
function submitSelection() {
  // Ambil semua tombol yang terpilih (yang punya class ring-2)
  const selectedGenres = [];
  const buttons = document.querySelectorAll('.genre-btn');
  
  buttons.forEach(btn => {
    if (btn.classList.contains('ring-2')) {
      selectedGenres.push(btn.innerText);
    }
  });

  if (selectedGenres.length === 0) {
    alert("Please select at least one genre!");
    return;
  }

  // Debugging: lihat apa yang dipilih di console
  console.log("Genre terpilih:", selectedGenres);
  
  // Arahkan ke halaman selanjutnya (misalnya home atau dashboard)
  // Sesuaikan nama file tujuanmu di sini:
  window.location.href = 'dashboard.html'; 
}