//// data
const account1 = {
    owner: 'Charmy Rudani',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};
const account2 = {
    owner: 'Khush Rudani',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};
const account3 = {
    owner: 'Shivani Patoliya',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};
const account4 = {
    owner: 'Swara Sutariya',
    movements: [430, 1000, -700, 50, 90],
    interestRate: 1,
    pin: 4444,
};
const accounts = [account1, account2, account3, account4];


//// Elements


const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const labelWelcome = document.querySelector('.welcome');
const labelInvalidMessage = document.querySelector('.invalidMessage_label');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


let balance=0;

//// create usernames
const createUsername = function(allAccount){
    allAccount.forEach(function(eachAccount){
        eachAccount.username = eachAccount.owner
                    .toLowerCase() .split(' ') .map(first=>first[0]) .join('');
                    console.log(eachAccount.username);
    })
}
createUsername(accounts);


///// Login Implementation
let currentAccount;
btnLogin.addEventListener('click',function(e){
    e.preventDefault();

    if(currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)){
        if(currentAccount.pin === Number(inputLoginPin.value)){
            
            //// Display UI and message
            labelWelcome.textContent = "Welcome back, "+currentAccount.owner.split(' ')[0];
            containerApp.style.opacity=100;
            
            inputLoginUsername.value = inputLoginPin.value = '';
            inputLoginPin.blur();

            updateUI(currentAccount);
            
        }else{
            alert("Incorrect PIN. Please try again.");
        }
    }else{
        alert("Invalid username. Please try again.");
    }
  
});



let updateUI = function(acc){
    //// display movements
    displayMovements(acc.movements);
            
    //// display balance
    calculateBalance(acc)
    
    //// display summary
    calculateSummury(acc.movements)
}


//// Calculate Balance 
const calculateBalance = function(acc){
    balance = acc.movements.reduce((item, sum)=> item+sum ,0)
    labelBalance.textContent = balance+'$'
}

//// display movements
const displayMovements = function (movements, sort=false) {
    containerMovements.innerHTML = '';

    const sortMovements = sort? movements.sort1((a,b)=>a-b) : movements;

    sortMovements.forEach(function (item, i) {
        const type = item > 0 ? 'deposit' : 'withdrawal';

        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__value">${item}$</div>
        </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

//// Calculate Summury : (deposit, withdraw, interest)
const calculateSummury = function(movements){
    const incomes = movements.filter(mov => mov>0)
                       .reduce((acc, cur) => acc+cur, 0);
    labelSumIn.textContent = `${incomes}$`;
    
    const outcomes = movements.filter(mov => mov<=0)
                       .reduce((acc, cur) => acc+cur, 0);
    labelSumOut.textContent = `${Math.abs(outcomes)}$`;

    const interest = movements.filter(mov=>mov>0)
                            .map(deposit => (deposit*1.2)/100)
                            .filter(mov=>mov>=1)
                            .reduce((acc,cur)=> acc+cur, 0);
    labelSumInterest.textContent = `${interest}$`;
}


//// Money Transfer Implementation
btnTransfer.addEventListener('click', function(e){
    e.preventDefault();
    const amount = Number (inputTransferAmount.value);
    const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();

    if(amount>0 && balance>=amount && recieverAcc.username!==currentAccount.username){
        currentAccount.movements.push(-amount);
        recieverAcc.movements.push(amount);
    }
    updateUI(currentAccount);
})


////// Close Account
btnClose.addEventListener('click', function(e){
    e.preventDefault();
    if (Number(inputClosePin.value)===currentAccount.pin && inputCloseUsername.value===currentAccount.username) {
        const index = accounts.findIndex(acc=> acc.username===currentAccount.username);
        
        //// delete account
        accounts.splice(index, 1);
        labelWelcome.textContent = "Log in to get started";
        containerApp.style.opacity=0;
    }
})


////// Request Loan
btnLoan.addEventListener('click',function(e){
    e.preventDefault();
    const amount = Number (inputLoanAmount.value);
    if(amount>0 && currentAccount.movements.some(mov => mov>=amount*0.1)){
        currentAccount.movements.push(amount);
        updateUI(currentAccount);
    }
    inputLoanAmount.value='';
})

const sort = false;
btnSort.addEventListener('click',function(e){
    e.preventDefault();   
    updateUI(currentAccount.movements, !sort);
    sort = !sort;
})