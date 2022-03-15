const transactionUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'));
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : [];

const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
        transaction.id !== ID)
    updatLocalStorage();
    init();
}

const addTransactionIntDOM = ({amount, id, name}) => {
    const operator = amount < 0 ? '-' : '+';
    const CSSclass = amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(amount);
    const li = document.createElement('li');

    li.classList.add(CSSclass);
    li.innerHTML = `${name} 
    <span> ${operator} R$ ${amountWithoutOperator} </span>
    <button class="delete-btn" onClick="removeTransaction(${id})">X</button>`; 
    transactionUl.append(li);
}

const getExpenses = transactionsAmount => Math.abs(transactionsAmount
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2);
        

const getIncome = transactionsAmount => transactionsAmount
    .filter(value => value > 0)
    .reduce((accumulator, transactionsAmount) => accumulator + transactionsAmount, 0)
    .toFixed(2);

const getTotal = transactionsAmount => transactionsAmount
.reduce((accumulator, transaction) => accumulator + transaction, 0)
.toFixed(2);

const updateBalance = () => {
    const transactionsAmount = transactions
    .map(({amount}) => amount);
    const total = getTotal(transactionsAmount);
    const income = getIncome(transactionsAmount);
    const expense = getExpenses(transactionsAmount);
    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionUl.innerHTML = '';
    transactions.forEach(addTransactionIntDOM);
    updateBalance();
}
init();

const updatLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    });

}

const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
}

const hadleFormSubmit = event => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

    if (isSomeInputEmpty) {
        alert('Por favor, preencha tanto  o nome quanto o valor da transação!');
        return
    }

    addToTransactionsArray(transactionName, transactionAmount);
    init();
    updatLocalStorage();
    cleanInputs();
}

form.addEventListener('submit', hadleFormSubmit)
