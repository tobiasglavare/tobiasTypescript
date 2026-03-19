# Chapter 8: Error Handling & Modules

This document covers error handling patterns and module organization in TypeScript. Good error handling is the difference between an app that crashes mysteriously and one that fails gracefully with useful information. And modules are how you organize code so it doesn't become an unmanageable mess as your project grows.

---

## 1. JavaScript Error Basics

### The Error object

```typescript
// Creating errors
const error = new Error("Something went wrong");

console.log(error.message);  // "Something went wrong"
console.log(error.name);     // "Error"
console.log(error.stack);    // Stack trace

// Throwing errors
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}
```

### Built-in error types

```typescript
throw new Error("Generic error");
throw new TypeError("Expected a string");
throw new RangeError("Value out of range");
throw new ReferenceError("Variable not defined");
throw new SyntaxError("Invalid syntax");
```

---

## 2. try/catch/finally

`try/catch` is how you handle errors at runtime. Wrap risky code in `try`, handle failures in `catch`, and use `finally` for cleanup that must run regardless (closing connections, releasing resources). One important TypeScript detail: the `error` in `catch` is typed as `unknown` by default, so you need to narrow it before using it:
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  } finally {
    // Always runs, even if error thrown
    console.log("Parse attempt complete");
  }
}

// Typed catch (TypeScript 4.4+)
try {
  riskyOperation();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log("Unknown error:", error);
  }
}
```

### Re-throwing errors

```typescript
function processData(data: string): Result {
  try {
    return parse(data);
  } catch (error) {
    // Log and re-throw
    console.error("Processing failed:", error);
    throw error;
  }
}

// Or wrap in new error
function processData(data: string): Result {
  try {
    return parse(data);
  } catch (error) {
    throw new Error(`Failed to process data: ${error}`);
  }
}
```

---

## 3. Custom Error Classes

Built-in errors like `Error` and `TypeError` are generic — they only carry a message. In a real application, you want errors that carry structured information: an HTTP status code, an error code your frontend can switch on, which field failed validation. Custom error classes let you create a hierarchy of errors that are easy to catch and handle specifically:
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// With additional properties
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Usage
function fetchUser(id: string): Promise<User> {
  throw new ApiError("User not found", 404, "USER_NOT_FOUND");
}

try {
  await fetchUser("123");
} catch (error) {
  if (error instanceof ApiError) {
    if (error.statusCode === 404) {
      console.log("User doesn't exist");
    }
  }
}
```


### Error hierarchy

```typescript
// Base application error
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, "NOT_FOUND");
  }
}

class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message, "VALIDATION_ERROR");
  }
}

class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, "AUTH_ERROR");
  }
}

// Usage
throw new NotFoundError("User", "123");
throw new ValidationError("Email is required", "email");
```

---

## 4. Result Type Pattern

Exceptions are great for unexpected failures (network down, disk full), but for expected failures (invalid input, item not found), they can be overkill. The Result type pattern makes failure an explicit part of your function's return type — the caller can see at a glance that this function might fail, and TypeScript forces them to handle both cases. No more forgotten try/catch blocks:

```typescript
// Result type definition
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Helper functions
function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Usage
interface ParseError {
  line: number;
  message: string;
}

function parseConfig(content: string): Result<Config, ParseError> {
  try {
    const config = JSON.parse(content);
    if (!config.version) {
      return err({ line: 1, message: "Missing version" });
    }
    return ok(config);
  } catch {
    return err({ line: 0, message: "Invalid JSON" });
  }
}

// Handling results
const result = parseConfig(fileContent);

if (result.ok) {
  console.log("Config loaded:", result.value);
} else {
  console.error(`Error at line ${result.error.line}: ${result.error.message}`);
}
```

### Step by step: Result type

