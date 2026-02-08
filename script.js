/* ===== AUTH ===== */
const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = localStorage.getItem("currentUser");
let editIndex = null;

/* ===== DASHBOARD ===== */
const form = document.getElementById("transactionForm");
const list = document.getElementById("transactionList");
const balanceEl = document.getElementById("balance");

let transactions = [];
let currentFilter = "all";

/* Utils */
function getStorageKey() {
  return `transactions_${currentUser}`;
}

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

/* Auth */
function checkAuth() {
  if (currentUser) {
    loginPage.classList.add("hidden");
    dashboardPage.classList.remove("hidden");
    loadTransactions();
    render();
  } else {
    loginPage.classList.remove("hidden");
    dashboardPage.classList.add("hidden");
  }
}

/* Storage */
function loadTransactions() {
  transactions = JSON.parse(localStorage.getItem(getStorageKey())) || [];
}

function saveTransactions() {
  localStorage.setItem(getStorageKey(), JSON.stringify(transactions));
}

/* Filter */
function setFilter(type) {
  currentFilter = type;
  render();
}

/* Render */
function render() {
  list.innerHTML = "";

  let balance = 0;
  let income = 0;
  let expense = 0;

  const filtered =
    currentFilter === "all"
      ? transactions
      : transactions.filter(t => t.type === currentFilter);

  if (filtered.length === 0) {
    list.innerHTML = `<li class="text-center text-gray-500">Belum ada transaksi</li>`;
  }

  filtered.forEach((t, i) => {
    if (t.type === "income") {
      balance += t.amount;
      income += t.amount;
    } else {
      balance -= t.amount;
      expense += t.amount;
    }

    const li = document.createElement("li");
    li.className = "flex justify-between items-center border p-2 rounded";

    li.innerHTML = `
      <div>
        <p class="font-semibold">${t.name}</p>
        <p class="${t.type === "income" ? "text-green-600" : "text-red-600"}">
          ${formatRupiah(t.amount)}
        </p>
      </div>
      <button onclick="deleteTransaction(${i})" class="text-red-600">
        Hapus
      </button>
    `;

    list.appendChild(li);
  });

  balanceEl.textContent = formatRupiah(balance);
  totalIncome.textContent = formatRupiah(income);
  totalExpense.textContent = formatRupiah(expense);
}

/* CRUD */
function deleteTransaction(i) {
  transactions.splice(i, 1);
  saveTransactions();
  render();
}

/* Submit */
form.addEventListener("submit", e => {
  e.preventDefault();

  transactions.push({
    name: name.value,
    amount: Number(amount.value),
    type: type.value,
    createdAt: Date.now(),
  });

  saveTransactions();
  form.reset();
  render();
});

/* Login */
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  currentUser = username.value.trim();
  localStorage.setItem("currentUser", currentUser);
  checkAuth();
});

/* Logout */
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  currentUser = null;
  checkAuth();
});

/* Init */
checkAuth();
