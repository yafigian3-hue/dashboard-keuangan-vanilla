/*************************
 * AUTH (LOGIN / LOGOUT)
 *************************/
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    if (!username) return;
    localStorage.setItem("currentUser", username);
    window.location.href = "dashboard.html";
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}

/*************************
 * USER & STORAGE
 *************************/
const currentUser = localStorage.getItem("currentUser");
const currentPage = window.location.pathname.split("/").pop();

if (
  ["dashboard.html", "transaksi.html"].includes(currentPage) &&
  !currentUser
) {
  window.location.href = "index.html";
}

function storageKey() {
  return "transactions";
}

function loadTransactions() {
  return JSON.parse(localStorage.getItem(storageKey())) || [];
}

function saveTransactions(data) {
  localStorage.setItem(storageKey(), JSON.stringify(data));
}

/*************************
 * FORMAT
 *************************/
function rupiah(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}

/*************************
 * SIDEBAR ACTIVE STATE
 *************************/
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  const href = link.getAttribute("href");

  // reset
  link.classList.remove("bg-blue-100", "font-semibold");

  if (href === currentPage) {
    link.classList.add("bg-blue-100", "font-semibold");
  } else {
    link.classList.add("hover:bg-gray-100");
  }
});

/*************************
 * SIDEBAR TOGGLE (MOBILE)
 *************************/
const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

if (toggleBtn && sidebar) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });
}

/*************************
 * DASHBOARD
 *************************/
function renderDashboard() {
  const data = loadTransactions();
  let income = 0;
  let expense = 0;

  data.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  const balanceEl = document.getElementById("balance");
  const incomeEl = document.getElementById("totalIncome");
  const expenseEl = document.getElementById("totalExpense");

  if (balanceEl) balanceEl.textContent = rupiah(income - expense);
  if (incomeEl) incomeEl.textContent = rupiah(income);
  if (expenseEl) expenseEl.textContent = rupiah(expense);

  renderChart();
}

/*************************
 * CHART
 *************************/
let financeChart;

function renderChart() {
  const canvas = document.getElementById("financeChart");
  if (!canvas) return;

  const data = loadTransactions();

  let income = 0;
  let expense = 0;

  data.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  if (financeChart) financeChart.destroy();

  financeChart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Pemasukan", "Pengeluaran"],
      datasets: [
        {
          data: [income, expense],
          backgroundColor: ["#16a34a", "#dc2626"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

/*************************
 * TRANSAKSI
 *************************/
const form = document.getElementById("transactionForm");
const list = document.getElementById("transactionList");

let activeFilter = "all"; // all | income | expense

function renderTransactions() {
  if (!list) return;

  const data = loadTransactions();
  list.innerHTML = "";

  const filtered = data.filter((t) =>
    activeFilter === "all" ? true : t.type === activeFilter,
  );

  if (filtered.length === 0) {
    list.innerHTML = `<li class="text-gray-500">Tidak ada transaksi</li>`;
    return;
  }

  filtered.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center p-3 border rounded";

    li.innerHTML = `
      <div>
        <p class="font-semibold">${t.name}</p>
        <p class="${t.type === "income" ? "text-green-600" : "text-red-600"}">
          ${t.type === "income" ? "+" : "-"} ${rupiah(t.amount)}
        </p>
      </div>
      <button onclick="deleteTransaction(${index})"
        class="text-sm text-red-600">Hapus</button>
    `;
    list.appendChild(li);
  });
}

function deleteTransaction(index) {
  const data = loadTransactions();
  data.splice(index, 1);
  saveTransactions(data);
  renderDashboard();
  renderTransactions();
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (!name || amount <= 0) return;

    const data = loadTransactions();
    data.push({ name, amount, type, createdAt: Date.now() });
    saveTransactions(data);

    form.reset();
    renderDashboard();
    renderTransactions();
  });
}

/*************************
 * TAB FILTER
 *************************/
["All", "Income", "Expense"].forEach((type) => {
  const btn = document.getElementById(`tab${type}`);
  if (!btn) return;

  btn.addEventListener("click", () => {
    activeFilter = type.toLowerCase();
    renderTransactions();
  });
});

/*************************
 * INIT
 *************************/
renderDashboard();
renderTransactions();
