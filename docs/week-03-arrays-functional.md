# Week 3: Arrays & Functional Methods

This document covers array manipulation and functional programming patterns in JavaScript/TypeScript.

---

## 1. Array Basics

### Creating Arrays

```typescript
// Array literal
const numbers: number[] = [1, 2, 3, 4, 5];

// Array constructor (rarely used)
const empty = new Array<string>(3);  // [undefined, undefined, undefined]

// Array.from
const fromString = Array.from("hello");  // ["h", "e", "l", "l", "o"]
const fromRange = Array.from({ length: 5 }, (_, i) => i);  // [0, 1, 2, 3, 4]

// Array.of
const arr = Array.of(1, 2, 3);  // [1, 2, 3]

// Spread into new array
const copy = [...numbers];
const combined = [...numbers, ...moreNumbers];
```

### Accessing Elements

```typescript
const arr = ["a", "b", "c", "d", "e"];

arr[0];      // "a" (first)
arr[4];      // "e" (last by index)
arr.at(-1);  // "e" (last with .at())
arr.at(-2);  // "d" (second to last)

arr.length;  // 5
```

### Modifying Arrays

```typescript
const arr = [1, 2, 3];

// Add to end
arr.push(4);        // [1, 2, 3, 4], returns new length

// Add to beginning
arr.unshift(0);     // [0, 1, 2, 3, 4], returns new length

// Remove from end
arr.pop();          // [0, 1, 2, 3], returns removed element (4)

// Remove from beginning
arr.shift();        // [1, 2, 3], returns removed element (0)

// Remove/insert at position
arr.splice(1, 1);           // Remove 1 element at index 1: [1, 3]
arr.splice(1, 0, 2);        // Insert 2 at index 1: [1, 2, 3]
arr.splice(1, 1, "a", "b"); // Replace 1 element with 2: [1, "a", "b", 3]
```

---

## 2. map()

Transform each element into something new. Returns a new array.

```typescript
const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// Extract property from objects
const users = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];
const names = users.map(user => user.name);
// ["Alice", "Bob"]

// Transform objects
const userDTOs = users.map(user => ({
  displayName: user.name.toUpperCase(),
  isAdult: user.age >= 18,
}));

// With index
const indexed = numbers.map((n, i) => `${i}: ${n}`);
// ["0: 1", "1: 2", "2: 3", "3: 4", "4: 5"]
```

### Type signature

```typescript
Array<T>.map<U>(callback: (value: T, index: number, array: T[]) => U): U[]
```

---

## 3. filter()

Keep only elements that pass a test. Returns a new array.

```typescript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Keep even numbers
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6, 8, 10]

// Keep numbers greater than 5
const large = numbers.filter(n => n > 5);
// [6, 7, 8, 9, 10]

// Filter objects
const users = [
  { name: "Alice", active: true },
  { name: "Bob", active: false },
  { name: "Charlie", active: true },
];
const activeUsers = users.filter(user => user.active);
// [{ name: "Alice", active: true }, { name: "Charlie", active: true }]

// Remove falsy values
const mixed = [0, 1, "", "hello", null, undefined, false, true];
const truthy = mixed.filter(Boolean);
// [1, "hello", true]
```

### Type narrowing with filter

```typescript
const items: (string | null)[] = ["a", null, "b", null, "c"];

// TypeScript doesn't narrow automatically
const strings = items.filter(item => item !== null);
// Type is still (string | null)[]

// Use type predicate for proper narrowing
const strings2 = items.filter((item): item is string => item !== null);
// Type is string[]
```

---

## 4. reduce()

Accumulate array into a single value.

```typescript
const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((total, n) => total + n, 0);
// 15

// Find maximum
const max = numbers.reduce((max, n) => n > max ? n : max, numbers[0]);
// 5

// Count occurrences
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
const counts = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
// { apple: 3, banana: 2, orange: 1 }

// Group by property
const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Charlie", role: "admin" },
];
const byRole = users.reduce((acc, user) => {
  acc[user.role] = acc[user.role] || [];
  acc[user.role].push(user);
  return acc;
}, {} as Record<string, typeof users>);
// { admin: [{...}, {...}], user: [{...}] }

// Flatten nested arrays
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, arr) => [...acc, ...arr], [] as number[]);
// [1, 2, 3, 4, 5, 6]
```

### Type signature

```typescript
Array<T>.reduce<U>(
  callback: (accumulator: U, value: T, index: number, array: T[]) => U,
  initialValue: U
): U
```

### reduceRight()

Same as reduce, but processes from right to left:

```typescript
const letters = ["a", "b", "c"];
const reversed = letters.reduceRight((acc, letter) => acc + letter, "");
// "cba"
```

---

## 5. find() and findIndex()

Find first matching element or its index.

```typescript
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

// Find first match
const bob = users.find(user => user.name === "Bob");
// { id: 2, name: "Bob" }

const notFound = users.find(user => user.name === "Dave");
// undefined

// Find index
const bobIndex = users.findIndex(user => user.name === "Bob");
// 1

const notFoundIndex = users.findIndex(user => user.name === "Dave");
// -1
```

