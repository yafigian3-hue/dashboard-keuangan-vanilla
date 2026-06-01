function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop();

  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.classList.remove("bg-blue-50", "text-blue-600",);

    link.classList.add("text-gray-600");

    if (link.getAttribute("href") === currentPage) {
      link.classList.remove("text-gray-600", "hover:bg-gray-100");

      link.classList.add("bg-blue-50", "text-blue-600");
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

if (elements.searchInput) {
  elements.searchInput.addEventListener("input", () => {
    renderTransactions();
  });
}
