# Chapter 5: Generics

This document covers TypeScript generics — writing reusable, type-safe code.

---

## 1. What Are Generics?

Imagine you write a function that returns the first element of an array. Without generics, you'd either have to write separate versions for `string[]`, `number[]`, etc., or use `any` and lose all type safety. Generics solve this by letting you write one function that works with any type while still knowing exactly what type you're dealing with:

```typescript
// Without generics: lose type information
function identity(value: any): any {
  return value;
}
const result = identity("hello");  // result is any 😢

// With generics: preserve type information
function identity<T>(value: T): T {
  return value;
}
const result = identity("hello");  // result is string 😊
const num = identity(42);          // num is number
```

Think of `<T>` as a type variable — a placeholder for a type that gets filled in when you use the function.

---

## 2. Generic Functions

### Basic syntax

```typescript
// Single type parameter
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

first([1, 2, 3]);        // number | undefined
first(["a", "b", "c"]);  // string | undefined

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

pair("hello", 42);  // [string, number]
pair(true, [1, 2]); // [boolean, number[]]
```

### Explicit type arguments

```typescript
// Usually TypeScript infers the type
const nums = first([1, 2, 3]);  // Inferred as number | undefined

// Sometimes you need to be explicit
const empty = first<string>([]);  // string | undefined

// Useful when inference fails
function create<T>(): T[] {
  return [];
}
const strings = create<string>();  // string[]
```


### Arrow function generics

```typescript
// Regular syntax
const identity = <T>(value: T): T => value;

// In JSX files, use trailing comma to avoid confusion with JSX
const identity = <T,>(value: T): T => value;

// Or use extends
const identity = <T extends unknown>(value: T): T => value;
```

---

## 3. Generic Interfaces and Types

### Generic interfaces

```typescript
// Generic interface
interface Container<T> {
  value: T;
  getValue(): T;
}

const stringContainer: Container<string> = {
  value: "hello",
  getValue() { return this.value; }
};

// Generic interface with multiple parameters
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

const pair: KeyValuePair<string, number> = {
  key: "age",
  value: 30
};
```

### Generic type aliases

```typescript
// Generic type alias
type Result<T> = {
  success: boolean;
  data: T;
};

type ApiResponse<T> = {
  data: T;
  status: number;
  timestamp: Date;
};

// Usage
const userResponse: ApiResponse<User> = {
  data: { name: "Alice", age: 30 },
  status: 200,
  timestamp: new Date()
};
```

### Generic function types

```typescript
// Function type with generic
type Transformer<T, U> = (input: T) => U;

const stringify: Transformer<number, string> = (n) => n.toString();
const parse: Transformer<string, number> = (s) => parseInt(s);

// Generic callback type
type Callback<T> = (error: Error | null, result?: T) => void;
```

---

## 4. Generic Constraints

Without constraints, a generic type `T` could be anything — a string, a number, an object, undefined. Sometimes you need to guarantee that `T` has certain properties. Constraints with `extends` let you say "T can be any type, as long as it has these features." This gives you the flexibility of generics with the safety of knowing what you can do with the value:

```typescript
// Must have a length property
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

logLength("hello");     // ✅ string has length
logLength([1, 2, 3]);   // ✅ array has length
logLength({ length: 5 }); // ✅ object with length
logLength(123);         // ❌ number has no length

// Must be an object with specific property
interface HasId {
  id: string;
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// Constrain to specific types
function process<T extends string | number>(value: T): T {
  return value;
}
```

### keyof constraint

```typescript
// Key must be a property of the object
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30 };

getProperty(person, "name");  // string
getProperty(person, "age");   // number
getProperty(person, "email"); // ❌ Error: "email" not in keyof person
```

### Step by step: keyof constraint

