function storageKey() {
  return "transactions";
}

function loadTransactions() {
  return JSON.parse(localStorage.getItem(storageKey())) || [];
}

function saveTransactions(data) {
  localStorage.setItem(storageKey(), JSON.stringify(data));
}