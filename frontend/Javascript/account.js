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

function loadAccountData() {
    // Generate tanggal membership (dummy: setahun dari sekarang)
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    validDateEl.textContent = nextYear.toLocaleDateString('en-US', options);

    // Load Email
    const savedEmail = localStorage.getItem('userEmail') || "brrpatapim@gmail.com";
    currentEmailDisplay.textContent = savedEmail;
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

function savePassword() {
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;

    if (newPass && newPass === confirmPass) {
        localStorage.setItem('userPassword', newPass); // Simpan dummy
        alert("Password Changed Successfully!");
        goTo('main');
    } else {
        alert("Passwords do not match or empty!");
    }
}

function saveEmail() {
    // Anggap OTP validasi sukses
    const email = newEmailInput.value;
    if(email) {
        localStorage.setItem('userEmail', email);
        alert("Email Changed Successfully!");
        loadAccountData(); // Update tampilan email
        goTo('main');
    } else {
        alert("Email Invalid");
    }
}

// Fitur auto-focus pindah kotak saat ketik OTP
function moveFocus(current, nextFieldID) {
    if (current.value.length >= 1) {
        document.getElementById(nextFieldID).focus();
    }
}