```typescript
// The Result type is a discriminated union — just like the ones in chapter 6.
// The `ok` property is the discriminant (tag).

type Result<T, E = Error> =
  | { ok: true; value: T }     // success variant — carries the data
  | { ok: false; error: E };   // failure variant — carries the error

// Helper functions to create Results cleanly:
function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}
function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Now let's use it in a real function:
function parsePort(input: string): Result<number, string> {
  //                                       ↑        ↑
  //                              success type   error type

  const port = parseInt(input, 10);

  if (isNaN(port)) {
    return err(`"${input}" is not a number`);
    // Returns { ok: false, error: '"abc" is not a number' }
  }

  if (port < 1 || port > 65535) {
    return err(`Port ${port} is out of range (1-65535)`);
    // Returns { ok: false, error: 'Port 99999 is out of range (1-65535)' }
  }

  return ok(port);
  // Returns { ok: true, value: 3000 }
}

// The caller MUST handle both cases — TypeScript enforces it:
const result = parsePort("3000");

if (result.ok) {
  // TypeScript narrows to { ok: true; value: number }
  // result.value is number ✅
  startServer(result.value);
  // result.error  ❌ doesn't exist on this variant
} else {
  // TypeScript narrows to { ok: false; error: string }
  // result.error is string ✅
  console.error(result.error);
  // result.value  ❌ doesn't exist on this variant
}

// Compare with exceptions:
// - With try/catch, nothing in the function signature tells you it can fail.
// - With Result, the return type makes failure explicit.
// - The caller can't accidentally forget to handle the error —
//   they have to check `ok` before they can access `value`.
```

### Result utilities

```typescript
// Map over success value
function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (result.ok) {
    return ok(fn(result.value));
  }
  return result;
}

// Chain results
function flatMapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  if (result.ok) {
    return fn(result.value);
  }
  return result;
}

// Unwrap with default
function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue;
}

// Usage
const config = unwrapOr(parseConfig(content), defaultConfig);
```

---

## 5. Async Error Handling

```typescript
// With try/catch
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}`,
        response.status,
        "HTTP_ERROR"
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error", 0, "NETWORK_ERROR");
  }
}

// With Result type
async function fetchUserSafe(id: string): Promise<Result<User, ApiError>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      return err(new ApiError(`HTTP ${response.status}`, response.status, "HTTP_ERROR"));
    }
    
    const user = await response.json();
    return ok(user);
  } catch {
    return err(new ApiError("Network error", 0, "NETWORK_ERROR"));
  }
}
```


---

## 6. ES Modules Basics

Modules are how you split code into separate files and control what's visible to other files. Without modules, everything lives in a global scope and name collisions are inevitable. With modules, each file is its own scope — you explicitly `export` what you want to share and `import` what you need. This is the standard module system in modern JavaScript and TypeScript.

### Exporting

```typescript
// Named exports
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export class Calculator {
  // ...
}

export interface Config {
  // ...
}

// Export at end of file
const subtract = (a: number, b: number) => a - b;
const multiply = (a: number, b: number) => a * b;

export { subtract, multiply };

// Rename on export
export { subtract as sub, multiply as mul };
```

### Default exports

```typescript
// Default export (one per file)
export default class UserService {
  // ...
}

// Or
class UserService { }
export default UserService;

// Default + named exports
export default class Main { }
export const helper = () => { };
```

### Importing

```typescript
// Named imports
import { add, subtract } from "./math";
import { add as addition } from "./math";

// Import all as namespace
import * as math from "./math";
math.add(1, 2);

// Default import
import UserService from "./UserService";

// Default + named
import UserService, { helper } from "./UserService";

// Import for side effects only
import "./polyfills";
```

---

## 7. Module Organization

As projects grow, you need a strategy for organizing files. Barrel files (`index.ts`) are a common pattern — they re-export from multiple files so consumers can import from a single path instead of knowing the internal file structure. This keeps your imports clean and lets you reorganize internals without breaking consumers:

```typescript
// utils/string.ts
export function capitalize(s: string): string { }
export function truncate(s: string, len: number): string { }

// utils/number.ts
export function clamp(n: number, min: number, max: number): number { }
export function round(n: number, decimals: number): number { }

// utils/index.ts (barrel file)
export * from "./string";
export * from "./number";

// Or selective re-exports
export { capitalize, truncate } from "./string";
export { clamp } from "./number";

// Usage
import { capitalize, clamp } from "./utils";
```

### Project structure

```
src/
├── index.ts              # Entry point
├── types/
│   └── index.ts          # Shared type definitions
├── utils/
│   ├── index.ts          # Barrel file
│   ├── string.ts
│   └── number.ts
├── services/
│   ├── index.ts
│   ├── userService.ts
│   └── apiService.ts
├── models/
│   ├── index.ts
│   ├── user.ts
│   └── post.ts
└── errors/
    ├── index.ts
    ├── base.ts
    └── api.ts
