// login.js - VERSI POPUP
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); 

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    
    // Hardcoded akun untuk testing
    const correctEmail = "test@mail.com";
    const correctPassword = "123456";

    if (email === correctEmail && password === correctPassword) {
        // Simpan status login
        localStorage.setItem('isLoggedIn', 'true');
        
        // --- POPUP SUCCESS ---
        showPopup('success', 'Login Success!', 'Welcome back.');

        // Delay redirect
        setTimeout(() => {
            window.location.href = "whos-watching.html"; 
        }, 1500);

    } else {
        // --- POPUP ERROR ---
        showPopup('error', 'Login Failed', 'Incorrect email or password.');
    }
});

// UNTUK GOOGLE
function handleGoogleLogin() {
    localStorage.setItem('activeUser', 'Google User'); 
    localStorage.setItem('isLoggedIn', 'true');

    // --- POPUP GOOGLE ---
    showPopup('success', 'Google Login', 'Logged in via Google.');

    setTimeout(() => {
        window.location.href = "whos-watching.html";
    }, 1500);
}