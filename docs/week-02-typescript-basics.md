# Week 2: TypeScript Basics

This document covers TypeScript fundamentals — types, interfaces, and how to set up a project.

---

## 1. What is TypeScript?

TypeScript is JavaScript with static types. It:
- Catches errors at compile time instead of runtime
- Provides better IDE support (autocomplete, refactoring)
- Documents your code through types
- Compiles to plain JavaScript

```typescript
// TypeScript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

greet("Alice");  // ✅ OK
greet(42);       // ❌ Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

---

## 2. Setting Up a TypeScript Project

### Initialize a project

```bash
mkdir my-project
cd my-project
npm init -y
npm install typescript -D
npx tsc --init
```

### tsconfig.json essentials

```json
{
  "compilerOptions": {
    "target": "ES2022",           // JavaScript version to compile to
    "module": "NodeNext",         // Module system
    "moduleResolution": "NodeNext",
    "strict": true,               // Enable all strict checks (recommended!)
    "esModuleInterop": true,      // Better import compatibility
    "skipLibCheck": true,         // Skip type checking of .d.ts files
    "outDir": "./dist",           // Output directory
    "rootDir": "./src"            // Source directory
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Running TypeScript

```bash
# Compile to JavaScript
npx tsc

# Run directly (without compiling)
npx tsx src/index.ts
```

---

## 3. Basic Types

### Primitives

```typescript
// string
const name: string = "Alice";
const greeting: string = `Hello, ${name}`;

// number (integers and floats)
const age: number = 30;
const price: number = 19.99;
const hex: number = 0xff;

// boolean
const isActive: boolean = true;
const hasPermission: boolean = false;

// null and undefined
const nothing: null = null;
const notDefined: undefined = undefined;
```

### Arrays

```typescript
// Two equivalent syntaxes
const numbers: number[] = [1, 2, 3, 4, 5];
const strings: Array<string> = ["a", "b", "c"];

// Mixed arrays (avoid if possible)
const mixed: (string | number)[] = [1, "two", 3];

// Readonly arrays
const frozen: readonly number[] = [1, 2, 3];
frozen.push(4);  // ❌ Error: Property 'push' does not exist on readonly array
```

### Tuples
Fixed-length arrays with specific types at each position:

```typescript
// [string, number] tuple
const person: [string, number] = ["Alice", 30];

// Accessing elements
const name = person[0];  // string
const age = person[1];   // number

// Named tuples (for clarity)
type Point = [x: number, y: number];
const origin: Point = [0, 0];

// Optional elements
type Response = [number, string, boolean?];
const success: Response = [200, "OK"];
const error: Response = [404, "Not Found", false];
```

### any, unknown, never

```typescript
// any - disables type checking (avoid!)
let anything: any = "hello";
anything = 42;
anything = { foo: "bar" };
anything.nonExistent.method();  // No error, but will crash at runtime!

// unknown - type-safe any (must check before using)
let uncertain: unknown = "hello";
uncertain = 42;
// uncertain.toUpperCase();  // ❌ Error: Object is of type 'unknown'
if (typeof uncertain === "string") {
  uncertain.toUpperCase();   // ✅ OK after type check
}

// never - represents values that never occur
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

### void
For functions that don't return a value:

```typescript
function logMessage(message: string): void {
  console.log(message);
  // No return statement
}
```

---

## 4. Type Inference

TypeScript can often figure out types automatically:

```typescript
// TypeScript infers these types
let name = "Alice";        // string
let age = 30;              // number
let isActive = true;       // boolean
let numbers = [1, 2, 3];   // number[]

// Inference from return value
function add(a: number, b: number) {
  return a + b;  // Return type inferred as number
}

// Inference from context
const names = ["Alice", "Bob", "Charlie"];
names.map(name => name.toUpperCase());  // name inferred as string
```

**When to add explicit types:**
- Function parameters (always)
- Complex return types
- When inference isn't what you want
- Public API boundaries

```typescript
// Parameters need explicit types
function greet(name: string, age: number): string {
  return `${name} is ${age}`;
}

// Let inference work for simple cases
const result = greet("Alice", 30);  // result is string
```

---

## 5. Object Types

### Inline object types

```typescript
function printPerson(person: { name: string; age: number }) {
  console.log(`${person.name} is ${person.age}`);
}

printPerson({ name: "Alice", age: 30 });
```

### Optional properties

```typescript
function printPerson(person: { name: string; age?: number }) {
  console.log(person.name);
  if (person.age !== undefined) {
    console.log(`Age: ${person.age}`);
  }
}

printPerson({ name: "Alice" });           // ✅ OK
printPerson({ name: "Bob", age: 25 });    // ✅ OK
```

### Readonly properties

```typescript
function printPerson(person: { readonly name: string; age: number }) {
  person.age = 31;    // ✅ OK
  person.name = "Bob"; // ❌ Error: Cannot assign to 'name' because it is a read-only property
}
```

---

## 6. Interfaces

Interfaces define the shape of objects:

```typescript
interface Person {
  name: string;
  age: number;
  email?: string;  // Optional
  readonly id: string;  // Can't be changed after creation
}

const alice: Person = {
  id: "123",
  name: "Alice",
  age: 30,
};

alice.age = 31;     // ✅ OK
alice.id = "456";   // ❌ Error: Cannot assign to 'id'
```

### Methods in interfaces

```typescript
interface Person {
  name: string;
  greet(): string;
  greetWith(greeting: string): string;
}

const alice: Person = {
  name: "Alice",
  greet() {
    return `Hello, I'm ${this.name}`;
  },
  greetWith(greeting) {
    return `${greeting}, I'm ${this.name}`;
  },
};
```

### Extending interfaces

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

const buddy: Dog = {
  name: "Buddy",
  breed: "Golden Retriever",
  bark() {
    console.log("Woof!");
  },
};
```

### Multiple inheritance

```typescript
interface Printable {
  print(): void;
}

interface Loggable {
  log(): void;
}

interface Document extends Printable, Loggable {
  title: string;
}
```

---

## 7. Type Aliases

Type aliases create custom type names:

```typescript
// Simple alias
type ID = string | number;

// Object type alias
type Person = {
  name: string;
  age: number;
};

// Function type alias
type Greeter = (name: string) => string;

// Union type alias
type Status = "pending" | "approved" | "rejected";

// Using them
const userId: ID = "abc123";
const orderStatus: Status = "pending";

const greet: Greeter = (name) => `Hello, ${name}!`;
```

### Interface vs Type Alias

Both can define object shapes, but have differences:

```typescript
// Interface - can be extended and merged
interface Person {
  name: string;
}
interface Person {  // Declaration merging
  age: number;
}
// Person now has both name and age

// Type - more flexible, can't be merged
type Person = {
  name: string;
};
// type Person = { age: number };  // ❌ Error: Duplicate identifier

// Type can do things interface can't
type StringOrNumber = string | number;  // Union
type Point = [number, number];          // Tuple
type Callback = () => void;             // Function
```

**Rule of thumb:**
- Use `interface` for object shapes (especially public APIs)
- Use `type` for unions, tuples, and complex types

---

## 8. Union Types

A value can be one of several types:

```typescript
// Basic union
type StringOrNumber = string | number;

let value: StringOrNumber = "hello";
value = 42;  // ✅ OK
value = true;  // ❌ Error

// Literal unions (great for status/state)
type Status = "loading" | "success" | "error";
type Direction = "north" | "south" | "east" | "west";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function setStatus(status: Status) {
  console.log(`Status: ${status}`);
}

setStatus("loading");  // ✅ OK
setStatus("pending");  // ❌ Error: not in the union
```

### Working with unions

```typescript
function printId(id: string | number) {
  // Can only use methods common to both types
  console.log(id.toString());  // ✅ OK
  
  // Need to narrow for type-specific methods
  if (typeof id === "string") {
    console.log(id.toUpperCase());  // ✅ OK - id is string here
  } else {
    console.log(id.toFixed(2));     // ✅ OK - id is number here
  }
}
```

---

## 9. Literal Types

Exact values as types:

```typescript
// String literals
let direction: "north" | "south" | "east" | "west";
direction = "north";  // ✅ OK
direction = "up";     // ❌ Error

// Number literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceRoll = 4;  // ✅ OK
roll = 7;                // ❌ Error

// Boolean literal (rarely useful alone)
type AlwaysTrue = true;

// Combining with other types
type Result = 
  | { success: true; data: string }
  | { success: false; error: string };
```

### const assertions

```typescript
// Without as const
const config = {
  endpoint: "/api",
  method: "GET",
};
// config.method is type string

// With as const
const config = {
  endpoint: "/api",
  method: "GET",
} as const;
// config.method is type "GET" (literal)
// config is readonly
```

---

## 10. Type Assertions

Tell TypeScript you know better (use sparingly):

```typescript
// as syntax (preferred)
const input = document.getElementById("myInput") as HTMLInputElement;
input.value = "Hello";

// Angle bracket syntax (doesn't work in JSX)
const input2 = <HTMLInputElement>document.getElementById("myInput");

// Non-null assertion (when you're sure it's not null)
const element = document.getElementById("myElement")!;
// Tells TS: "trust me, this won't be null"
```

### When to use assertions

```typescript
// ✅ Good: You know more than TypeScript
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// ❌ Bad: Lying to TypeScript
const num = "hello" as unknown as number;  // This will cause runtime errors!
```

---

## 11. Functions

### Parameter and return types

```typescript
// Explicit types
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Return type inference (often fine to omit)
function subtract(a: number, b: number) {
  return a - b;  // Return type inferred as number
}
```

### Optional and default parameters

```typescript
// Optional parameter
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

greet("Alice");           // "Hello, Alice!"
greet("Bob", "Hi");       // "Hi, Bob!"

// Default parameter
function greet2(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}
```

### Rest parameters

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3);       // 6
sum(1, 2, 3, 4, 5); // 15
```

### Function type expressions

```typescript
// Type alias for function
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;

// As parameter type
function calculate(a: number, b: number, operation: MathOperation): number {
  return operation(a, b);
}

calculate(10, 5, add);      // 15
calculate(10, 5, subtract); // 5
```

### Callback types

```typescript
// Inline callback type
function fetchData(callback: (data: string) => void): void {
  // ... fetch data
  callback("result");
}

// With type alias
type Callback = (error: Error | null, result?: string) => void;

function fetchData2(callback: Callback): void {
  try {
    callback(null, "success");
  } catch (e) {
    callback(e as Error);
  }
}
```

---

## 12. Working with null and undefined

### strictNullChecks

With `strict: true` in tsconfig, null/undefined are handled explicitly:

```typescript
// Without strict null checks
function getLength(str: string) {
  return str.length;  // Could crash if str is null!
}

// With strict null checks
function getLength(str: string | null): number {
  if (str === null) {
    return 0;
  }
  return str.length;  // TypeScript knows str is string here
}
```

### Optional chaining

```typescript
interface User {
  name: string;
  address?: {
    city?: string;
  };
}

function getCity(user: User): string | undefined {
  return user.address?.city;  // Returns undefined if address is missing
}
```

### Nullish coalescing

```typescript
// ?? returns right side only if left is null/undefined
const name = user.name ?? "Anonymous";

// Different from || which also triggers on "", 0, false
const count = data.count ?? 0;   // Only if count is null/undefined
const count2 = data.count || 0;  // Also if count is 0, "", false
```

---

## 13. Enums

Named constants:

```typescript
// Numeric enum (auto-increments from 0)
enum Direction {
  North,  // 0
  South,  // 1
  East,   // 2
  West,   // 3
}

let dir: Direction = Direction.North;
console.log(dir);  // 0

// String enum (preferred - more readable)
enum Status {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

let status: Status = Status.Pending;
console.log(status);  // "PENDING"
```

### Const enums (inlined at compile time)

```typescript
const enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

// Compiles to just the number, no runtime object
const status = HttpStatus.OK;  // Becomes: const status = 200;
```

### Union types vs enums

Many prefer union types over enums:

```typescript
// Enum
enum Status {
  Pending = "pending",
  Approved = "approved",
}

// Union type (simpler, no runtime overhead)
type Status = "pending" | "approved";

// Both work similarly
function setStatus(status: Status) { }
```

---

## Quick Reference

### Type Annotations
```typescript
const str: string = "hello";
const num: number = 42;
const bool: boolean = true;
const arr: number[] = [1, 2, 3];
const tuple: [string, number] = ["a", 1];
const obj: { name: string } = { name: "Alice" };
```

### Interface
```typescript
interface Person {
  name: string;
  age?: number;           // Optional
  readonly id: string;    // Immutable
  greet(): string;        // Method
}
```

### Type Alias
```typescript
type ID = string | number;
type Status = "pending" | "done";
type Handler = (event: Event) => void;
```

### Function Types
```typescript
function fn(param: Type): ReturnType { }
const fn = (param: Type): ReturnType => { };
type Fn = (param: Type) => ReturnType;
```

### Assertions
```typescript
value as Type
value!           // Non-null assertion
```

---

## Exercises

1. **Type a config object:** Create an interface for a server configuration with host, port, ssl (optional), and timeout.

2. **Function signatures:** Write a function that takes a string or number ID and returns a formatted string.

3. **Literal types:** Create a type for HTTP methods and a function that only accepts valid methods.

4. **Optional properties:** Create a User interface with required name/email and optional phone/address.

5. **Type narrowing:** Write a function that handles `string | string[]` input and always returns a string.
