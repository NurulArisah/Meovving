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

    //TAMBAHAN UNTUK GOOGLE
    function handleGoogleLogin() {
        // 1. Simpan data dummy seolah-olah user login pakai Google
        // Kita pakai nama akun Google User
        localStorage.setItem('activeUser', 'Google User'); 
        localStorage.setItem('isLoggedIn', 'true');

        // 2. Beri pesan kecil psioonal)
        alert("Login with Google Berhasil! (Simulasi)");

        // 3. Arahkan ke Who's Watching
        window.location.href = "whos-watching.html";
    }

    
});   
});
