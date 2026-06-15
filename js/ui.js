let activeFilter = "all";

function renderTransactionItem(transaction) {
  const tanggal = new Date(transaction.createdAt).toLocaleDateString("id-ID");
  const jam = new Date(transaction.createdAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const li = document.createElement("li");

  li.className =
    "flex justify-between items-center gap-4 p-4 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl";

  li.innerHTML = `
  <div>
    <p class="font-semibold text-gray-800 dark:text-white">
      ${transaction.name}
    </p>

    <p class="${
      transaction.type === "income"
        ? "text-green-600 dark:text-green-400"
        : "text-red-600 dark:text-red-400"
    }">
      ${transaction.type === "income" ? "+" : "-"}
      ${rupiah(transaction.amount)}
    </p>
  </div>

  <div class="flex flex-col items-end gap-2">
    <button
      onclick="deleteTransaction(${transaction.id})"
      class="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
    >
      Hapus
    </button>

    <p class="text-xs text-gray-500 dark:text-gray-400">
      ${tanggal} • ${jam}
    </p>
  </div>
`;

  elements.transactionList.appendChild(li);
}

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
      <li class="text-center text-gray-500 dark:text-gray-400 py-8">
        Tidak ada transaksi
      </li>
    `;
  } else {
    filtered.forEach((transaction) => {
      renderTransactionItem(transaction);
    });
  }
}

function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop();

  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.classList.remove(
      "bg-blue-50",
      "text-blue-600",
      "dark:bg-blue-900/30",
      "dark:text-blue-400",
    );

    link.classList.add("text-gray-600", "dark:text-gray-300");

    if (link.getAttribute("href") === currentPage) {
      link.classList.remove(
        "text-gray-600",
        "dark:text-gray-300",
        "hover:bg-gray-100",
        "dark:hover:bg-gray-800",
      );

      link.classList.add(
        "bg-blue-50",
        "dark:bg-blue-900/30",
        "text-blue-600",
        "dark:text-blue-400",
      );
    }
  });
}

setActiveNav();

if (elements.toggleSidebar && elements.sidebar && elements.overlay) {
  elements.toggleSidebar.addEventListener("click", () => {
    elements.sidebar.classList.toggle("-translate-x-full");
    elements.overlay.classList.toggle("hidden");
  });

  elements.overlay.addEventListener("click", () => {
    elements.sidebar.classList.add("-translate-x-full");
    elements.overlay.classList.add("hidden");
  });
}

const categories = {
  income: ["Gaji", "Bonus", "Freelance", "Hadiah"],

  expense: ["Makan", "Internet", "Transportasi", "Belanja", "Hiburan"],
};

function renderCategories() {
  if (!elements.categoryList) return;

  const type = elements.typeInput.value;

  elements.categoryList.innerHTML = "";

  categories[type].forEach((category) => {
    const option = document.createElement("option");

    option.value = category;

    elements.categoryList.appendChild(option);
  });
}

if (elements.categoryInput) {
  renderCategories();
}

if (elements.typeInput) {
  elements.typeInput.addEventListener("change", renderCategories);
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
      "dark:shadow-blue-900",
    );

    button.classList.add(
      "bg-gray-100",
      "dark:bg-gray-700",
      "text-gray-700",
      "dark:text-gray-300",
      "hover:bg-gray-200",
      "dark:hover:bg-gray-600",
    );
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
    "dark:bg-gray-700",
    "text-gray-700",
    "dark:text-gray-300",
    "hover:bg-gray-200",
    "dark:hover:bg-gray-600",
  );

  activeButton.classList.add(
    "bg-blue-600",
    "text-white",
    "shadow-md",
    "shadow-blue-200",
    "dark:shadow-blue-900",
  );
}

if (elements.tabAll) {
  elements.tabAll.addEventListener("click", () => {
    activeFilter = "all";
    renderTransactions();
    updateFilterButtons();
  });
}

if (elements.tabIncome) {
  elements.tabIncome.addEventListener("click", () => {
    activeFilter = "income";
    renderTransactions();
    updateFilterButtons();
  });
}

if (elements.tabExpense) {
  elements.tabExpense.addEventListener("click", () => {
    activeFilter = "expense";
    renderTransactions();
    updateFilterButtons();
  });
}

if (elements.searchInput) {
  elements.searchInput.addEventListener("input", () => {
    renderTransactions();
  });
}

const saveTheme = localStorage.getItem("theme");

if (saveTheme === "dark") {
  document.documentElement.classList.add("dark");
}

if (typeof renderDashboard === "function") {
  renderDashboard();
}

if (elements.themeToggleBtn) {
  elements.themeToggleBtn.addEventListener("click", () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    renderChart();
  });
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
