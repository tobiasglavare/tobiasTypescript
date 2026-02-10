# Week 1: JavaScript Fundamentals

This document covers the essential JavaScript concepts you need before diving into TypeScript.

---

## 1. Variables: let, const, var

### const
Use `const` for values that won't be reassigned:

```javascript
const name = "Alice";
const age = 30;
const config = { debug: true };

name = "Bob";        // ❌ Error: can't reassign
config.debug = false; // ✅ OK: object properties can change
config = {};          // ❌ Error: can't reassign the variable itself
```

`const` means the *binding* is constant, not the value. Objects and arrays can still be modified internally.

### let
Use `let` for values that will change:

```javascript
let count = 0;
count = count + 1;  // ✅ OK

let score;          // Can declare without initializing
score = 100;
```

### var (avoid)
`var` is the old way. It has confusing scoping rules:

```javascript
// var is function-scoped, not block-scoped
if (true) {
  var x = 10;
}
console.log(x); // 10 - x "leaks" out of the block!

// let/const are block-scoped
if (true) {
  let y = 20;
}
console.log(y); // ❌ Error: y is not defined
```

**Rule:** Always use `const` by default. Use `let` when you need to reassign. Never use `var`.

---

## 2. Data Types

JavaScript has 7 primitive types and objects:

### Primitives

```javascript
// string
const greeting = "Hello";
const template = `Hello ${name}`;  // template literal

// number (integers and floats are the same type)
const integer = 42;
const decimal = 3.14;
const negative = -10;

// boolean
const isActive = true;
const isComplete = false;

// undefined - variable declared but not assigned
let something;
console.log(something); // undefined

// null - intentional absence of value
const empty = null;

// symbol - unique identifier (rarely used directly)
const id = Symbol("id");

// bigint - for very large integers
const huge = 9007199254740991n;
```

### Objects
Everything else is an object:

```javascript
// Object literal
const person = {
  name: "Alice",
  age: 30,
  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
};

// Array (special object)
const numbers = [1, 2, 3, 4, 5];

// Function (also an object!)
const add = (a, b) => a + b;
```

### typeof operator

```javascript
typeof "hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object" (historical bug!)
typeof {}          // "object"
typeof []          // "object" (arrays are objects)
typeof function(){} // "function"
```

---

## 3. Functions

### Function Declaration
Hoisted (can be called before definition):

```javascript
greet("Alice"); // ✅ Works due to hoisting

function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

### Function Expression
Not hoisted:

```javascript
greet("Alice"); // ❌ Error: greet is not defined

const greet = function(name) {
  console.log(`Hello, ${name}!`);
};
```

### Arrow Functions
Concise syntax, different `this` behavior:

```javascript
// Basic arrow function
const add = (a, b) => a + b;

// With single parameter, parentheses optional
const double = n => n * 2;

// With function body (need explicit return)
const multiply = (a, b) => {
  const result = a * b;
  return result;
};

// Returning an object (wrap in parentheses)
const createUser = (name) => ({ name, createdAt: new Date() });
```

### Default Parameters

```javascript
function greet(name = "World") {
  console.log(`Hello, ${name}!`);
}

greet();        // "Hello, World!"
greet("Alice"); // "Hello, Alice!"
```

### Rest Parameters

```javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3);       // 6
sum(1, 2, 3, 4, 5); // 15
```

### Destructuring Parameters

```javascript
// Object destructuring
function printUser({ name, age }) {
  console.log(`${name} is ${age} years old`);
}
printUser({ name: "Alice", age: 30 });

// Array destructuring
function printCoords([x, y]) {
  console.log(`Position: ${x}, ${y}`);
}
printCoords([10, 20]);
```

---

## 4. Arrow Functions Deep Dive

Arrow functions differ from regular functions in important ways:

### Concise Syntax

```javascript
// These are equivalent:
const add1 = function(a, b) { return a + b; };
const add2 = (a, b) => { return a + b; };
const add3 = (a, b) => a + b;  // implicit return
```

### No Own `this`
Arrow functions inherit `this` from their surrounding scope:

```javascript
const counter = {
  count: 0,
  
  // Regular function: `this` refers to counter
  incrementRegular: function() {
    setTimeout(function() {
      this.count++;  // ❌ `this` is undefined or window, not counter!
    }, 100);
  },
  
  // Arrow function: `this` inherited from incrementArrow
  incrementArrow: function() {
    setTimeout(() => {
      this.count++;  // ✅ `this` is counter
    }, 100);
  }
};
```

### When to Use Which

| Use Arrow Functions | Use Regular Functions |
|--------------------|-----------------------|
| Callbacks | Object methods |
| Array methods (map, filter) | Constructors |
| When you need lexical `this` | When you need dynamic `this` |

---

## 5. Scope

Scope determines where variables are accessible.

### Global Scope
Variables declared outside any function/block:

```javascript
const globalVar = "I'm everywhere";

