

function deleteTransaction(id) {
  const data = loadTransactions();

  const filtered = data.filter((transaction) => {
    return transaction.id !== id;
  });

  saveTransactions(filtered);

  renderTransactions();

  if (elements.balance) {
    renderDashboard();
  }
}

function addTransactions() {
  const name = elements.categoryInput.value.trim();

  const amount = Number(elements.amountInput.value);

  const type = elements.typeInput.value;

  if (!name || amount <= 0) return;

  const data = loadTransactions();

  data.push({
    id: Date.now(),
    name,
    amount,
    type,
    createdAt: Date.now(),
  });

  saveTransactions(data);

  elements.transactionForm.reset();

  if (elements.categoryInput) {
    renderCategories();
  }

  renderTransactions();

  if (elements.balance) {
    renderDashboard();
  }
}


