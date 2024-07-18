$(document).ready(function() {
    // Sample data for customers and transactions
    const customers = [
        { "id": 1, "name": "Ahmed Ali" },
        { "id": 2, "name": "Aya Elsayed" },
        { "id": 3, "name": "Mina Adel" },
        { "id": 4, "name": "Sarah Reda" },
        { "id": 5, "name": "Mohamed Sayed" }
    ];
    
    const transactions = [
        { "id": 1, "customer_id": 1, "date": "2022-01-01", "amount": 1000 },
        { "id": 2, "customer_id": 1, "date": "2022-01-02", "amount": 2000 },
        { "id": 3, "customer_id": 2, "date": "2022-01-01", "amount": 550 },
        { "id": 4, "customer_id": 3, "date": "2022-01-01", "amount": 500 },
        { "id": 5, "customer_id": 2, "date": "2022-01-02", "amount": 1300 },
        { "id": 6, "customer_id": 4, "date": "2022-01-01", "amount": 750 },
        { "id": 7, "customer_id": 3, "date": "2022-01-02", "amount": 1250 },
        { "id": 8, "customer_id": 5, "date": "2022-01-01", "amount": 2500 },
        { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 }
    ];

    // Store data in localStorage if not already present
    if (!localStorage.getItem('customers')) {
        localStorage.setItem('customers', JSON.stringify(customers));
    }
    if (!localStorage.getItem('transactions')) {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Retrieve data from localStorage
    const storedCustomers = JSON.parse(localStorage.getItem('customers'));
    const storedTransactions = JSON.parse(localStorage.getItem('transactions'));

    let transactionChart;

    // Populate the customer dropdown with customer names
    function populateCustomerSelect(customers) {
        const select = $('#customerSelect');
        select.empty();
        select.append('<option value="">Select Customer</option>');
        customers.forEach(customer => {
            const option = `<option value="${customer.id}">${customer.name}</option>`;
            select.append(option);
        });
    }

    // Display the table with customer and transaction data
    function displayTable(customers, transactions) {
        const tbody = $('#customerTableBody');
        tbody.empty();

        customers.forEach(customer => {
            const customerTransactions = transactions.filter(tx => tx.customer_id === customer.id);
            customerTransactions.forEach(tx => {
                const row = `<tr>
                    <td>${customer.name}</td>
                    <td>${tx.date}</td>
                    <td>${tx.amount}</td>
                </tr>`;
                tbody.append(row);
            });
        });
    }

    // Filter the table based on the input values
    function filterTable() {
        const filterName = $('#filterName').val().toLowerCase();
        const filterAmount = $('#filterAmount').val();

        const filteredCustomers = storedCustomers.filter(customer => 
            customer.name.toLowerCase().includes(filterName)
        );

        const filteredTransactions = storedTransactions.filter(tx => 
            (!filterAmount || tx.amount >= filterAmount)
        );

        displayTable(filteredCustomers, filteredTransactions);
    }

    // Display the chart for the selected customer's transactions
    function displayChart(customerId) {
        console.log('Customer ID:', customerId);
        const ctx = document.getElementById('transactionChart').getContext('2d');
        const customerTransactions = storedTransactions.filter(tx => tx.customer_id === customerId);
        console.log('Customer Transactions:', customerTransactions);
        const groupedByDate = customerTransactions.reduce((acc, tx) => {
            acc[tx.date] = (acc[tx.date] || 0) + tx.amount;
            return acc;
        }, {});

        const labels = Object.keys(groupedByDate);
        const data = Object.values(groupedByDate);

        console.log('Labels:', labels);
        console.log('Data:', data);

        // Destroy the previous chart instance if it exists
        if (transactionChart) {
            transactionChart.destroy();
        }

        // Create a new chart instance
        transactionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Transaction Amount',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
    }

    // Attach event listeners to the filter inputs
    $('#filterName').on('input', filterTable);
    $('#filterAmount').on('input', filterTable);

    // Attach event listener to the customer dropdown
    $('#customerSelect').on('change', function() {
        const customerId = parseInt($(this).val());
        if (customerId) {
            displayChart(customerId);
        }
    });

    // Initialize the customer dropdown and table display
    populateCustomerSelect(storedCustomers);
    displayTable(storedCustomers, storedTransactions);
});
