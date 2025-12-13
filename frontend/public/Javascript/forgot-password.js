// Lokasi: frontend/javascript/forgot-password.js

const stepEmail = document.getElementById('stepEmail');
const stepReset = document.getElementById('stepReset');
const emailInput = document.getElementById('emailInput');
const displayEmail = document.getElementById('displayEmail');

// 1. Fungsi saat tombol "Sent Me Email" diklik
function handleSendEmail() {
    const email = emailInput.value.trim();

    if (!email) {
        alert("Please enter your email address.");
        return;
    }

    // Simulasi Loading (agar terasa ada proses kirim email)
    // Di real app, di sini kita panggil API Backend
    const btn = document.querySelector('button');
    btn.innerText = "Sending...";
    btn.disabled = true;

    setTimeout(() => {
        // Pindah ke tampilan Reset Password
        stepEmail.classList.add('hidden');
        stepReset.classList.remove('hidden');
        stepReset.classList.add('flex'); // Karena tadi hidden, sekarang jadi flex

        // Masukkan email user ke form kedua (Read Only)
        displayEmail.value = email;
        
        alert(`Verification link sent to ${email} (Simulation)`);
    }, 1000);
}

// 2. Fungsi saat tombol "Change Password" diklik
function handleChangePassword() {
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;

    if (!newPass || !confirmPass) {
        alert("Please fill in all fields.");
        return;
    }

    if (newPass !== confirmPass) {
        alert("Passwords do not match!");
        return;
    }

    // Simulasi Sukses
    alert("Password Changed Successfully! Please Login.");
    
    // Redirect kembali ke halaman Login
    window.location.href = "login.html";
}