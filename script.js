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

/* Render UI */
function render() {
  list.innerHTML = "";
  let balance = 0;

  transactions.forEach((trx, index) => {
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
      <div>
      <p class="font-semibold">${trx.name}</p>
      <p class="${color}">${sign} Rp ${trx.amount}</p>
      </div>

      <div class="space-x-2">
      <button onclick="editTransaction(${index})" class="text-blue-600">
      Edit
      </button>

      <button onclick="deleteTransaction(${index})" class="text-red-600">
      Hapus
      </button>
      </div>
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

  if (editIndex !== null) {
    transactions[editIndex] = {name, amount, type};
    editIndex = null;
  } else {
    transactions.push({ name, amount, type });
  }

  saveTransactions();
  form.reset();
  render();
});

/* Init */
checkAuth();
