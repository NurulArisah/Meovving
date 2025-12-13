// Lokasi: frontend/javascript/signup.js

// 1. KONFIGURASI API & FIREBASE CLIENT SDK
// Asumsikan instance Firebase Auth sudah tersedia secara global (misal dari firebase-config.js)
const auth = firebase.auth();
const API_SIGNUP_URL = "http://localhost:8080/api/v1/auth/signup";
const API_LOGIN_URL = "http://localhost:8080/api/v1/auth/login";

// Fungsi untuk menyimpan token dan redirect
// function saveTokenAndRedirect(idToken) {
//  localStorage.setItem("firebaseToken", idToken);
//  localStorage.setItem("isLoggedIn", "true");
//  window.location.href = "package.html"; // Redirect ke pemilihan paket
// }

// ===========================================
// 2. SIGN UP REGULER (Email & Password)
// ===========================================
async function daftarUser(event) {
  if (event) event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    showPopup(
      "error",
      "Sign Up Failed",
      "Password dan Confirm Password tidak cocok."
    );
    return;
  }

  const data = { email, password, username };

  try {
    // Panggil Endpoint SignUp di Backend Go
    const response = await fetch(API_SIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();

      // Backend Go TIDAK mengembalikan ID Token, jadi kita harus login client-side

      // LANGKAH KRUSIAL: Setelah sukses dibuat di Backend/Firebase Auth,
      // kita login lagi via Firebase Client SDK untuk mendapatkan ID Token
      const credential = await auth.signInWithEmailAndPassword(email, password);
      const firebaseUser = credential.user;
      // const idToken = await credential.user.getIdToken();

    if (firebaseUser && !firebaseUser.emailVerified) {
        await firebaseUser.sendEmailVerification();
    }

    await auth.signOut();

      showPopup(
        "success",
        "Sign Up Success",
        "Silakan cek email Anda untuk verifikasi. Anda akan diarahkan ke halaman Login.",
        result.message || "Account created successfully."
      );

      setTimeout(() => {
        window.location.replace("login.html");
        // saveTokenAndRedirect(idToken);
      }, 3000);
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Server error" }));
      showPopup(
        "error",
        "Sign Up Failed",
        errorData.error || "Please check your data."
      );
    }
  } catch (err) {
    console.error("Koneksi gagal atau Firebase Client Login error:", err);
    showPopup(
      "error",
      "Connection Error",
      "Server/Firebase not responding or login failed."
    );
  }
}

// ===========================================
// 3. SIGN UP DENGAN GOOGLE (Social Login)
// ===========================================
async function handleGoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
  try {
    // 1. Autentikasi via Firebase Client SDK
    const result = await auth.signInWithPopup(provider);
    const idToken = await result.user.getIdToken();

    // 2. Kirim ID Token ke Backend Go untuk Sinkronisasi Firestore
    const goResponse = await fetch(API_LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });

    if (!goResponse.ok) {
      throw new Error("Failed to sync profile with Go backend.");
    }

    const goData = await goResponse.json();
    console.log("Login sukses ke Backend:", goData);

    // 3. Simpan token dan Redirect
    showPopup(
      "success",
      "Google Signup Success",
      "Profile synced successfully."
    );

    setTimeout(() => {
      saveTokenAndRedirect(idToken);
    }, 1500);
  } catch (error) {
    console.error("Google Auth Error:", error);
    showPopup("error", "Google Login Failed", error.message);
  }
}
