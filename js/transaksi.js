let activeFilter = "all";

function renderTransactions() {
  if (!elements.transactionList) return;

  const data = loadTransactions();

  data.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  const keyword = elements.searchInput
    ? elements.searchInput.value.toLowerCase()
    : "";

  const filtered = data.filter((transaction) => {
    const matchFilter =
      activeFilter === "all" ? true : transaction.type === activeFilter;

    const matchSearch = transaction.name.toLowerCase().includes(keyword);

    return matchFilter && matchSearch;
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
  const tanggal = new Date(transaction.createdAt).toLocaleDateString("id-ID");
  const jam = new Date(transaction.createdAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const li = document.createElement("li");

  li.className =
    "flex justify-between items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl";

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

 <div class="flex flex-col items-end gap-2">
  <button
    onclick="deleteTransaction(${transaction.id})"
    class="text-red-500 hover:text-red-700 text-sm"
  >
    Hapus
  </button>

  <p class="text-xs text-gray-500">
    ${tanggal} • ${jam}
  </p>
</div>
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

if (elements.transactionForm) {
  elements.transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    addTransactions();
  });
}

if (elements.transactionList) {
  renderTransactions();
}
