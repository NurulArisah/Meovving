// Ambil data dari localStorage
const planName = localStorage.getItem("selectedPlanName");
const planPrice = localStorage.getItem("selectedPlanPrice");
const paymentMethod = localStorage.getItem("selectedPayment");

// Tampilkan di halaman
document.getElementById("planName").textContent = planName;
document.getElementById("planPrice").textContent = planPrice;
document.getElementById("paymentMethod").textContent = paymentMethod;

// Opsional: Ganti warna text sesuai metode
const paymentIcon = document.getElementById("paymentIcon");
switch (paymentMethod) {
  case "DANA":
    paymentIcon.src = "../assets/icons/dana.svg";
    document.getElementById("paymentMethod").style.color = "#00AEEF";
    break;
  case "GoPay":
    paymentIcon.src = "../assets/icons/gopay.svg";
    document.getElementById("paymentMethod").style.color = "#00B4A8";
    break;
  case "OVO":
    paymentIcon.src = "../assets/icons/ovo.svg";
    document.getElementById("paymentMethod").style.color = "#8F5DE8";
    break;
  case "ShopeePay":
    paymentIcon.src = "../assets/icons/shopeepay.svg";
    document.getElementById("paymentMethod").style.color = "#EE4D2D";
    break;
}