function test() {
  console.log(globalVar); // ✅ Accessible
}
```

### Function Scope
Variables declared inside a function:

```javascript
function test() {
  const localVar = "I'm local";
  console.log(localVar); // ✅ Accessible
}

console.log(localVar); // ❌ Error: not defined
```

### Block Scope (let/const)
Variables declared inside `{}`:

```javascript
if (true) {
  const blockVar = "I'm in a block";
  console.log(blockVar); // ✅ Accessible
}

console.log(blockVar); // ❌ Error: not defined
```

### Lexical Scope
Functions can access variables from their parent scope:

```javascript
const outer = "outer";

function parent() {
  const middle = "middle";
  
  function child() {
    const inner = "inner";
    console.log(outer);  // ✅ Can access
    console.log(middle); // ✅ Can access
    console.log(inner);  // ✅ Can access
  }
  
  child();
}
```

---

## 6. Closures

A closure is a function that remembers variables from its outer scope, even after that scope has finished executing.

### Basic Example

```javascript
function createGreeter(greeting) {
  // `greeting` is "closed over" by the inner function
  return function(name) {
    console.log(`${greeting}, ${name}!`);
  };
}

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");

sayHello("Alice"); // "Hello, Alice!"
sayHi("Bob");      // "Hi, Bob!"
```

`createGreeter` has finished running, but the returned function still has access to `greeting`.

### Counter Example

```javascript
function createCounter() {
  let count = 0;  // Private variable
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
console.log(counter.getCount()); // 0
counter.increment();
counter.increment();
console.log(counter.getCount()); // 2

// count is not directly accessible
console.log(counter.count); // undefined
```

### Common Use Cases

**1. Data Privacy:**
```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance;  // Private!
  
  return {
    deposit: (amount) => { balance += amount; },
    withdraw: (amount) => { 
      if (amount <= balance) balance -= amount;
    },
    getBalance: () => balance,
  };
}
```

**2. Function Factories:**
```javascript
function createMultiplier(factor) {
  return (number) => number * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

double(5); // 10
triple(5); // 15
```

**3. Memoization:**
```javascript
function memoize(fn) {
  const cache = {};
  
  return function(arg) {
    if (arg in cache) {
      return cache[arg];
    }
    const result = fn(arg);
    cache[arg] = result;
    return result;
  };
}

const expensiveOperation = memoize((n) => {
  console.log("Computing...");
  return n * 2;
});

expensiveOperation(5); // "Computing..." → 10
expensiveOperation(5); // 10 (cached, no log)
```

### Loop Closure Gotcha

```javascript
// ❌ Common mistake with var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3 (all reference the same i)

// ✅ Fixed with let (block-scoped)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 0, 1, 2 (each iteration has its own i)
```

---

## 7. Objects

### Object Literals

```javascript
const person = {
  firstName: "Alice",
  lastName: "Smith",
  age: 30,
  
  // Method shorthand
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
};
```

### Accessing Properties

```javascript
// Dot notation
console.log(person.firstName);  // "Alice"

// Bracket notation (for dynamic keys)
const key = "lastName";
console.log(person[key]);       // "Smith"

// Bracket notation for special characters
const obj = { "my-key": "value" };
console.log(obj["my-key"]);
```

### Adding/Modifying Properties

```javascript
person.email = "alice@example.com";  // Add
person.age = 31;                      // Modify
delete person.age;                    // Remove
```

### Checking Properties

```javascript
"firstName" in person;              // true
person.hasOwnProperty("firstName"); // true
person.middleName !== undefined;    // false (but careful with actual undefined values)
```

### Object Destructuring

```javascript
const { firstName, lastName, age } = person;
console.log(firstName); // "Alice"

// With renaming
const { firstName: first } = person;
console.log(first); // "Alice"

// With defaults
const { middleName = "N/A" } = person;
console.log(middleName); // "N/A"

// Nested destructuring
const user = { 
  name: "Alice", 
  address: { city: "Oslo", country: "Norway" } 
};
const { address: { city } } = user;
console.log(city); // "Oslo"
```

### Spread Operator

```javascript
// Copy object
const copy = { ...person };

// Merge objects
const defaults = { theme: "dark", language: "en" };
const userPrefs = { language: "no" };
const settings = { ...defaults, ...userPrefs };
// { theme: "dark", language: "no" }

// Add/override properties
const updated = { ...person, age: 31, email: "new@example.com" };
```

### Shorthand Properties

```javascript
const name = "Alice";
const age = 30;

// Instead of { name: name, age: age }
const person = { name, age };
```

### Computed Property Names

```javascript
const key = "dynamicKey";
const obj = {
  [key]: "value",
  [`${key}_2`]: "another value",
};
// { dynamicKey: "value", dynamicKey_2: "another value" }
```

---

## 8. The `this` Keyword

`this` is one of JavaScript's trickiest concepts. Its value depends on *how* a function is called.

### In Object Methods

```javascript
const person = {
  name: "Alice",
  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
};

person.greet(); // "Hi, I'm Alice" - this = person
```

### Standalone Function

```javascript
function showThis() {
  console.log(this);
}

showThis(); // undefined (strict mode) or window/global (non-strict)
```

### Lost `this` Problem

```javascript
const person = {
  name: "Alice",
  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
};

const greetFn = person.greet;
greetFn(); // "Hi, I'm undefined" - this is lost!

// Solutions:
// 1. Bind
const boundGreet = person.greet.bind(person);
boundGreet(); // "Hi, I'm Alice"

// 2. Arrow function wrapper
const wrappedGreet = () => person.greet();
wrappedGreet(); // "Hi, I'm Alice"
```

### In Callbacks

```javascript
const person = {
  name: "Alice",
  friends: ["Bob", "Charlie"],
  
  // ❌ Problem: regular function loses `this`
  listFriendsBroken() {
    this.friends.forEach(function(friend) {
      console.log(`${this.name} knows ${friend}`); // this.name is undefined!
    });
  },
  
  // ✅ Solution: arrow function preserves `this`
  listFriends() {
    this.friends.forEach((friend) => {
      console.log(`${this.name} knows ${friend}`); // Works!
    });
  }
};
```

### call, apply, bind

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: "Alice" };

// call - invoke with this + individual args
greet.call(person, "Hello", "!");  // "Hello, Alice!"

// apply - invoke with this + array of args
greet.apply(person, ["Hi", "?"]);  // "Hi, Alice?"

// bind - create new function with fixed this
const boundGreet = greet.bind(person);
boundGreet("Hey", ".");  // "Hey, Alice."
```

### Summary Table

| Context | `this` value |
|---------|-------------|
| Object method | The object |
| Standalone function | undefined (strict) / global (non-strict) |
| Arrow function | Inherited from outer scope |
| Constructor (new) | The new instance |
| call/apply/bind | Explicitly set |
| Event handler | The element (DOM) |

---

## Quick Reference

### Variable Declaration
```javascript
const x = 1;  // Can't reassign, block-scoped
let y = 2;    // Can reassign, block-scoped
var z = 3;    // Avoid! Function-scoped, hoisted
```

### Function Syntax
```javascript
function name(params) {}           // Declaration (hoisted)
const name = function(params) {};  // Expression
const name = (params) => {};       // Arrow function
const name = params => expression; // Arrow (single param, implicit return)
```

### Object Operations
```javascript
obj.key           // Access
obj["key"]        // Dynamic access
{ ...obj }        // Shallow copy
{ ...a, ...b }    // Merge
const { x } = obj // Destructure
```

### Closure Pattern
```javascript
function outer(x) {
  return function inner(y) {
    return x + y;  // inner "closes over" x
  };
}
```

---

## Exercises

1. **Counter with Closure:** Create a counter factory that returns an object with `increment()`, `decrement()`, `reset()`, and `value()` methods.

2. **Once Function:** Create a function `once(fn)` that returns a new function that can only be called once. Subsequent calls return the first result.

3. **Memoize:** Implement a `memoize(fn)` function that caches results based on arguments.

4. **Partial Application:** Create a function `partial(fn, ...args)` that returns a new function with some arguments pre-filled.

5. **Compose:** Create a function `compose(...fns)` that returns a new function that applies all functions right-to-left.
