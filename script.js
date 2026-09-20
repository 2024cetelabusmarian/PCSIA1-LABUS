// DOM Element References
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const residentArea = document.getElementById("residentArea");
const adminArea = document.getElementById("adminArea");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const logoutResident = document.getElementById("logoutResident");
const logoutAdmin = document.getElementById("logoutAdmin");

let statsChartInstance = null;

// Toggle between Login & Register forms
showRegister.addEventListener("click", () => {
  loginSection.classList.remove("active");
  registerSection.classList.add("active");
});

showLogin.addEventListener("click", () => {
  registerSection.classList.remove("active");
  loginSection.classList.add("active");
});

// Login Form Handling
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const role = document.getElementById("loginRole").value;
  loginSection.classList.remove("active");

  if (role === "resident") {
    residentArea.classList.add("active");
  } else {
    adminArea.classList.add("active");
    renderChart();
  }
});

// Register Form Handling
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Registration successful! Please login.");
  registerSection.classList.remove("active");
  loginSection.classList.add("active");
});

// Logout Handlers
logoutResident.addEventListener("click", () => {
  residentArea.classList.remove("active");
  loginSection.classList.add("active");
});

logoutAdmin.addEventListener("click", () => {
  adminArea.classList.remove("active");
  loginSection.classList.add("active");
});

// Render Admin Statistics Chart
function renderChart() {
  const ctx = document.getElementById("statsChart").getContext("2d");

  if (statsChartInstance) {
    statsChartInstance.destroy();
  }

  statsChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Daily", "Weekly", "Monthly"],
      datasets: [{
        label: "Collection Volume (kg)",
        data: [120, 850, 3400],
        backgroundColor: ["#66bb6a", "#43a047", "#2e7d32"]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}