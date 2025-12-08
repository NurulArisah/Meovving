// signup.js - VERSI STABIL
const url = "http://192.168.1.12:8080/api/v1/auth/signup";

async function daftarUser(event) {
    event.preventDefault(); 
    
    const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        username: document.getElementById('username').value
    };

    console.log("Mengirim data lewat POST ke:", url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // PERBAIKAN: Jangan langsung panggil .json() sebelum cek status
        if (response.ok) {
            const result = await response.json();
            alert("BERHASIL: " + result.message);
            window.location.href = "package.html"; // Pindah ke login
        } else {
            // Jika error (seperti 403, 400, 500), ambil detailnya
            const errorData = await response.json().catch(() => ({ error: "Server menolak akses (Cek CORS)" }));
            console.error("Gagal dari Server:", errorData);
            alert("GAGAL: " + (errorData.error || "Terjadi kesalahan pada server."));
        }
    } catch (err) {
        // Jika server mati atau IP salah (Timeout)
        console.error("Koneksi gagal:", err);
        alert("Server tidak merespon. Pastikan Server Go sudah jalan dan Firewall laptop Backend sudah dibuka.");
    }
    
    //  UNTUK GOOGLE
    function handleGoogleLogin() {
        // anggap user setuju mendaftar pakai akun Googlenya
        localStorage.setItem('activeUser', 'Google User'); 
        
        // Karena ini signup, biasanya lanjut ke pilih paket dulu
        alert("Signup with Google Berhasil! (Simulasi)");
        window.location.href = "package.html";
    }
}