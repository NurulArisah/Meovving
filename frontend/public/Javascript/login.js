// Lokasi: frontend/javascript/login.js

// Asumsikan instance Firebase Auth sudah tersedia secara global
const auth = firebase.auth();

// !!! GANTI DENGAN URL API RAILWAY ANDA !!!
// Pastikan ini menggunakan domain HTTPS Railway Anda saat deploy
const API_SIGNUP_URL = "http://localhost:8080/api/v1/auth/signup";
const API_LOGIN_URL = "http://localhost:8080/api/v1/auth/login";

// Fungsi utilitas untuk menyimpan token dan redirect ke halaman profil
function saveTokenAndRedirect(idToken) {
    localStorage.setItem("firebaseToken", idToken);
    localStorage.setItem("isLoggedIn", "true");
    // Menggunakan window.location.replace agar halaman login tidak ada di history
    window.location.replace("whos-watching.html");
}

// ===========================================
// 1. LOGIN REGULER (Email & Password)
// ===========================================
document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            // 1. LOGIN VIA FIREBASE CLIENT SDK
            const userCredential = await auth.signInWithEmailAndPassword(
                email,
                password
            );
            const user = userCredential.user; // Ambil objek user

            await user.getIdToken(true);
            await user.reload();
            const idToken = await user.getIdToken();

            // ===============================================
            // !!! LOGIKA KRUSIAL: CEK EMAIL VERIFIKASI !!!
            // ===============================================
            if (!user.emailVerified) {
                // Opsional: Kirim ulang link verifikasi jika pengguna lupa
                // await user.sendEmailVerification(); 

                // Wajib logout agar sesi tidak tersimpan
                await auth.signOut(); 

                showPopup('warning', 'Verification Required', 'Email Anda belum diverifikasi. Silakan cek inbox Anda untuk melanjutkan.');

                setTimeout(() => {
                    window.location.replace("login.html"); // Tetap di halaman login
                }, 4000);
                return; // Hentikan alur login/sinkronisasi
            }

            // 2. SINKRONISASI KE BACKEND GO
            const goResponse = await fetch(API_LOGIN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_token: idToken }),
            });

            if (!goResponse.ok) {
                const errorData = await goResponse
                    .json()
                    .catch(() => ({ error: "Sync error" }));
                throw new Error(
                    errorData.error || "Failed to sync profile after Firebase login."
                );
            }

            // Ambil data untuk cek pembayaran
            const data = await goResponse.json();

            // 3. LOGIKA CEK PEMBAYARAN
            if (data.requires_payment === true) {
                showPopup(
                    "warning",
                    "Payment Required",
                    "Silakan pilih paket langganan Anda."
                );
                setTimeout(() => {
                    window.location.replace("package.html");
                }, 2000);
                return;
            }

            // 4. SUKSES
            showPopup("success", "Login Success!", "Welcome back.");

            setTimeout(() => {
                saveTokenAndRedirect(idToken);
            }, 1500);
        } catch (error) {
            // Tangani Error dari Firebase
            let title = "Login Failed";
            let msg = "Unknown Error. Please try again.";

            if (error.code === "auth/user-not-found") {
                title = "Account Not Found";
                msg = "Akun belum terdaftar. Silakan menuju halaman Sign Up.";

                showPopup("warning", title, msg);

                // REDIRECT OTOMATIS KE SIGNUP setelah popup
                setTimeout(() => {
                    window.location.replace("signup.html");
                }, 2500);
                return; // Hentikan eksekusi
            } else if (error.code === "auth/wrong-password") {
                msg = "Incorrect password.";
            } else {
                // Error dari fetch backend Go atau error lainnya
                console.error("Login Error:", error);
                msg = error.message;
            }

            // Tampilkan popup untuk error lain (misal: password salah)
            if (error.code !== "auth/user-not-found") {
                showPopup("error", title, msg);
            }
        }
    });

// ===========================================
// 2. LOGIN DENGAN GOOGLE (Social Login)
// ===========================================
async function handleGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: "select_account",
    });

    try {
        // 1. Autentikasi via Firebase Client SDK
        const result = await auth.signInWithPopup(provider);
        const user = result.user; // Ambil objek user

        // NOTE: Karena Google sudah memverifikasi email,
        // kita tidak perlu pengecekan user.emailVerified di sini.

        const idToken = await user.getIdToken();

        // 2. Kirim ID Token ke Backend Go
        const goResponse = await fetch(API_LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token: idToken }),
        });

        if (!goResponse.ok) {
            throw new Error(
                "Failed to sync profile with Go backend after Google login."
            );
        }

        // AMBIL DATA RESPONSE DARI GO BACKEND
        const data = await goResponse.json();

        // 3. LOGIKA CEK PEMBAYARAN (Sama dengan Login Reguler)
        if (data.requires_payment === true) {
            showPopup(
                "warning",
                "Payment Required",
                "Silakan pilih paket langganan Anda."
            );
            setTimeout(() => {
                window.location.replace("package.html");
            }, 2000);
            return; // Hentikan proses login
        }

        // 4. SUKSES: Sudah Bayar, Lanjutkan ke halaman profil
        showPopup(
            "success",
            "Google Login Success",
            "Profile synced successfully."
        );

        setTimeout(() => {
            saveTokenAndRedirect(idToken); // Redirect ke whos-watching.html
        }, 1500);
    } catch (error) {
        console.error("Google Auth Error:", error);
        if (error.code !== "auth/popup-closed-by-user") {
            showPopup("error", "Google Login Failed", error.message);
        }
    }
}