```

---

## 8. Type-Only Imports/Exports

When you import an interface or type alias, it only exists at compile time — there's nothing to import at runtime. Type-only imports make this explicit with `import type`. This isn't just cosmetic — it helps bundlers tree-shake better and prevents accidental runtime dependencies on files that only contain types:

```typescript
// types.ts
export interface User {
  id: string;
  name: string;
}

export type UserId = string;

// userService.ts
import type { User, UserId } from "./types";
// or
import { type User, type UserId } from "./types";

// These are erased at compile time - no runtime import
```

### When to use type-only imports

```typescript
// ✅ Use type-only for interfaces and type aliases
import type { Config } from "./config";

// ✅ Use regular import for values you need at runtime
import { DEFAULT_CONFIG } from "./config";

// ✅ Mixed
import { createConfig, type Config } from "./config";
```


---

## 9. Module Resolution

### tsconfig.json settings

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@utils/*": ["utils/*"],
      "@services/*": ["services/*"]
    }
  }
}
```

### Path aliases

```typescript
// Without aliases
import { formatDate } from "../../../utils/date";
import { UserService } from "../../services/user";

// With aliases
import { formatDate } from "@utils/date";
import { UserService } from "@services/user";
```

---

## 10. Practical Example: Error Module

```typescript
// errors/base.ts
export class AppError extends Error {
  public readonly timestamp: Date;
  
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    Error.captureStackTrace(this, this.constructor);
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

// errors/http.ts
import { AppError } from "./base";

export class HttpError extends AppError {
  constructor(
    message: string,
    statusCode: number,
    code: string = "HTTP_ERROR"
  ) {
    super(message, code, statusCode);
  }
}

export class NotFoundError extends HttpError {
  constructor(resource: string, id?: string) {
    const message = id 
      ? `${resource} with id '${id}' not found`
      : `${resource} not found`;
    super(message, 404, "NOT_FOUND");
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, 400, "BAD_REQUEST");
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

// errors/validation.ts
import { AppError } from "./base";

export interface FieldError {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly errors: FieldError[] = []
  ) {
    super(message, "VALIDATION_ERROR", 400);
  }
  
  static fromFields(errors: FieldError[]): ValidationError {
    const message = errors.map(e => `${e.field}: ${e.message}`).join(", ");
    return new ValidationError(message, errors);
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}

// errors/index.ts (barrel)
export { AppError } from "./base";
export { HttpError, NotFoundError, BadRequestError, UnauthorizedError } from "./http";
export { ValidationError, type FieldError } from "./validation";

// Usage in other files
import { NotFoundError, ValidationError } from "@/errors";

async function getUser(id: string): Promise<User> {
  const user = await db.users.find(id);
  if (!user) {
    throw new NotFoundError("User", id);
  }
  return user;
}

function validateUser(data: unknown): User {
  const errors: FieldError[] = [];
  
  if (!data.name) {
    errors.push({ field: "name", message: "Name is required" });
  }
  if (!data.email) {
    errors.push({ field: "email", message: "Email is required" });
  }
  
  if (errors.length > 0) {
    throw ValidationError.fromFields(errors);
  }
  
  return data as User;
}
```

---

## Quick Reference

### Error Handling
```typescript
// Custom error
class MyError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "MyError";
  }
}

// try/catch
try {
  riskyOperation();
} catch (error) {
  if (error instanceof MyError) { }
} finally {
  cleanup();
}

// Result type
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
```

### Module Syntax
```typescript
// Exports
export const x = 1;
export { a, b };
export default class { }
export type { MyType };

// Imports
import { x } from "./mod";
import * as mod from "./mod";
import Default from "./mod";
import type { MyType } from "./mod";
```

---

## Exercises

1. **Custom errors:** Create an error hierarchy for a REST API with NotFound, Validation, and Auth errors.

2. **Result type:** Implement a Result type with map, flatMap, and unwrapOr methods.

3. **Module organization:** Refactor a flat file structure into organized modules with barrel files.

4. **Error handler:** Create a centralized error handler that formats errors for API responses.

5. **Safe fetch:** Create a wrapper around fetch that returns Result instead of throwing.
