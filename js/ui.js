let activeFilter = "all";

function renderTransactionItem(transaction) {
  const tanggal = new Date(transaction.createdAt).toLocaleDateString("id-ID");
  const jam = new Date(transaction.createdAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isIncome = transaction.type === "income";

  const li = document.createElement("li");

  li.className =
    "fade-up group flex justify-between items-center gap-4 p-4 bg-white/90 dark:bg-ink-900/90 backdrop-blur-sm border border-gray-100 dark:border-white/5 rounded-2xl shadow-soft hover:-translate-y-0.5 hover:shadow-card transition-all duration-300";

  li.innerHTML = `
  <div class="flex items-center gap-3 min-w-0">
    <span
      class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
        isIncome
          ? "bg-brand-100 dark:bg-brand-500/10 text-brand-600 dark:text-brand-500"
          : "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
      }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
        ${
          isIncome
            ? '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>'
            : '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>'
        }
      </svg>
    </span>

    <div class="min-w-0">
      <p class="font-bold text-gray-800 dark:text-white truncate">
        ${transaction.name}
      </p>

      <p class="text-sm font-semibold ${
        isIncome
          ? "text-brand-600 dark:text-brand-500"
          : "text-rose-600 dark:text-rose-400"
      }">
        ${isIncome ? "+" : "-"} ${rupiah(transaction.amount)}
      </p>
    </div>
  </div>

  <div class="flex flex-col items-end gap-2 flex-shrink-0">
    <button
      onclick="deleteTransaction(${transaction.id})"
      class="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
      Hapus
    </button>

    <p class="text-[11px] font-medium text-gray-400 dark:text-gray-500">
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
      <li class="flex flex-col items-center justify-center gap-3 text-center py-12">
        <span class="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </span>
        <p class="font-semibold text-gray-500 dark:text-gray-400">
          Tidak ada transaksi
        </p>
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
    link.classList.remove("active");

    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
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

    button.classList.remove("bg-brand-600", "text-white", "shadow-soft");

    button.classList.add(
      "text-gray-600",
      "dark:text-gray-300",
      "hover:bg-white",
      "dark:hover:bg-white/10",
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
    "text-gray-600",
    "dark:text-gray-300",
    "hover:bg-white",
    "dark:hover:bg-white/10",
  );

  activeButton.classList.add("bg-brand-600", "text-white", "shadow-soft");
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

    if (elements.financeChart) {
      renderChart();
    }

    if (elements.expenseCategoryChart) {
      renderExpenseChart();
    }
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
