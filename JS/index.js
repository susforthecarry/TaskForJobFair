document.addEventListener('DOMContentLoaded', () => {
  const customerTable = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
  const searchName = document.getElementById('searchName');
  const searchAmount = document.getElementById('searchAmount');
  const transactionChartCtx = document.getElementById('transactionChart').getContext('2d');
  let transactionChart;

  let customers = [];
  let transactions = [];
  let filteredTransactions = [];

  const fetchData = async () => {
    try {
      const response = await fetch('./db.json');
      const data = await response.json();
      customers = data.customers;
      transactions = data.transactions;
      filteredTransactions = transactions;
      displayData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const displayData = () => {
    customerTable.innerHTML = '';
    filteredTransactions.forEach(transaction => {
      const customer = customers.find(cust => cust.id === transaction.customer_id);
      if (customer) {
        const row = customerTable.insertRow();
        row.insertCell(0).innerText = customer.name;
        row.insertCell(1).innerText = transaction.date;
        row.insertCell(2).innerText = transaction.amount;
      }
    });
  };

  const filterData = () => {
    const nameFilter = searchName.value.toLowerCase();
    const amountFilter = searchAmount.value;

    filteredTransactions = transactions.filter(transaction => {
      const customer = customers.find(cust => cust.id === transaction.customer_id);
      if (!customer) {
        return false;
      }
      const matchesName = customer.name.toLowerCase().includes(nameFilter);
      const matchesAmount = !amountFilter || transaction.amount === Number(amountFilter);
      return matchesName && matchesAmount;
    });

    displayData();
  };

  searchName.addEventListener('input', filterData);
  searchAmount.addEventListener('input', filterData);

  const createChart = (customerId) => {
    const customerTransactions = transactions.filter(transaction => transaction.customer_id === customerId);
    const dates = [...new Set(customerTransactions.map(trans => trans.date))];
    const totalAmounts = dates.map(date => {
      return customerTransactions
        .filter(trans => trans.date === date)
        .reduce((total, trans) => total + trans.amount, 0);
    });

    if (transactionChart) {
      transactionChart.destroy();
    }

    transactionChart = new Chart(transactionChartCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Total Transaction Amount',
          data: totalAmounts,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  customerTable.addEventListener('click', (event) => {
    const customerName = event.target.closest('tr').cells[0].innerText;
    const customer = customers.find(cust => cust.name === customerName);
    if (customer) {
      createChart(customer.id);
    }
  });

  fetchData();
});
