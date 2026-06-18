function calculateSummary() {
  const data = loadTransactions();
  let income = 0;
  let expense = 0;

  let filteredData = data;
  if (selectedMonth !== "all") {
    filteredData = data.filter((transaction) => {
      return (
        new Date(transaction.createdAt).getMonth() === Number(selectedMonth)
      );
    });
  }

  filteredData.forEach((transaction) => {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
}

function renderDashboard() {
  const { income, expense, balance } = calculateSummary();

  elements.balance.textContent = rupiah(balance);
  elements.totalIncome.textContent = rupiah(income);
  elements.totalExpense.textContent = rupiah(expense);

  renderChart();
  renderDashboardTransactions();
  renderExpenseChart();
}

if (elements.monthFilter) {
  elements.monthFilter.addEventListener("change", (e) => {
    selectedMonth = e.target.value;
    renderDashboard();
  });
}

let selectedMonth = "all";

function prepareChartData() {
  const data = loadTransactions();
  let filteredData = data;

  if (selectedMonth !== "all") {
    filteredData = data.filter((transaction) => {
      return (
        new Date(transaction.createdAt).getMonth() === Number(selectedMonth)
      );
    });
  }

  const incomeData = new Array(12).fill(0);
  const expenseData = new Array(12).fill(0);

  filteredData.forEach((transaction) => {
    const month = new Date(transaction.createdAt).getMonth();

    if (transaction.type === "income") {
      incomeData[month] += transaction.amount;
    } else {
      expenseData[month] += transaction.amount;
    }
  });

  return { incomeData, expenseData };
}

let financeChart;

let expenseCategoryChart;

function renderChart() {
  if (!elements.financeChart) return;

  const { incomeData, expenseData } = prepareChartData();

  if (financeChart) {
    financeChart.destroy();
  }

  const isDark = document.documentElement.classList.contains("dark");
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(16,185,129,0.07)";
  const tickColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(17,34,28,0.4)";
  const tooltipBg = isDark ? "#0b1812" : "#ffffff";
  const tooltipBorder = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(16,185,129,0.15)";
  const tooltipTitle = isDark ? "#f9fafb" : "#11221c";
  const tooltipBody = isDark ? "#9ca3af" : "#6b7280";

  financeChart = new Chart(elements.financeChart, {
    type: "bar",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
      datasets: [
        {
          label: "Pemasukan",
          data: incomeData,
          backgroundColor: isDark
            ? "rgba(16,185,129,0.7)"
            : "rgba(16,185,129,0.85)",
          hoverBackgroundColor: "#059669",
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: "Pengeluaran",
          data: expenseData,
          backgroundColor: isDark
            ? "rgba(244,63,94,0.65)"
            : "rgba(244,63,94,0.8)",
          hoverBackgroundColor: "#f43f5e",
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      },

      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tooltipBg,
          borderColor: tooltipBorder,
          borderWidth: 1,
          titleColor: tooltipTitle,
          bodyColor: tooltipBody,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => " " + ctx.dataset.label + ": " + rupiah(ctx.raw),
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: tickColor, font: { size: 11 }, maxRotation: 0 },
          border: { display: false },
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: { size: 11 },
            callback: (v) =>
              "Rp" + (v >= 1e6 ? (v / 1e6).toFixed(0) + "jt" : v),
          },
          border: { display: false },
        },
      },
      barPercentage: 0.7,
      categoryPercentage: 0.8,
    },
  });
}

if (elements.balance) {
  renderDashboard();
}

