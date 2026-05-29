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
function calculateSummary() {
  const data = loadTransactions();

  let income = 0;
  let expense = 0;

  data.forEach((transaction) => {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
}

function renderDashboard() {
  const { income, expense, balance } = calculateSummary();

  const balanceEl = document.getElementById("balance");
  const incomeEl = document.getElementById("totalIncome");
  const expenseEl = document.getElementById("totalExpense");

  if (balanceEl) balanceEl.textContent = rupiah(balance);
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

  const { income, expense } = calculateSummary();

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
const transactionForm = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");

const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

let activeFilter = "all"; // all | income | expense

function renderTransactions() {
  if (!transactionList) return;

  const data = loadTransactions();
  transactionList.innerHTML = "";

  const filtered = data.filter((t) =>
    activeFilter === "all" ? true : t.type === activeFilter,
  );

  if (filtered.length === 0) {
    transactionList.innerHTML = `<li class="text-gray-500">Tidak ada transaksi</li>`;
    return;
  }

  filtered.forEach((transaction) => {
    const li = document.createElement("li");

    li.className =
      "flex justify-between items-center p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300";

    li.innerHTML = `
      <div>
        <p class="font-semibold text-gray-800">${transaction.name}</p>

        <p class="${
          transaction.type === "income" ? "text-green-600" : "text-red-600"
        } font-medium">
          ${transaction.type === "income" ? "+" : "-"}
          ${rupiah(transaction.amount)}
        </p>
      </div>

      <button
        onclick="deleteTransaction(${transaction.id})"
        class="text-sm px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
      >
        Hapus
      </button>
    `;

    transactionList.appendChild(li);
  });
}

function deleteTransaction(id) {
  const data = loadTransactions();

  const filteredData = data.filter((transaction) => {
    return transaction.id !== id;
  });

  saveTransactions(filteredData);

  renderDashboard();
  renderTransactions();
}

if (transactionForm) {
  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (!name || amount <= 0) return;

    const data = loadTransactions();
    data.push({ id: Date.now(), name, amount, type, createdAt: Date.now() });
    saveTransactions(data);

    transactionForm.reset();
    renderDashboard();
    renderTransactions();
  });
}

/*************************
 * FILTER ACTIVE STATE
 *************************/
function updateActiveTab() {
  const tabs = [
    document.getElementById("tabAll"),
    document.getElementById("tabIncome"),
    document.getElementById("tabExpense"),
  ];

  tabs.forEach((tab) => {
    tab.classList.remove(
      "bg-blue-600",
      "text-white",
      "shadow-md",
      "shadow-blue-200",
    );

    tab.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
  });

  let activeButton;

  if (activeFilter === "all") {
    activeButton = document.getElementById("tabAll");
  }

  if (activeFilter === "income") {
    activeButton = document.getElementById("tabIncome");
  }

  if (activeFilter === "expense") {
    activeButton = document.getElementById("tabExpense");
  }

  activeButton.classList.remove(
    "bg-gray-100",
    "text-gray-700",
    "hover:bg-gray-200",
  );

  activeButton.classList.add(
    "bg-blue-600",
    "text-white",
    "shadow-md",
    "shadow-blue-200",
  );
}

/*************************
 * TAB FILTER
 *************************/
["All", "Income", "Expense"].forEach((type) => {
  const btn = document.getElementById(`tab${type}`);
  if (!btn) return;

  btn.addEventListener("click", () => {
    activeFilter = type.toLowerCase();
    updateActiveTab();
    renderTransactions();
  });
});

/*************************
 * INIT
 *************************/
renderDashboard();
renderTransactions();
updateActiveTab();
