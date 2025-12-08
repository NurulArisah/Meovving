// signup.js - VERSI STABIL
const url = "http://localhost:8080/api/v1/auth/signup";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Konfigurasi Firebase (Ambil dari Firebase Console > Project Settings)
const firebaseConfig = {
    apiKey: "AIzaSyBzv6X57J2ANlxxjcpD7BGmmWLHC1ogvO4",
    authDomain: "meovving.firebaseapp.com",
    projectId: "meovving",
    storageBucket: "meovving.firebasestorage.app",
    messagingSenderId: "885415406382",
    appId: "1:885415406382:web:86f75abbcf7a27b79928bf",
    measurementId: "G-CBM47QFY39"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

async function daftarUser(event) {
    event.preventDefault(); 
    
    // Ambil nilai input
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // VALIDASI: Cek kesamaan password di sisi client
    if (password !== confirmPassword) {
        alert("GAGAL: Password dan Confirm Password tidak sama!");
        return;
    }

    const data = {
        email: email,
        password: password,
        username: username
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            alert("BERHASIL: " + result.message);
            // Setelah signup, arahkan ke pilih paket
            window.location.href = "package.html"; 
        } else {
            const errorData = await response.json();
            alert("GAGAL: " + (errorData.error || "Terjadi kesalahan."));
        }
    } catch (err) {
        console.error("Koneksi gagal:", err);
        alert("Server tidak merespon. Pastikan backend Go sudah berjalan.");
    }
}    
//  UNTUK GOOGLE
async function handleGoogleLogin() {
    try {
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();
        
        // Kirim ID Token ke backend Go
        const response = await fetch('http://localhost:8080/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token: idToken })
        });

        if (response.ok) {
            localStorage.setItem('token', idToken);
            window.location.href = "package.html";
        }
    } catch (error) {
        console.error("Firebase Error:", error);
    }
}

window.handleGoogleLogin = handleGoogleLogin;