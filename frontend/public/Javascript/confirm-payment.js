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


function processPayment() {
    const btn = document.getElementById('payButton');
    
    // Ubah tombol jadi loading
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    // Simulasi Delay
    setTimeout(() => {
        showPopup('success', 'Payment Success!', 'Access activated.');

        // Redirect setelah popup muncul sebentar
        setTimeout(() => {
            window.location.href = "success-payment.html"; 
        }, 1500); // Tunggu 1.5 detik baru pindah
    }, 1500);
}