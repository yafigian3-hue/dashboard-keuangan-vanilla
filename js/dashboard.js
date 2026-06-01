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

let financeChart;

function renderChart() {
  if (!elements.financeChart) return;

  const { income, expense } = calculateSummary();

  if (financeChart) {
    financeChart.destroy();
  }

  financeChart = new Chart(elements.financeChart, {
    type: "doughnut",
    data: {
      labels: ["Pemasukan", "Pengeluaran"],
      datasets: [
        {
          data: [income, expense],
          backgroundColor: ["#16a34a", "#dc2626"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

if (elements.balance) {
  renderDashboard();
}


