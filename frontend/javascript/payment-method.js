// Ambil nama plan dari URL
const params = new URLSearchParams(window.location.search);
const plan = params.get("plan");

// Data paket (bisa ditambahkan jika perlu)
const packages = {
  family: { name: "Family", price: "Rp. 49.900,00" },
  duo: { name: "Duo", price: "Rp. 29.900,00" },
  individu: { name: "Individu", price: "Rp. 19.900,00" }
};

// Cek kalo plan tidak ditemukan, kembali ke halaman package
if (!plan || !packages[plan]) {
  window.location.href = "package.html"; 
}

// Ambil elemen HTML
document.getElementById("planName").textContent = packages[plan].name;
document.getElementById("planPrice").textContent = packages[plan].price;

// Tampilkan data sesuai pilihan user
// planName.textContent = packages[plan].name;
// planPrice.textContent = packages[plan].price;

// Simpan ke localStorage agar nanti bisa dibaca di confirm-payment page
localStorage.setItem("selectedPlan", JSON.stringify(packages[plan]));


// Fungsi pilih metode pembayaran
function selectPayment(method) {
  localStorage.setItem("paymentMethod", method);
  window.location.href = "confirm-payment.html"; // pindah ke halaman berikutnya
}