```typescript
// Let's trace what TypeScript does with this generic function:

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// When you call it:
const server = { host: "localhost", port: 3000, env: "prod" };
const host = getProperty(server, "host");

// Here's what TypeScript figures out:
// 1. T is inferred as { host: string; port: number; env: string }
//    (from the `server` argument)
//
// 2. keyof T becomes "host" | "port" | "env"
//    (the union of all property names)
//
// 3. K extends keyof T means K must be one of those three strings.
//    We passed "host", so K = "host" ✅
//
// 4. The return type T[K] becomes T["host"] which is string.
//    So `host` is typed as string — not string | number | string.
//
// 5. If you tried getProperty(server, "missing"):
//    K would be "missing", which doesn't extend "host" | "port" | "env"
//    → TypeScript error at compile time. You can't access a key that doesn't exist.

// This is why the pattern is so useful: the return type changes
// based on which key you pass in. TypeScript tracks it all for you.
const port = getProperty(server, "port");   // number (not string | number)
const env = getProperty(server, "env");     // string
```


---

## 5. Generic Classes

Generics aren't just for functions — classes benefit from them too. A generic class lets you build reusable data structures (like stacks, queues, repositories) that work with any type while keeping full type safety. You define the type when you create an instance, and every method on that instance knows the exact type it's working with:
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.pop();  // 2

const stringStack = new Stack<string>();
stringStack.push("hello");
```

### Generic class with constraints

```typescript
interface Identifiable {
  id: string;
}

class Repository<T extends Identifiable> {
  private items: Map<string, T> = new Map();
  
  add(item: T): void {
    this.items.set(item.id, item);
  }
  
  get(id: string): T | undefined {
    return this.items.get(id);
  }
  
  remove(id: string): boolean {
    return this.items.delete(id);
  }
  
  getAll(): T[] {
    return Array.from(this.items.values());
  }
}

interface User extends Identifiable {
  name: string;
  email: string;
}

const userRepo = new Repository<User>();
userRepo.add({ id: "1", name: "Alice", email: "alice@example.com" });
```

---

## 6. Default Type Parameters

Sometimes a generic type has a "most common" case. Default type parameters let you provide a fallback type so callers don't have to specify it every time. It works just like default function parameters — use the default when no type is given, override it when you need something specific:
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

// Can omit type argument
const response: ApiResponse = { data: "anything", status: 200 };

// Or specify it
const userResponse: ApiResponse<User> = { data: user, status: 200 };

// Multiple defaults
type Container<T = string, U = number> = {
  value: T;
  count: U;
};

const c1: Container = { value: "hello", count: 5 };
const c2: Container<boolean> = { value: true, count: 10 };
const c3: Container<boolean, string> = { value: true, count: "many" };
```

---

## 7. Built-in Utility Types

TypeScript ships with a set of generic utility types that handle common type transformations. Rather than manually rewriting types, these let you derive new types from existing ones. They're used constantly in real codebases — knowing them saves a lot of boilerplate:

### `Partial<T>`
Makes all properties optional. This is extremely useful for update functions where you only want to change some fields — you don't want to require every property just to update one:

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<User>;
// { name?: string; email?: string; age?: number; }

function updateUser(id: string, updates: Partial<User>) {
  // Can pass any subset of User properties
}

updateUser("1", { name: "Bob" });  // ✅ OK
updateUser("1", { age: 31 });      // ✅ OK
```

### `Required<T>`
Make all properties required:

```typescript
interface Config {
  host?: string;
  port?: number;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number; }
```

### `Readonly<T>`
Make all properties readonly:

```typescript
interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }

const user: ReadonlyUser = { name: "Alice", age: 30 };
user.name = "Bob";  // ❌ Error: Cannot assign to 'name'
```

### `Pick<T, K>`
Creates a new type with only the specified properties. Useful when you want to expose a subset of an object — like returning user data without sensitive fields:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Pick<User, "id" | "name" | "email">;
// { id: string; name: string; email: string; }
```

### `Omit<T, K>`
The opposite of `Pick` — creates a type with everything except the specified properties. Often more convenient when you want to remove just one or two fields:

```typescript
type PublicUser = Omit<User, "password">;
// { id: string; name: string; email: string; }

type UserWithoutId = Omit<User, "id" | "password">;
// { name: string; email: string; }
```


### `Record<K, V>`
Creates an object type where all keys are of type `K` and all values are of type `V`. Handy for lookup tables, dictionaries, and any time you need a typed key-value mapping:

