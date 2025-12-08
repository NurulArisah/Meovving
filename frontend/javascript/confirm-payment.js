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
async function processPayment() {
    // 1. Persiapan Data & UI Loading
    const btn = document.getElementById('payButton');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initializing Transaction...';
    btn.disabled = true;

    const selectedName = localStorage.getItem("selectedPlanName");
    const selectedPrice = localStorage.getItem("selectedPlanPrice");
    const token = localStorage.getItem("token"); // Diambil saat user login

    // 2. Fetch ke Backend Go (CheckoutHandler)
    try {
        const response = await fetch('http://localhost:8080/api/v1/payment/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                package_name: selectedName,
                amount: parseInt(selectedPrice) // Pastikan dikirim sebagai angka
            })
        });

        const result = await response.json();

        if (response.ok) {
            // 3. Redirect ke URL Xendit (Invoice URL)
            // Xendit akan menangani tampilan QRIS secara otomatis
            window.location.href = result.payment_url;
        } else {
            // Jika backend menolak (misal: token expired)
            alert("Error: " + (result.error || "Gagal membuat transaksi"));
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    } catch (err) {
        console.error("Connection error:", err);
        alert("Server tidak merespon. Pastikan backend Go sudah berjalan.");
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}