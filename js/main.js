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

  // transaksi
  transactionForm: document.getElementById("transactionForm"),
  transactionList: document.getElementById("transactionList"),
  nameInput: document.getElementById("name"),
  amountInput: document.getElementById("amount"),
  typeInput: document.getElementById("type"),

  // filter
  tabAll: document.getElementById("tabAll"),
  tabIncome: document.getElementById("tabIncome"),
  tabExpense: document.getElementById("tabExpense"),

  // sidebar
  sidebar: document.getElementById("sidebar"),
  toggleSidebar: document.getElementById("toggleSidebar"),
  overlay: document.getElementById("overlay")
};

console.log(elements.tabAll);
console.log(elements.tabIncome);
console.log(elements.tabExpense);
