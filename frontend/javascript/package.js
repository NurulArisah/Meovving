
console.log("PACKAGE.JS LOADED");

// Ambil semua link paket
const packageLinks = document.querySelectorAll("a[data-plan]");
console.log("Jumlah link terbaca:", packageLinks.length);

packageLinks.forEach(link => {
  link.addEventListener("click", (e) => {
   e.preventDefault(); // cegah pindah halaman dulu

    // Ambil data dari atribut
    const planName = link.dataset.plan;
    const planPrice = link.dataset.price;

    // Simpan ke localStorage
    localStorage.setItem("selectedPlanName", planName);
    localStorage.setItem("selectedPlanPrice", planPrice);

    console.log("SIMPAN:", planName, planPrice);

    // Pindah ke halaman payment method
//    const target = "payment-method.html";
//    console.log("redirecting to:", target);
//    window.location.href = target;
    window.location.href = link.href;
  });
});
