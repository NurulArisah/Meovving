// signup.js - VERSI POPUP
const url = "http://192.168.1.12:8080/api/v1/auth/signup";

async function daftarUser(event) {
    if(event) event.preventDefault(); 
    
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

        if (response.ok) {
            const result = await response.json();
            
            // GANTI ALERT DENGAN POPUP SUCCESS
            showPopup('success', 'Sign Up Success', result.message || 'Account created successfully.');
            
            // Delay sebentar biar popup muncul, baru pindah halaman
            setTimeout(() => {
                window.location.href = "package.html"; 
            }, 1500);

        } else {
            const errorData = await response.json().catch(() => ({ error: "Server error" }));
            console.error("Gagal dari Server:", errorData);
            
            // GANTI ALERT DENGAN POPUP ERROR
            showPopup('error', 'Sign Up Failed', errorData.error || "Please check your data.");
        }
    } catch (err) {
        console.error("Koneksi gagal:", err);
        // POPUP ERROR KONEKSI
        showPopup('error', 'Connection Error', 'Server not responding. Check connection.');
    }
}

// UNTUK GOOGLE
function handleGoogleLogin() {
    localStorage.setItem('activeUser', 'Google User'); 
    
    // POPUP GOOGLE
    showPopup('success', 'Google Signup', 'Successfully signed up with Google.');
    
    setTimeout(() => {
        window.location.href = "package.html";
    }, 1500);
}