function renderDashboardTransactions() {
  if (!elements.dashboardTransactionList) return;

  elements.dashboardTransactionList.innerHTML = "";

  const data = loadTransactions();
  let filteredData = data;

  if (selectedMonth !== "all") {
    filteredData = data.filter((transaction) => {
      return (
        new Date(transaction.createdAt).getMonth() === Number(selectedMonth)
      );
    });
  }

  filteredData.sort((a, b) => b.createdAt - a.createdAt);

  if (filteredData.length === 0) {
    const empty = document.createElement("li");
    empty.className =
      "flex flex-col items-center justify-center gap-2 py-10 text-center";
    empty.innerHTML = `
      <span class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
          <rect x="2" y="5" width="20" height="14" rx="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      </span>
      <p class="text-sm font-semibold text-gray-400 dark:text-gray-500">Belum ada transaksi</p>
    `;
    elements.dashboardTransactionList.appendChild(empty);
    return;
  }

  filteredData.forEach((transaction) => {
    const isIncome = transaction.type === "income";

    const li = document.createElement("li");
    li.className =
      "fade-up group flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-sm border border-gray-100 dark:border-white/5 shadow-card hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300";
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
          <p class="font-bold text-gray-800 dark:text-white truncate">${transaction.name}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            ${isIncome ? "Pemasukan" : "Pengeluaran"}
          </p>
        </div>
      </div>

      <span class="flex-shrink-0 font-bold ${
        isIncome
          ? "text-brand-600 dark:text-brand-500"
          : "text-rose-600 dark:text-rose-400"
      }">
        ${isIncome ? "+" : "-"} ${rupiah(transaction.amount)}
      </span>
    `;
    elements.dashboardTransactionList.appendChild(li);
  });
}

function prepareExpenseCategoryData() {
  const data = loadTransactions();
  const categories = {};

  let filteredData = data.filter(
    (transaction) => transaction.type === "expense",
  );

  if (selectedMonth !== "all") {
    filteredData = filteredData.filter((transaction) => {
      return (
        new Date(transaction.createdAt).getMonth() === Number(selectedMonth)
      );
    });
  }

  filteredData.forEach((transaction) => {
    const categoryName = transaction.name;

    if (!categories[categoryName]) {
      categories[categoryName] = 0;
    }

    categories[categoryName] += transaction.amount;
  });

  return categories;
}

function renderExpenseChart() {
  if (!elements.expenseCategoryChart) return;

  const categories = prepareExpenseCategoryData();

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  const totalExpense = data.reduce((total, amount) => {
    return total + amount;
  }, 0);

  if (expenseCategoryChart) {
    expenseCategoryChart.destroy();
  }

  const chartColors = [
    "#f43f5e",
    "#fb6f84",
    "#fb923c",
    "#fbbf6b",
    "#fcd9a8",
    "#e11d48",
    "#fda4af",
  ];

  const isDark = document.documentElement.classList.contains("dark");

  const tooltipBg = isDark ? "#0b1812" : "#ffffff";
  const tooltipBorder = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(16,185,129,0.12)";
  const tooltipTitle = isDark ? "#f9fafb" : "#11221c";
  const tooltipBody = isDark ? "#9ca3af" : "#6b7280";
  const cardBg = isDark ? "#0b1812" : "#ffffff";

  const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart) {
      if (!chart.getDatasetMeta(0).data[0]) return;

      const { ctx } = chart;
      const centerX = chart.getDatasetMeta(0).data[0].x;
      const centerY = chart.getDatasetMeta(0).data[0].y;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = isDark ? "rgba(255,255,255,0.45)" : "rgba(17,34,28,0.4)";
      ctx.font = "600 10px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("TOTAL PENGELUARAN", centerX, centerY - 14);

      ctx.fillStyle = isDark ? "#f9fafb" : "#11221c";
      ctx.font = "700 16px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(rupiah(totalExpense), centerX, centerY + 8);
      ctx.restore();
    },
  };

  expenseCategoryChart = new Chart(elements.expenseCategoryChart, {
    type: "doughnut",

    plugins: [centerTextPlugin],

    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: chartColors,
          borderColor: cardBg,
          borderWidth: 3,
          hoverOffset: 6,
          hoverBorderColor: cardBg,
        },
      ],
    },
    options: {
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      },

      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",

      plugins: {
        legend: {
          position: "bottom",

          labels: {
            color: tooltipBody,
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 7,
            boxHeight: 7,
            padding: 14,
            font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
          },
        },

        tooltip: {
          backgroundColor: tooltipBg,
          borderColor: tooltipBorder,
          borderWidth: 1,
          titleColor: tooltipTitle,
          bodyColor: tooltipBody,
          padding: 10,
          cornerRadius: 8,

          callbacks: {
            label: (ctx) => {
              return " " + ctx.label + ": " + rupiah(ctx.raw);
            },
          },
        },
      },
    },
  });
}
 