// 1. Ambil data Paket dari localStorage
const planName = localStorage.getItem("selectedPlanName");
const planPrice = localStorage.getItem("selectedPlanPrice");

// 2. Tampilkan Paket di Halaman
if (planName && planPrice) {
    document.getElementById("planName").textContent = planName;
    document.getElementById("planPrice").textContent = planPrice;
} else {
    // Kalau data kosong, kembalikan ke halaman package
    window.location.href = "package.html";
}

// 3. Fungsi Proses Pembayaran
function processPayment() {
    // Tampilkan efek loading sederhana (opsional)
    const btn = document.getElementById('payButton');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    // --- LOGIKA REDIRECT KE LINK QRIS ---
    
    // Simulasikan delay sedikit biar terasa "memproses"
    setTimeout(() => {
        // GANTI URL LINK QRIS ASLI
        // const qrisLink = "https://app.midtrans.com/payment-link/...."; 
        
        // KARENA INI DEMO:
        // pergi ke halaman success-payment.html 
        // seolah-olah user sudah bayar di link QRIStersebut.
        
        window.location.href = "success-payment.html"; 
        
        // Contoh jika mau ke link luar:
        // window.location.href = "https://google.com"; // Ganti link qris
    }, 1000);
}