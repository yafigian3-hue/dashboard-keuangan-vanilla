/* ===== AUTH ===== */
const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = localStorage.getItem("currentUser");

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
  transactions =
    JSON.parse(localStorage.getItem(getStorageKey())) || [];
}

/* Save data */
function saveTransactions() {
  localStorage.setItem(
    getStorageKey(),
    JSON.stringify(transactions)
  );
}

/* Render UI */
function render() {
  list.innerHTML = "";
  let balance = 0;

  transactions.forEach((trx) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center p-2 border rounded";

    const sign = trx.type === "income" ? "+" : "-";
    const color =
      trx.type === "income" ? "text-green-600" : "text-red-600";

    balance +=
      trx.type === "income"
        ? trx.amount
        : -trx.amount;

    li.innerHTML = `
      <span>${trx.name}</span>
      <span class="${color}">
        ${sign} Rp ${trx.amount}
      </span>
    `;

    list.appendChild(li);
  });

  balanceEl.textContent = `Rp ${balance}`;
}

/* Login */
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username =
    document.getElementById("username").value.trim();

  if (!username) return;

  currentUser = username;
  localStorage.setItem("currentUser", currentUser);

  checkAuth();
});

/* Logout */
logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("currentUser");
  currentUser = null;
  checkAuth();
});

/* Submit transaksi */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const amount = Number(
    document.getElementById("amount").value
  );
  const type = document.getElementById("type").value;

  transactions.push({ name, amount, type });

  saveTransactions();
  form.reset();
  render();
});

/* Init */
checkAuth();
