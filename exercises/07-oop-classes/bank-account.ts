// Exercise: Bank Account
//
// Practice: classes, private properties, methods, getters, validation.
//
// Create a BankAccount class with:
//- A private balance (starts at the initial deposit)
// - A readonly accountHolder (string)
// - deposit(amount) — adds to balance, throws if amount <= 0
// - withdraw(amount) — subtracts from balance, throws if amount <= 0 or insufficient funds
// - A getter for the current balance
//
// Example:
//   const account = new BankAccount("Alice", 100);
//   account.deposit(50);
//   account.balance        // 150
//   account.withdraw(30);
//   account.balance        // 120
//   account.withdraw(200); // throws Error("Insufficient funds")
//   account.deposit(-10);  // throws Error("Deposit amount must be positive")

// Your code here
class BankAccount {
  readonly accountHolder: string;
  private _balance: number;
  
  constructor(accountHolder: string , _balance: number) {
    this.accountHolder = accountHolder;
    this._balance = _balance; 
 }
 deposit(amount: number): void {
  if (amount <= 0 ) {
    throw new Error("Deposit amount must be a positive");
  }
  this._balance += amount;
 }

withdraw(amount: number): void {
  if (amount <= 0) {
    throw new Error("Withrawal amount needs to be positive");
    } else if (amount > this._balance) {
      throw new Error("Insufficient funds")
    }
    this._balance -= amount;
  }

  get balance(): number {
    return this._balance;
  }
}


// Test your implementation:
// const account = new BankAccount("Alice", 100);
// account.deposit(50);
// console.log(account.balance);       // 150
// account.withdraw(30);
// console.log(account.balance);       // 120
// console.log(account.accountHolder); // "Alice
