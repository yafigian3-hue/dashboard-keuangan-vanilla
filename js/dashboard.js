function calculateSummary() {
  const data = loadTransactions();

  let income = 0;
  let expense = 0;

  data.forEach((transaction) => {
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
}

function prepareChartData() {
  const data = loadTransactions();

  const incomeData = new Array(12).fill(0);
  const expenseData = new Array(12).fill(0);

  data.forEach((transaction) => {
    const month = new Date(transaction.createdAt).getMonth();

    if (transaction.type === "income") {
      incomeData[month] += transaction.amount;
    } else {
      expenseData[month] += transaction.amount;
    }
  });

  return {
    incomeData,
    expenseData,
  };
}

let financeChart;

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
    type: "line",
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
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.08)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#22c55e",
          pointHoverBorderColor: isDark ? "#1f2937" : "#ffffff",
          pointHoverBorderWidth: 2,
        },
        {
          label: "Pengeluaran",
          data: expenseData,
          borderColor: "#f87171",
          backgroundColor: "rgba(248,113,113,0.08)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#f87171",
          pointHoverBorderColor: isDark ? "#1f2937" : "#ffffff",
          pointHoverBorderWidth: 2,
        },
      ],
    },
    options: {
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
            label: (ctx) => {
              return " " + ctx.dataset.label + ": " + rupiah(ctx.raw);
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
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
    },
  });
}

if (elements.balance) {
  renderDashboard();
}
