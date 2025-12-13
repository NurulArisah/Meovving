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
async function submitSelection() {
  const selectedGenres = [];
  const buttons = document.querySelectorAll('.genre-btn');
  
  buttons.forEach(btn => {
    if (btn.classList.contains('ring-2')) {
      selectedGenres.push(btn.innerText.trim());
    }
  });

  if (selectedGenres.length === 0) {
    alert("Please select at least one genre!");
    return;
  }

  // Tampilkan loading sebentar
  const nextBtn = document.querySelector('button[onclick="submitSelection()"]');
  nextBtn.innerText = "Saving...";
  nextBtn.disabled = true;

  try {
    const response = await fetch('http://localhost:8080/api/v1/premium/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Token harus ada!
      },
      body: JSON.stringify({ genres: selectedGenres })
    });

    if (response.ok) {
      console.log("Genre tersimpan ke DB");
      window.location.href = 'whos-watching.html'; 
    } else {
      const errorData = await response.json();
      alert("Error saving preferences: " + errorData.error);
      nextBtn.innerText = "Next";
      nextBtn.disabled = false;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Check connection with Backend.");
    nextBtn.innerText = "Next";
    nextBtn.disabled = false;
  }
}