### findLast() and findLastIndex()

Find from the end:

```typescript
const numbers = [1, 2, 3, 2, 1];

const lastTwo = numbers.findLast(n => n === 2);
// 2 (the one at index 3)

const lastTwoIndex = numbers.findLastIndex(n => n === 2);
// 3
```

---

## 6. some() and every()

Test if elements pass a condition.

```typescript
const numbers = [1, 2, 3, 4, 5];

// some: at least one passes
numbers.some(n => n > 3);   // true (4 and 5 pass)
numbers.some(n => n > 10);  // false

// every: all must pass
numbers.every(n => n > 0);  // true
numbers.every(n => n > 3);  // false (1, 2, 3 fail)

// Practical examples
const users = [
  { name: "Alice", verified: true },
  { name: "Bob", verified: false },
];

const hasUnverified = users.some(u => !u.verified);  // true
const allVerified = users.every(u => u.verified);    // false
```

---

## 7. includes(), indexOf(), lastIndexOf()

Check if array contains a value.

```typescript
const fruits = ["apple", "banana", "orange"];

// includes: boolean check
fruits.includes("banana");  // true
fruits.includes("grape");   // false

// indexOf: find position (or -1)
fruits.indexOf("banana");   // 1
fruits.indexOf("grape");    // -1

// lastIndexOf: find from end
const numbers = [1, 2, 3, 2, 1];
numbers.lastIndexOf(2);     // 3
```

---

## 8. flat() and flatMap()

Flatten nested arrays.

```typescript
// flat: flatten one level by default
const nested = [[1, 2], [3, 4], [5, 6]];
nested.flat();  // [1, 2, 3, 4, 5, 6]

// Deeper nesting
const deep = [1, [2, [3, [4]]]];
deep.flat();     // [1, 2, [3, [4]]]
deep.flat(2);    // [1, 2, 3, [4]]
deep.flat(Infinity);  // [1, 2, 3, 4]

// flatMap: map then flatten one level
const sentences = ["Hello world", "How are you"];
const words = sentences.flatMap(s => s.split(" "));
// ["Hello", "world", "How", "are", "you"]

// Useful for filtering and mapping in one step
const users = [
  { name: "Alice", emails: ["alice@work.com", "alice@home.com"] },
  { name: "Bob", emails: ["bob@work.com"] },
];
const allEmails = users.flatMap(u => u.emails);
// ["alice@work.com", "alice@home.com", "bob@work.com"]
```

---

## 9. sort()

Sort array in place (mutates!).

```typescript
// Default: converts to strings and sorts
const numbers = [10, 2, 30, 1];
numbers.sort();  // [1, 10, 2, 30] - Wrong! String comparison

// Numeric sort
numbers.sort((a, b) => a - b);  // [1, 2, 10, 30] - Ascending
numbers.sort((a, b) => b - a);  // [30, 10, 2, 1] - Descending

// String sort (case-insensitive)
const names = ["Charlie", "alice", "Bob"];
names.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
// ["alice", "Bob", "Charlie"]

// Sort objects by property
const users = [
  { name: "Charlie", age: 35 },
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];
users.sort((a, b) => a.age - b.age);
// Sorted by age ascending

// Non-mutating sort with spread
const sorted = [...numbers].sort((a, b) => a - b);
// or use toSorted() in modern JS
const sorted2 = numbers.toSorted((a, b) => a - b);
```

---

## 10. Other Useful Methods

### slice()
Extract portion without mutating:

```typescript
const arr = [1, 2, 3, 4, 5];

arr.slice(1, 3);   // [2, 3] - from index 1 to 3 (exclusive)
arr.slice(2);      // [3, 4, 5] - from index 2 to end
arr.slice(-2);     // [4, 5] - last 2 elements
arr.slice();       // [1, 2, 3, 4, 5] - shallow copy
```

### concat()
Merge arrays:

```typescript
const a = [1, 2];
const b = [3, 4];
const c = a.concat(b);  // [1, 2, 3, 4]

// Spread is often cleaner
const d = [...a, ...b];  // [1, 2, 3, 4]
```

### join()
Convert to string:

```typescript
const words = ["Hello", "World"];
words.join(" ");   // "Hello World"
words.join("-");   // "Hello-World"
words.join("");    // "HelloWorld"
```

### reverse()
Reverse in place (mutates!):

```typescript
const arr = [1, 2, 3];
arr.reverse();  // [3, 2, 1]

// Non-mutating
const reversed = [...arr].reverse();
// or toReversed() in modern JS
const reversed2 = arr.toReversed();
```

### fill()
Fill with value:

```typescript
const arr = new Array(5).fill(0);  // [0, 0, 0, 0, 0]
[1, 2, 3].fill(0);                 // [0, 0, 0]
[1, 2, 3, 4, 5].fill(0, 2, 4);     // [1, 2, 0, 0, 5]
```

