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
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const tickColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";
  const tooltipBg = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const tooltipTitle = isDark ? "#f9fafb" : "#111827";
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
            ? "rgba(34,197,94,0.7)"
            : "rgba(34,197,94,0.85)",
          hoverBackgroundColor: "#22c55e",
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: "Pengeluaran",
          data: expenseData,
          backgroundColor: isDark
            ? "rgba(248,113,113,0.7)"
            : "rgba(248,113,113,0.85)",
          hoverBackgroundColor: "#f87171",
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

  filteredData.forEach((transaction) => {
    const li = document.createElement("li");
    li.className =
      "flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40";
    li.innerHTML = `
      <div>
        <p class="font-medium text-gray-800 dark:text-white">${transaction.name}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          ${transaction.type === "income" ? "Pemasukan" : "Pengeluaran"}
        </p>
      </div>
      <span class="${transaction.type === "income" ? "text-green-500" : "text-red-500"} font-semibold">
        ${transaction.type === "income" ? "+" : "-"} ${rupiah(transaction.amount)}
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

  // Satu keluarga warna (gradasi merah → krem), bukan campuran warna acak
  const chartColors = [
    "#e94f4f",
    "#f0795a",
    "#f5a36a",
    "#f7c285",
    "#fadcae",
    "#e07a7a",
    "#f2b8a3",
  ];

  const isDark = document.documentElement.classList.contains("dark");

  const tooltipBg = isDark ? "#111827" : "#ffffff";
  const tooltipBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const tooltipTitle = isDark ? "#f9fafb" : "#111827";
  const tooltipBody = isDark ? "#9ca3af" : "#6b7280";
  const cardBg = isDark ? "#1f2937" : "#ffffff";

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

      ctx.fillStyle = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";
      ctx.font = "500 10px Inter, sans-serif";
      ctx.fillText("TOTAL PENGELUARAN", centerX, centerY - 14);

      ctx.fillStyle = isDark ? "#f9fafb" : "#111827";
      ctx.font = "700 16px Inter, sans-serif";
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
            font: { size: 11 },
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
