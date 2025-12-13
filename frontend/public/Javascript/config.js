const CONFIG = {
    // 1. BACKEND API CONFIGURATION (Targeting Go Server Anda)
    // Nilai ini harus diubah oleh teman Anda ke IP laptop Anda saat pengujian lokal.
    BASE_API_URL: "http://[IP_LAPTOP_ANDA]:8080/api/v1", // Contoh: "http://192.168.1.5:8080/api/v1"

    // 2. FIREBASE PUBLIC CONFIGURATION
    // Ini adalah kunci yang dibutuhkan oleh Firebase SDK di sisi client (Auth, Analytics, dll.).
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyBzv6X57J2ANlxxjcpD7BGmmWLHC1ogvO4",
        authDomain: "meovving.firebaseapp.com",
        projectId: "meovving",
        storageBucket: "meovving.firebasestorage.app",
        messagingSenderId: "885415406382",
        appId: "1:885415406382:web:86f75abbcf7a27b779928bf",
        measurementId: "G-CBM47QFY39"
    },

    //3. HEADER UNTUK PROFILE  Nama header yang digunakan frontend untuk memberi tahu backend profil mana yang aktif
    PROFILE_ID_HEADER: "X-Active-Profile-ID", 
};

export default CONFIG;