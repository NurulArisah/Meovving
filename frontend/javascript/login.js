document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // supaya tidak reload halaman default

    // validasi custom di sini
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // hardcoded akun
    const correctEmail = "test@mail.com";
    const correctPassword = "123456";

    if (email === correctEmail && password === correctPassword) {
        window.location.href = "dashboard.html";
    } else {
        alert("Email atau password salah!");
    }
    
    // redirect ke dashboard
    window.location.href = "dashboard.html";
});
