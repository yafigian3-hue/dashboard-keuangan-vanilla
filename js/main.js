const elements = {
  // auth
  loginForm: document.getElementById("loginForm"),
  logoutBtn: document.getElementById("logoutBtn"),
  usernameInput: document.getElementById("username"),

  // dashboard
  balance: document.getElementById("balance"),
  totalIncome: document.getElementById("totalIncome"),
  totalExpense: document.getElementById("totalExpense"),
  financeChart: document.getElementById("financeChart"),
  monthFilter: document.getElementById("monthFilter"),
  dashboardTransactionList: document.getElementById("dashboardTransactionList"),
  expenseCategoryChart: document.getElementById("expenseCategoryChart"),

  // transaksi
  transactionForm: document.getElementById("transactionForm"),
  transactionList: document.getElementById("transactionList"),
  amountInput: document.getElementById("amount"),
  typeInput: document.getElementById("type"),
  categoryInput: document.getElementById("category"),
  categoryList: document.getElementById("categories"),

  // filter
  tabAll: document.getElementById("tabAll"),
  tabIncome: document.getElementById("tabIncome"),
  tabExpense: document.getElementById("tabExpense"),

  // sidebar
  sidebar: document.getElementById("sidebar"),
  toggleSidebar: document.getElementById("toggleSidebar"),
  overlay: document.getElementById("overlay"),
  themeToggleBtn: document.getElementById("themeToggle"),

  // search
  searchBtn: document.getElementById("searchBtn"),
  searchInput: document.getElementById("searchInput"),
};

if (elements.searchBtn && elements.searchInput) {
  elements.searchBtn.addEventListener("click", () => {
    elements.searchInput.classList.toggle("hidden");

    if (!elements.searchInput.classList.contains("hidden")) {
      elements.searchInput.focus();
    } else {
      elements.searchInput.value = "";
      renderTransactions();
    }
  });
}
