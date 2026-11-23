
// Selecting HTML Elements

const form = document.querySelector("#transaction-form");

const description = document.querySelector("#description");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const category = document.querySelector("#category");

const balanceDisplay = document.querySelector("#balance");
const incomeDisplay = document.querySelector("#income");
const expenseDisplay = document.querySelector("#expense");

const transactionList = document.querySelector("#transaction-list");

const filterButtons = document.querySelectorAll(".filter");


// Transaction Array

let transactions = [];

try {
    transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    if (!Array.isArray(transactions)) {
        transactions = [];
    }
} catch {
    transactions = [];
}

let currentFilter = "all";


// Add Transaction

form.addEventListener("submit", function(e) {

    e.preventDefault();

    const transactionDescription = description.value.trim();
    const transactionAmount = Number(amount.value);
    const transactionType = type.value;
    const transactionCategory = category.value;

    if (
        !transactionDescription ||
        !Number.isFinite(transactionAmount) ||
        transactionAmount <= 0
    ) {
        alert("Please enter a valid description and amount!");
        return;
    }

    const transaction = {
        id: crypto.randomUUID(),
        description: transactionDescription,
        amount: transactionAmount,
        type: transactionType,
        category: transactionCategory,
        date: new Date().toLocaleDateString()
    };

    transactions.push(transaction);

    saveData();

    updateUI();

    form.reset();

});


// Save Data in LocalStorage

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// Calculate Total Balance

function updateBalance() {

    const totalIncome = transactions
        .filter(item => item.type === "income")
        .reduce((total, item) => total + item.amount, 0);

    const totalExpense = transactions
        .filter(item => item.type === "expense")
        .reduce((total, item) => total + item.amount, 0);

    const totalBalance = totalIncome - totalExpense;

    balanceDisplay.textContent = formatMoney(totalBalance);

    incomeDisplay.textContent = formatMoney(totalIncome);

    expenseDisplay.textContent = formatMoney(totalExpense);

}


// Format Currency

function formatMoney(value) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(value);

}


// Display Transactions

function displayTransactions() {

    transactionList.innerHTML = "";

    const filteredTransactions = transactions.filter(item => {
        return currentFilter === "all" || item.type === currentFilter;
    });

    if (filteredTransactions.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty";
        emptyMessage.textContent = "No transactions found!";

        transactionList.appendChild(emptyMessage);

        return;
    }

    filteredTransactions.forEach(function(item) {

        // Create Transaction Card

        const card = document.createElement("div");

        card.className = `transaction ${item.type}`;

        // Transaction Information

        const info = document.createElement("div");

        info.className = "transaction-info";

        const title = document.createElement("h3");

        title.textContent = item.description;

        const details = document.createElement("p");

        details.textContent = `${item.category} • ${item.date}`;

        info.appendChild(title);
        info.appendChild(details);

        // Amount and Delete Button

        const right = document.createElement("div");

        right.className = "transaction-right";

        const money = document.createElement("span");

        money.className = `transaction-amount ${item.type}`;

        const sign = item.type === "income" ? "+" : "-";

        money.textContent = `${sign}${formatMoney(item.amount)}`;

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            deleteTransaction(item.id);

        });

        right.appendChild(money);
        right.appendChild(deleteButton);

        // Append Everything

        card.appendChild(info);
        card.appendChild(right);

        transactionList.appendChild(card);

    });

}


// Delete Transaction

function deleteTransaction(id) {

    transactions = transactions.filter(function(item) {

        return item.id !== id;

    });

    saveData();

    updateUI();

}


// Filter Transactions

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTransactions();

    });

});


// Update Complete UI

function updateUI() {

    updateBalance();

    displayTransactions();

}


// Initial Display

updateUI();
