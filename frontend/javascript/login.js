document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); 

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const apiKey = "AIzaSyBzv6X57J2ANlxxjcpD7BGmmWLHC1ogvO4"; // Firebase API Key

    try {
        // 1. Login ke Firebase langsung untuk mendapatkan ID Token
        const fbResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });

        const fbData = await fbResponse.json();

        if (!fbResponse.ok) {
            throw new Error(fbData.error.message);
        }

        // 2. Kirim ID Token ke Backend Go untuk divalidasi
        const goResponse = await fetch("http://localhost:8080/api/v1/auth/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token: fbData.idToken })
        });

        // Cek status response backend sebelum parsing JSON
        if (!goResponse.ok) {
            const rawError = await goResponse.text(); 
            console.error("Backend Error Raw:", rawError);
            throw new Error(`Gagal ke backend Go: ${goResponse.status}`);
        }

        const goData = await goResponse.json();

        // 3. Jika Sukses ke Backend, Simpan Session & Redirect
        console.log("Login Sukses Ke Backend:", goData);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user_uid', goData.uid);

        // PERBAIKAN: Gunakan nama 'firebaseToken' agar sinkron dengan file berikutnya
        localStorage.setItem('firebaseToken', fbData.idToken); 

        // Arahkan ke Who's Watching
        window.location.href = "whos-watching.html";

    } catch (error) {
        console.error("Auth Error:", error);
        alert("Login Gagal: " + error.message);
    }

    //TAMBAHAN UNTUK GOOGLE
    function handleGoogleLogin() {
        localStorage.setItem('activeUser', 'Google User'); 
        localStorage.setItem('isLoggedIn', 'true');

        // 2. Beri pesan kecil psioonal)
        alert("Login with Google Berhasil! (Simulasi)");
        window.location.href = "whos-watching.html";
    }
});