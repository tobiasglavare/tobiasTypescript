# Week 6: Advanced Types

This document covers union types, type guards, discriminated unions, and type narrowing.

---

## 1. Union Types

A value that can be one of several types:

```typescript
// Basic union
type StringOrNumber = string | number;

let value: StringOrNumber = "hello";
value = 42;  // ✅ OK
value = true;  // ❌ Error

// Literal unions
type Direction = "north" | "south" | "east" | "west";
type HttpStatus = 200 | 201 | 400 | 404 | 500;

// Union of object types
type Response = 
  | { status: "success"; data: string }
  | { status: "error"; message: string };
```

### Working with unions

You can only access properties common to all types:

```typescript
function printId(id: string | number) {
  console.log(id.toString());  // ✅ Both have toString
  console.log(id.toUpperCase());  // ❌ Only string has this
}
```

---

## 2. Type Narrowing

TypeScript tracks type information through control flow:

### typeof narrowing

```typescript
function process(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
  } else {
    // TypeScript knows value is number here
    console.log(value.toFixed(2));
  }
}
```

### Truthiness narrowing

```typescript
function printName(name: string | null | undefined) {
  if (name) {
    // name is string (truthy)
    console.log(name.toUpperCase());
  } else {
    // name is null | undefined | "" (falsy)
    console.log("No name provided");
  }
}
```

### Equality narrowing

```typescript
function compare(a: string | number, b: string | boolean) {
  if (a === b) {
    // Both must be string (only common type)
    console.log(a.toUpperCase());
  }
}
```


### in operator narrowing

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();  // TypeScript knows it's Fish
  } else {
    animal.fly();   // TypeScript knows it's Bird
  }
}
```

### instanceof narrowing

```typescript
function logDate(date: Date | string) {
  if (date instanceof Date) {
    console.log(date.toISOString());
  } else {
    console.log(new Date(date).toISOString());
  }
}
```

---

## 3. Type Guards

Custom functions that narrow types:

### Type predicates

```typescript
// Return type is "paramName is Type"
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string
    console.log(value.toUpperCase());
  }
}

// More complex type guard
interface User {
  name: string;
  email: string;
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    "email" in obj &&
    typeof (obj as User).name === "string" &&
    typeof (obj as User).email === "string"
  );
}
```

### Assertion functions

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected string");
  }
}

function process(value: unknown) {
  assertIsString(value);
  // After assertion, TypeScript knows value is string
  console.log(value.toUpperCase());
}

// Assert non-null
function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error("Value is not defined");
  }
}
```

---

## 4. Discriminated Unions

Unions with a common "tag" property for easy narrowing:

```typescript
// Each type has a unique "type" property
type Shape =
  | { type: "circle"; radius: number }
  | { type: "rectangle"; width: number; height: number }
  | { type: "triangle"; base: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.type) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}
```

### Exhaustiveness checking

```typescript
function getArea(shape: Shape): number {
  switch (shape.type) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      // This ensures all cases are handled
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// If you add a new shape type and forget to handle it,
// TypeScript will error on the never assignment
```


### Real-world example: API responses

```typescript
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${JSON.stringify(response.data)}`;
    case "error":
      return `Error: ${response.error}`;
  }
}

// Redux-style actions
type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "SET"; payload: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    case "SET":
      return action.payload;
  }
}
```

---

## 5. Intersection Types

Combine multiple types into one:

```typescript
type HasName = { name: string };
type HasAge = { age: number };
type HasEmail = { email: string };

// Intersection: must have all properties
type Person = HasName & HasAge & HasEmail;

const person: Person = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

// Extending interfaces (similar effect)
interface Employee extends HasName, HasAge {
  employeeId: string;
}
```

### Intersection with functions

```typescript
type Logger = {
  log: (message: string) => void;
};

type Formatter = {
  format: (data: unknown) => string;
};

type LoggerWithFormatter = Logger & Formatter;

const logger: LoggerWithFormatter = {
  log: (message) => console.log(message),
  format: (data) => JSON.stringify(data)
};
```

---

## 6. keyof and Indexed Access Types

### keyof operator

```typescript
interface Person {
  name: string;
  age: number;
  email: string;
}

type PersonKeys = keyof Person;
// "name" | "age" | "email"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person: Person = { name: "Alice", age: 30, email: "a@b.com" };
const name = getProperty(person, "name");  // string
const age = getProperty(person, "age");    // number
```

### Indexed access types

```typescript
type PersonName = Person["name"];  // string
type PersonAge = Person["age"];    // number

// Access multiple properties
type NameOrAge = Person["name" | "age"];  // string | number

// Access all values
type PersonValues = Person[keyof Person];  // string | number
```

### Array element type

```typescript
const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" }
];

type User = typeof users[number];
// { name: string; role: string; }
```


---

## 7. Mapped Types

Transform properties of a type:

```typescript
// Make all properties optional
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Make all properties required
type Required<T> = {
  [K in keyof T]-?: T[K];  // -? removes optional
};

// Make all properties readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Make all properties mutable
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];  // -readonly removes readonly
};
```

### Custom mapped types

```typescript
// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Wrap all properties in Promise
type Async<T> = {
  [K in keyof T]: Promise<T[K]>;
};