```typescript
type UserRoles = Record<string, boolean>;
// { [key: string]: boolean }

type StatusCodes = Record<"ok" | "error" | "pending", number>;
// { ok: number; error: number; pending: number; }

const codes: StatusCodes = {
  ok: 200,
  error: 500,
  pending: 202
};
```

### `Extract<T, U>` and `Exclude<T, U>`

```typescript
type AllTypes = string | number | boolean | null;

// Extract: keep types assignable to U
type StringOrNumber = Extract<AllTypes, string | number>;
// string | number

// Exclude: remove types assignable to U
type NonNull = Exclude<AllTypes, null>;
// string | number | boolean
```

### `NonNullable<T>`

```typescript
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>;
// string
```

### `ReturnType<T>` and `Parameters<T>`

```typescript
function createUser(name: string, age: number): User {
  return { name, age };
}

type CreateUserReturn = ReturnType<typeof createUser>;
// User

type CreateUserParams = Parameters<typeof createUser>;
// [name: string, age: number]
```

---

## 8. Practical Examples

### Generic data store

```typescript
interface Store<T> {
  get(id: string): T | undefined;
  set(id: string, value: T): void;
  delete(id: string): boolean;
  list(): T[];
  find(predicate: (item: T) => boolean): T | undefined;
}

function createStore<T>(): Store<T> {
  const data = new Map<string, T>();
  
  return {
    get: (id) => data.get(id),
    set: (id, value) => { data.set(id, value); },
    delete: (id) => data.delete(id),
    list: () => Array.from(data.values()),
    find: (predicate) => Array.from(data.values()).find(predicate),
  };
}

// Usage
interface User { name: string; email: string; }
const userStore = createStore<User>();
userStore.set("1", { name: "Alice", email: "alice@example.com" });
```

### Generic API client

```typescript
interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<T, U>(url: string, data: U): Promise<T>;
  put<T, U>(url: string, data: U): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

const api: ApiClient = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);
    return response.json();
  },
  async post<T, U>(url: string, data: U): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  },
  // ... put, delete
};

// Usage with type inference
const user = await api.get<User>("/api/users/1");
const newUser = await api.post<User, CreateUserDTO>("/api/users", { name: "Bob" });
```


### Generic event emitter

```typescript
type EventMap = Record<string, any>;

class EventEmitter<Events extends EventMap> {
  private listeners: {
    [K in keyof Events]?: Array<(data: Events[K]) => void>;
  } = {};
  
  on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }
  
  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.listeners[event]?.forEach(listener => listener(data));
  }
}

// Define your events
interface AppEvents {
  userLoggedIn: { userId: string; timestamp: Date };
  userLoggedOut: { userId: string };
  error: { message: string; code: number };
}

const emitter = new EventEmitter<AppEvents>();

emitter.on("userLoggedIn", (data) => {
  console.log(data.userId);  // TypeScript knows the shape!
});

emitter.emit("userLoggedIn", { userId: "123", timestamp: new Date() });
```

---

## Quick Reference

### Generic Syntax
```typescript
function fn<T>(arg: T): T { }           // Generic function
interface I<T> { value: T; }            // Generic interface
type T<U> = { data: U; }                // Generic type alias
class C<T> { item: T; }                 // Generic class
```

### Constraints
```typescript
<T extends SomeType>                    // Must extend type
<T extends { prop: Type }>              // Must have property
<K extends keyof T>                     // Must be key of T
```

### Utility Types
```typescript
Partial<T>          // All optional
Required<T>         // All required
Readonly<T>         // All readonly
Pick<T, K>          // Select properties
Omit<T, K>          // Remove properties
Record<K, V>        // Object with K keys, V values
Extract<T, U>       // Keep assignable to U
Exclude<T, U>       // Remove assignable to U
NonNullable<T>      // Remove null/undefined
ReturnType<F>       // Function return type
Parameters<F>       // Function parameter types
```

---

## Exercises

1. **Generic identity:** Write a generic function that returns its argument unchanged.

2. **Generic array utilities:** Create `first<T>`, `last<T>`, and `unique<T>` functions.

3. **Generic store:** Build a key-value store with get, set, delete, and list methods.

4. **Type-safe pick:** Create a function that picks specific properties from an object.

5. **Generic result type:** Implement a `Result<T, E>` type for error handling without exceptions.

