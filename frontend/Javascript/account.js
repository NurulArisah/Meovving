// SELECTOR
const sections = {
    main: document.getElementById('sectionMain'),
    password: document.getElementById('sectionPassword'),
    email: document.getElementById('sectionEmail'),
    otp: document.getElementById('sectionOTP')
};

const pageTitle = document.getElementById('pageTitle');
const backBtn = document.getElementById('backBtn');
const brandLogo = document.getElementById('brandLogo');

// Data Element
const validDateEl = document.getElementById('validDate');
const currentEmailDisplay = document.getElementById('currentEmailDisplay');
const otpEmailTarget = document.getElementById('otpEmailTarget');
const newEmailInput = document.getElementById('newEmailInput');

// State saat ini (sedang di halaman apa?)
let currentMode = 'main'; 

// 1. INITIALIZATION 
document.addEventListener('DOMContentLoaded', () => {
    loadAccountData();
});

async function loadAccountData() {
    // Tanggal membership tetap dummy atau ambil dari database jika ada field-nya
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    validDateEl.textContent = nextYear.toLocaleDateString('en-US', options);

    // Ambil email asli dari server/token, bukan localStorage dummy
    try {
        // Jika Richan menyimpan email di token JWT saat login:
        const userEmail = localStorage.getItem('userEmail') || "Loading...";
        currentEmailDisplay.textContent = userEmail;
    } catch (e) {
        currentEmailDisplay.textContent = "brrpatapim@gmail.com";
    }
}

// --- 2. NAVIGATION LOGIC ---

function goTo(mode) {
    // Sembunyikan semua section dulu
    Object.values(sections).forEach(sec => sec.classList.add('hidden'));
    
    currentMode = mode;

    if (mode === 'password') {
        sections.password.classList.remove('hidden');
        pageTitle.textContent = "Create New Password";
        brandLogo.classList.add('hidden'); // Logo hilang di sub-page
        // Ubah ikon back jadi panah
        backBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;
    
    } else if (mode === 'email') {
        sections.email.classList.remove('hidden');
        pageTitle.textContent = "Change Email";
        brandLogo.classList.add('hidden');
        backBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;
    
    } else if (mode === 'otp') {
        sections.otp.classList.remove('hidden');
        pageTitle.textContent = "OTP Email";
        // Tampilkan email yang baru diketik sebagai target
        otpEmailTarget.textContent = newEmailInput.value || "unknown@mail.com";
        brandLogo.classList.add('hidden');
        backBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;

    } else {
        // Balik ke Main Menu
        sections.main.classList.remove('hidden');
        pageTitle.textContent = "Account";
        brandLogo.classList.remove('hidden');
        backBtn.innerHTML = "✕";
        currentMode = 'main';
    }
}

// Fungsi tombol Back di kiri atas
function handleBack() {
    if (currentMode === 'main') {
        // Jika di menu utama, Back berarti kembali ke Dashboard atau Profile
        // Terserah kamu mau arahkan kemana, biasanya ke Dashboard
        window.location.href = 'dashboard.html'; 
    } else if (currentMode === 'otp') {
        // Jika di OTP, balik ke input email
        goTo('email');
    } else {
        // Jika di Password/Email, balik ke Menu Utama
        goTo('main');
    }
}

// --- 3. ACTIONS (SAVE DATA) ---

async function savePassword() {
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;

    if (newPass && newPass === confirmPass) {
        try {
            const response = await fetch('http://localhost:8080/api/v1/premium/user/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Pastikan token login dikirim jika ada middleware auth di backend
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify({
                    new_password: newPass
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Password Updated in Database!");
                goTo('main');
            } else {
                alert("Failed: " + result.error);
            }
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Server connection error");
        }
    } else {
        alert("Passwords do not match!");
    }
}

async function saveEmail() {
    const email = newEmailInput.value;
    
    if(email) {
        try {
            const response = await fetch('http://localhost:8080/api/account/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    new_email: email
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Sesuai permintaan: Link dikirim ke email
                alert("Verification link has been sent to " + email + ". Please check your inbox!");
                loadAccountData(); 
                goTo('main');
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error updating email:", error);
            alert("Could not connect to server");
        }
    } else {
        alert("Please enter a valid email address");
    }
}

// Fitur auto-focus pindah kotak saat ketik OTP
function moveFocus(current, nextFieldID) {
    if (current.value.length >= 1) {
        document.getElementById(nextFieldID).focus();
    }
}