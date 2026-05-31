let activeFilter = "all";

function renderTransactions() {
  if (!elements.transactionList) return;

  const data = loadTransactions();

  const filtered = data.filter((transaction) => {
    if (activeFilter === "all") {
      return true;
    }

    return transaction.type === activeFilter;
  });

  elements.transactionList.innerHTML = "";

  if (filtered.length === 0) {
    elements.transactionList.innerHTML = `
      <li class="text-center text-gray-500 py-8">
        Tidak ada transaksi
      </li>
    `;
  } else {
    filtered.forEach((transaction) => {
      renderTransactionItem(transaction);
    });
  }

  updateFilterButtons();
}

function renderTransactionItem(transaction) {
  const li = document.createElement("li");

  li.className =
    "flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl";

  li.innerHTML = `
    <div>
      <p class="font-semibold text-gray-800">
        ${transaction.name}
      </p>

      <p class="${
        transaction.type === "income" ? "text-green-600" : "text-red-600"
      }">
        ${transaction.type === "income" ? "+" : "-"}
        ${rupiah(transaction.amount)}
      </p>
    </div>

    <button
      onclick="deleteTransaction(${transaction.id})"
      class="text-red-500 hover:text-red-700 text-sm"
    >
      Hapus
    </button>
  `;

  elements.transactionList.appendChild(li);
}

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
  const name = elements.nameInput.value;
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

  renderTransactions();

  if (elements.balance) {
    renderDashboard();
  }
}

if (elements.transactionForm) {
  elements.transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    addTransactions();
  });
}

if (elements.transactionList) {
  renderTransactions();
}

if (
  elements.transactionList &&
  elements.tabAll &&
  elements.tabIncome &&
  elements.tabExpense
) {
  renderTransactions();
}

function updateFilterButtons() {
  const buttons = [elements.tabAll, elements.tabIncome, elements.tabExpense];

  buttons.forEach((button) => {
    if (!button) return;

    button.classList.remove(
      "bg-blue-600",
      "text-white",
      "shadow-md",
      "shadow-blue-200",
    );

    button.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
  });

  let activeButton;

  if (activeFilter === "all") {
    activeButton = elements.tabAll;
  } else if (activeFilter === "income") {
    activeButton = elements.tabIncome;
  } else {
    activeButton = elements.tabExpense;
  }

  if (!activeButton) return;

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

if (elements.tabAll) {
  elements.tabAll.addEventListener("click", () => {
    activeFilter = "all";

    renderTransactions();
  });
}

if (elements.tabIncome) {
  elements.tabIncome.addEventListener("click", () => {
    activeFilter = "income";

    renderTransactions();
  });
}

if (elements.tabExpense) {
  elements.tabExpense.addEventListener("click", () => {
    activeFilter = "expense";

    renderTransactions();
  });
}
