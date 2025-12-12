console.log("PACKAGE.JS LOADED");

// Ambil semua link paket
const packageLinks = document.querySelectorAll("a[data-plan]");

packageLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // cegah pindah halaman default

    // Ambil data dari atribut HTML
    const planName = link.dataset.plan;
    const planPrice = link.dataset.price;

    // Simpan ke localStorage
    localStorage.setItem("selectedPlanName", planName);
    localStorage.setItem("selectedPlanPrice", planPrice);

    console.log("SIMPAN:", planName, planPrice);

    // Pindah langsung ke confirm-payment.html
    window.location.href = "confirm-payment.html";
  });
});