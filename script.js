const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const addBtn = document.getElementById("addBtn");
const transactionList = document.getElementById("transactionList");
const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");
const filterInput = document.getElementById("filter");
const clearBtn = document.getElementById("clearBtn");


let transactions = [];
const savedTransactions = localStorage.getItem("transactions");

if(savedTransactions) {
    transactions = JSON.parse(savedTransactions);
}

let balance = 0;

function updateTotals() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function (transaction) {
        if(transaction.type === "income") {
            totalIncome+=transaction.amount;
        } else {
            totalExpense+=transaction.amount;
        }
    });

    balance = totalIncome-totalExpense;

    incomeDisplay.textContent = `Income: ₹${totalIncome}`;
    expenseDisplay.textContent = `Expense: ₹${totalExpense}`;
    balanceDisplay.textContent = `Balance: ₹${balance}`;
}

function renderTransactions() {
    transactionList.innerHTML = "";

    const filteredTransactions = transactions.filter(function (transaction) {
        return filterInput.value === "all" || transaction.type === filterInput.value;
    });

    filteredTransactions.forEach(function (transaction) {
        const li = document.createElement("li");

        li.textContent = `${transaction.description} - ₹${transaction.amount} (${transaction.type})`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        li.appendChild(deleteBtn);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        li.appendChild(editBtn); 
        
        editBtn.addEventListener("click", function () {
            const newDescription = prompt("Edit description:", transaction.description);

            if (newDescription === null || newDescription.trim() === "") {
                return;
            }

            transaction.description = newDescription.trim();

            const newAmount = Number(prompt("Edit amount:", transaction.amount));

            if (newAmount <= 0 || isNaN(newAmount)) {
                return;
            }

            transaction.amount = newAmount;

            localStorage.setItem("transactions", JSON.stringify(transactions));
            updateTotals();
            renderTransactions();
        });

        deleteBtn.addEventListener("click", function () {
            transactions = transactions.filter(function (item) {
                return item !== transaction;
            });

            localStorage.setItem("transactions", JSON.stringify(transactions));

            renderTransactions();
            updateTotals();
        });

        transactionList.appendChild(li);
    });
}

addBtn.addEventListener("click", function() {
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if(description==="" || amount<=0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    transactions.push({
        description: description,
        amount: amount,
        type: type
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTotals();

    renderTransactions();

    descriptionInput.value = "";
    amountInput.value = "";
});

filterInput.addEventListener("change", function () {
    renderTransactions();
});

clearBtn.addEventListener("click", function () {
    transactions = [];
    localStorage.removeItem("transactions");

    renderTransactions();
    updateTotals();
});

renderTransactions();
updateTotals();