---

## 11. Method Chaining

Combine methods for powerful transformations:

```typescript
const users = [
  { name: "Alice", age: 30, active: true },
  { name: "Bob", age: 25, active: false },
  { name: "Charlie", age: 35, active: true },
  { name: "Diana", age: 28, active: true },
];

// Get names of active users over 27, sorted alphabetically
const result = users
  .filter(u => u.active)
  .filter(u => u.age > 27)
  .map(u => u.name)
  .sort();
// ["Alice", "Charlie", "Diana"]

// Calculate average age of active users
const avgAge = users
  .filter(u => u.active)
  .map(u => u.age)
  .reduce((sum, age, _, arr) => sum + age / arr.length, 0);
// 31

// Transform and group
interface Resource {
  id: string;
  type: "ec2" | "s3" | "rds";
  cost: number;
}

const resources: Resource[] = [
  { id: "1", type: "ec2", cost: 100 },
  { id: "2", type: "s3", cost: 50 },
  { id: "3", type: "ec2", cost: 150 },
];

const costByType = resources.reduce((acc, r) => {
  acc[r.type] = (acc[r.type] || 0) + r.cost;
  return acc;
}, {} as Record<string, number>);
// { ec2: 250, s3: 50 }
```

---

## 12. Immutability Patterns

Avoid mutating original arrays:

```typescript
const original = [1, 2, 3];

// ❌ Mutating
original.push(4);
original.sort();
original.reverse();

// ✅ Non-mutating alternatives
const withNew = [...original, 4];
const sorted = [...original].sort();
const reversed = [...original].reverse();

// Modern alternatives (ES2023+)
const sorted2 = original.toSorted();
const reversed2 = original.toReversed();
const spliced = original.toSpliced(1, 1, 99);  // [1, 99, 3]
const changed = original.with(1, 99);          // [1, 99, 3]
```

### Updating objects in arrays

```typescript
const users = [
  { id: 1, name: "Alice", score: 100 },
  { id: 2, name: "Bob", score: 80 },
];

// Update Bob's score immutably
const updated = users.map(user =>
  user.id === 2 ? { ...user, score: 90 } : user
);

// Remove user
const removed = users.filter(user => user.id !== 2);

// Add user
const added = [...users, { id: 3, name: "Charlie", score: 70 }];
```

---

## 13. TypeScript Array Types

### Typing arrays

```typescript
// Basic array types
const numbers: number[] = [1, 2, 3];
const strings: Array<string> = ["a", "b", "c"];

// Array of objects
interface User {
  name: string;
  age: number;
}
const users: User[] = [{ name: "Alice", age: 30 }];

// Readonly arrays
const frozen: readonly number[] = [1, 2, 3];
const frozen2: ReadonlyArray<number> = [1, 2, 3];
```

### Typing callbacks

```typescript
// map with explicit types
const doubled = numbers.map((n: number): number => n * 2);

// Usually inference works fine
const doubled2 = numbers.map(n => n * 2);

// Complex transformations may need help
const result = data.map((item): TransformedItem => ({
  // TypeScript knows return type
}));
```

### Generic array functions

```typescript
// Generic function that works with any array
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

// Usage
first([1, 2, 3]);        // number | undefined
first(["a", "b", "c"]);  // string | undefined
unique([1, 1, 2, 2, 3]); // [1, 2, 3]
```

---

## Quick Reference

| Method | Mutates | Returns | Purpose |
|--------|---------|---------|---------|
| `map` | No | New array | Transform elements |
| `filter` | No | New array | Keep matching elements |
| `reduce` | No | Single value | Accumulate to one value |
| `find` | No | Element or undefined | First match |
| `findIndex` | No | Index or -1 | Index of first match |
| `some` | No | Boolean | At least one matches |
| `every` | No | Boolean | All match |
| `includes` | No | Boolean | Contains value |
| `flat` | No | New array | Flatten nested |
| `flatMap` | No | New array | Map + flatten |
| `sort` | Yes | Same array | Sort in place |
| `reverse` | Yes | Same array | Reverse in place |
| `push/pop` | Yes | Length/element | Add/remove from end |
| `shift/unshift` | Yes | Element/length | Add/remove from start |
| `splice` | Yes | Removed elements | Insert/remove at index |
| `slice` | No | New array | Extract portion |
| `concat` | No | New array | Merge arrays |

---

## Exercises

1. **Transform data:** Given an array of products with `name` and `price`, create an array of strings like "Product: $XX.XX".

2. **Filter and sum:** Calculate the total cost of all items over $50.

3. **Group by:** Group an array of objects by a specific property.

4. **Unique values:** Write a function that returns unique values from an array.

5. **Flatten and transform:** Given nested arrays of numbers, flatten and return only even numbers doubled.

6. **Pipeline:** Create a data transformation pipeline that filters, maps, and reduces in a chain.