// Create getters
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }
```

---

## 8. Conditional Types

Types that depend on conditions:

```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Extract return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type FnReturn = ReturnType<() => string>;  // string

// Extract array element type
type ElementType<T> = T extends (infer E)[] ? E : never;

type Elem = ElementType<string[]>;  // string
```

### Distributive conditional types

```typescript
// Conditional types distribute over unions
type ToArray<T> = T extends any ? T[] : never;

type Result = ToArray<string | number>;
// string[] | number[]  (not (string | number)[])

// Prevent distribution with tuple
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type Result2 = ToArrayNonDist<string | number>;
// (string | number)[]
```

### infer keyword

```typescript
// Extract promise value type
type Awaited<T> = T extends Promise<infer U> ? U : T;

type A = Awaited<Promise<string>>;  // string
type B = Awaited<string>;           // string

// Extract function parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

type Params = Parameters<(a: string, b: number) => void>;
// [a: string, b: number]

// Extract first parameter
type FirstParam<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never;
```


---

## 9. Template Literal Types

String manipulation at the type level:

```typescript
// Basic template literal type
type Greeting = `Hello, ${string}!`;

const g1: Greeting = "Hello, World!";  // ✅
const g2: Greeting = "Hi, World!";     // ❌

// Combining with unions
type Color = "red" | "green" | "blue";
type Size = "small" | "medium" | "large";

type ColorSize = `${Color}-${Size}`;
// "red-small" | "red-medium" | "red-large" | "green-small" | ...

// Event names
type EventName = `on${Capitalize<"click" | "focus" | "blur">}`;
// "onClick" | "onFocus" | "onBlur"
```

### Built-in string manipulation types

```typescript
type Upper = Uppercase<"hello">;      // "HELLO"
type Lower = Lowercase<"HELLO">;      // "hello"
type Cap = Capitalize<"hello">;       // "Hello"
type Uncap = Uncapitalize<"Hello">;   // "hello"
```

---

## 10. Practical Examples

### Type-safe event system

```typescript
type EventMap = {
  click: { x: number; y: number };
  keypress: { key: string; code: number };
  submit: { data: FormData };
};

type EventHandler<T> = (event: T) => void;

class TypedEventEmitter<Events extends Record<string, any>> {
  private handlers: Partial<{
    [K in keyof Events]: EventHandler<Events[K]>[];
  }> = {};

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event]!.push(handler);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.handlers[event]?.forEach(handler => handler(data));
  }
}

const emitter = new TypedEventEmitter<EventMap>();

emitter.on("click", (e) => {
  console.log(e.x, e.y);  // TypeScript knows the shape
});

emitter.emit("click", { x: 100, y: 200 });
```

### Builder pattern with types

```typescript
type QueryState = {
  table?: string;
  columns?: string[];
  where?: string;
  orderBy?: string;
  limit?: number;
};

class QueryBuilder<State extends QueryState = {}> {
  private state: State;

  constructor(state: State = {} as State) {
    this.state = state;
  }

  from<T extends string>(table: T): QueryBuilder<State & { table: T }> {
    return new QueryBuilder({ ...this.state, table });
  }

  select<T extends string[]>(...columns: T): QueryBuilder<State & { columns: T }> {
    return new QueryBuilder({ ...this.state, columns });
  }

  where(condition: string): QueryBuilder<State & { where: string }> {
    return new QueryBuilder({ ...this.state, where: condition });
  }

  build(this: QueryBuilder<{ table: string; columns: string[] }>): string {
    const { table, columns, where } = this.state as any;
    let query = `SELECT ${columns.join(", ")} FROM ${table}`;
    if (where) query += ` WHERE ${where}`;
    return query;
  }
}

const query = new QueryBuilder()
  .from("users")
  .select("name", "email")
  .where("active = true")
  .build();
```

---

## Quick Reference

### Type Narrowing
```typescript
typeof x === "string"     // Primitive check
x instanceof Class        // Instance check
"prop" in obj            // Property check
x === y                  // Equality check
```

### Type Guards
```typescript
function isType(x: unknown): x is Type { }     // Type predicate
function assert(x: unknown): asserts x is Type { }  // Assertion
```

### Discriminated Unions
```typescript
type Result = 
  | { type: "success"; data: T }
  | { type: "error"; error: string };
```

### Mapped Types
```typescript
{ [K in keyof T]: NewType }     // Transform properties
{ [K in keyof T]?: T[K] }       // Make optional
{ readonly [K in keyof T]: T[K] }  // Make readonly
```

### Conditional Types
```typescript
T extends U ? X : Y             // Conditional
T extends (infer U)[] ? U : T   // Infer element type
```

---

## Exercises

1. **Type guard:** Write a type guard for checking if a value is a non-empty array.

2. **Discriminated union:** Create a Result type with success/error variants and a function to handle both.

3. **Mapped type:** Create a type that makes all properties of an object nullable.

4. **Conditional type:** Create a type that extracts the resolved type from a Promise.

5. **Event system:** Build a type-safe event emitter with typed events.
