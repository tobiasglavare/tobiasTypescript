// Exercise: Type Guards
//
// Sometimes the built-in narrowing (typeof, instanceof, in) isn't enough.
// You can write your own functions that tell TypeScript "this value is type X."
// The magic is the return type: "value is SomeType" — this is called a type predicate.
//
// Tasks:
// 1. Implement isString() — type guard for strings
// 2. Implement isNonEmptyArray() — type guard for arrays with at least one element
// 3. Implement isServer() — type guard for a Server interface
// 4. Implement filterByType() — use a type guard to filter a mixed array

// Task 1: Is string
// Write a type guard that checks if a value is a string.
// The return type should be "value is string"
//
// Example: isString("hello") returns true
// Example: isString(42) returns false
// Example: isString(null) returns false
function isString(value: unknown): value is string {
    return typeof value === "string"
}

// Task 2: Is non-empty array
// Write a type guard that checks if a value is an array with at least one element.
// The return type should narrow to T[] (a non-empty array).
//
// Hint: Check Array.isArray() first, then check .length
//
// Example: isNonEmptyArray([1, 2, 3]) returns true
// Example: isNonEmptyArray([]) returns false
// Example: isNonEmptyArray("hello") returns false
function isNonEmptyArray<T>(value: unknown): value is T[] {
    return Array.isArray(value) && value.length > 0;
    // Your code here
}

// Task 3: Is server
// Write a type guard that checks if an unknown value matches the Server interface.
// You need to check: it's an object, not null, has "host" (string) and "port" (number).
//
// Example: isServer({ host: "localhost", port: 3000 }) returns true
// Example: isServer({ host: "localhost" }) returns false (missing port)
// Example: isServer("localhost:3000") returns false (not an object)
// Example: isServer(null) returns false

interface Server {
    host: string;
    port: number;
}

function isServer(value: unknown): value is Server {
    // Check: typeof === "object", not null, has host (string), has port (number)
    // Your code here
}

// Task 4: Filter by type
// Given a mixed array of strings and numbers, return only the strings.
// Use your isString type guard with .filter()
//
// Example: filterStrings(["hello", 42, "world", 7]) returns ["hello", "world"]
// Example: filterStrings([1, 2, 3]) returns []
function filterStrings(items: (string | number)[]): string[] {
    // Use .filter() with your isString type guard
    // Your code here
}

// Test your implementations:
// console.log(isString("hello"));           // true
// console.log(isString(42));                // false
// console.log(isNonEmptyArray([1, 2]));     // true
// console.log(isNonEmptyArray([]));         // false
// console.log(isServer({ host: "localhost", port: 3000 }));  // true
// console.log(isServer({ host: "localhost" }));               // false
// console.log(filterStrings(["hello", 42, "world", 7]));     // ["hello", "world"]
