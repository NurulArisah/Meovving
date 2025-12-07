document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // supaya tidak reload halaman default

    // validasi custom di sini
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // hardcoded akun
    const correctEmail = "test@mail.com";
    const correctPassword = "123456";

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); 

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const correctEmail = "test@mail.com";
    const correctPassword = "123456";

    if (email === correctEmail && password === correctPassword) {
        // Simpan status login sementara
        localStorage.setItem('isLoggedIn', 'true');
        // Arahkan ke Who's Watching dulu, bukan langsung dashboard
        window.location.href = "whos-watching.html"; 
    } else {
        alert("Email atau password salah!");
    }
});   
});
