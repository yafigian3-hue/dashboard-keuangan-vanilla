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

/* Utils */
function getStorageKey() {
  return `transactions_${currentUser}`;
}

/* Auth UI */
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

/* Load data per user */
function loadTransactions() {
  transactions = JSON.parse(localStorage.getItem(getStorageKey())) || [];
}

/* Save data */
function saveTransactions() {
  localStorage.setItem(getStorageKey(), JSON.stringify(transactions));
}

/*hapus Transaksi*/
function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveTransactions();
  render();
}

/* Edit transaksi */
function editTransaction(index) {
  const trx = transactions[index];

  document.getElementById("name").value = trx.name;
  document.getElementById("amount").value = trx.amount;
  document.getElementById("type").value = trx.type;

  editIndex = index;
}

/* filter */
let currentFilter = "all";

function setFilter(type) {
  currentFilter = type;
  render();
}

/*format rupiah */
function formatRupiah(Number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number);
}

let sortOrder = "desc"; // desc = terbaru

function setSort(order) {
  sortOrder = order;
  render();
}

/* Render UI */
function render() {
  list.innerHTML = "";

  if (transactions.length === 0) {
    list.innerHTML = `
      <li class="text-center text-gray-500 py-4">
        Belum ada transaksi
      </li>
    `;
    balanceEl.textContent = formatRupiah(0);
    return;
  }

  let balance = 0;
  let totalIncome = 0;
  let totalExpense = 0;

  const filteredTransactions =
    currentFilter === "all"
      ? transactions
      : transactions.filter((trx) => trx.type === currentFilter);

  const sortedTransactions = [...filteredTransactions].sort((a, b) =>
    sortOrder === "desc"
      ? b.createdAt - a.createdAt
      : a.createdAt - b.createdAt,
  );

  sortedTransactions.forEach((trx) => {
    const realIndex = transactions.indexOf(trx);

    const li = document.createElement("li");
    li.className = "flex justify-between items-center p-2 border rounded";

    const sign = trx.type === "income" ? "+" : "-";
    const color = trx.type === "income" ? "text-green-600" : "text-red-600";

    if (trx.type === "income") {
      balance += trx.amount;
      totalIncome += trx.amount;
    } else {
      balance -= trx.amount;
      totalExpense += trx.amount;
    }

    li.innerHTML = `
      <div>
        <p class="font-semibold">${trx.name}</p>
        <p class="${color}">
          ${sign} ${formatRupiah(trx.amount)}
        </p>
      </div>
      <div class="space-x-2">
        <button onclick="editTransaction(${realIndex})" class="text-blue-600">Edit</button>
        <button onclick="deleteTransaction(${realIndex})" class="text-red-600">Hapus</button>
      </div>
    `;

    list.appendChild(li);
  });

  balanceEl.textContent = formatRupiah(balance);
  document.getElementById("totalIncome").textContent =
    formatRupiah(totalIncome);
  document.getElementById("totalExpense").textContent =
    formatRupiah(totalExpense);
}

/* Login */
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();

  if (!username) return;

  currentUser = username;
  localStorage.setItem("currentUser", currentUser);

  checkAuth();
});

/* Logout */
logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("currentUser");
  currentUser = null;
  editIndex = null;
  checkAuth();
});

/* Submit transaksi */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (editIndex !== null) {
    transactions[editIndex] = {
      ...transactions[editIndex],
      name,
      amount,
      type,
    };
    editIndex = null;
  } else {
    transactions.push({
      name,
      amount,
      type,
      createdAt: Date.now(),
    });

    if (!name || amount <= 0) return;
  }

  saveTransactions();
  form.reset();
  render();
});

function updateFilterUI() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("bg-blue-600", "text-white");
  });

  const activeBtn = [...document.querySelectorAll(".filter-btn")].find((btn) =>
    btn.textContent.toLowerCase().includes(currentFilter),
  );

  if (activeBtn) {
    activeBtn.classList.add("bg-blue-600", "text-white");
  }
}

/* Init */
checkAuth();

updateFilterUI();
