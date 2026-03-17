// Exercise: Type Narrowing
//
// TypeScript can figure out what type a value is based on checks you write.
// This is called "narrowing" — you start with a broad type and narrow it down.
//
// Tasks:
// 1. Implement describeValue() — uses typeof to handle string | number | boolean
// 2. Implement formatInput() — uses typeof to handle string | number, returns string
// 3. Implement processDate() — uses instanceof to handle Date | string
// 4. Implement describeAnimal() — uses "in" operator to check for properties

// Task 1: Describe a value
// Given a value that could be string, number, or boolean,
// return a description of what it is.
//
// Example: describeValue("hello") returns "Text: hello"
// Example: describeValue(42) returns "Number: 42"
// Example: describeValue(true) returns "Boolean: true"
function describeValue(value: string | number | boolean): string {
    if (typeof value === "string") {
        return `Text: ${value}`
    } else if (typeof value === "number") {
        return `Number: ${value}`
    } else {
        return `Boolean: ${value}`
    }
}

// Task 2: Format input
// Given a string or number, always return a formatted string.
// If it's a string, return it uppercased.
// If it's a number, return it with 2 decimal places.
//
// Example: formatInput("hello") returns "HELLO"
// Example: formatInput(3.14159) returns "3.14"
// Example: formatInput(42) returns "42.00"
function formatInput(input: string | number): string {
    if (typeof input === "string") {
        return input.toUpperCase()
    } else {
        return input.toFixed(2)
    }
}

// Task 3: Process date
// Given a Date object or a date string, return an ISO string.
// Use instanceof to check if it's a Date.
//
// Example: processDate(new Date("2024-01-01")) returns "2024-01-01T00:00:00.000Z"
// Example: processDate("2024-01-01") returns "2024-01-01T00:00:00.000Z"
function processDate(date: Date | string): string {
    if (date instanceof Date) {
        return date.toISOString();
    } else {
        return new Date(date).toISOString();
    }
}

// Task 4: Describe animal
// Use the "in" operator to check what properties exist.
//
// type Fish = { name: string; swim: () => string };
// type Bird = { name: string; fly: () => string };
// type Dog = { name: string; bark: () => string };
//
// Example: describeAnimal({ name: "Nemo", swim: () => "splash" }) returns "Nemo can swim"
// Example: describeAnimal({ name: "Tweety", fly: () => "flap" }) returns "Tweety can fly"
// Example: describeAnimal({ name: "Rex", bark: () => "woof" }) returns "Rex can bark"

type Fish = { name: string; swim: () => string };
type Bird = { name: string; fly: () => string };
type Dog = { name: string; bark: () => string };

type Animal = Fish | Bird | Dog;

function describeAnimal(animal: Animal): string {
    if ("swim" in animal) {
        return `${animal.name} can swim`
    } else if ("fly" in animal) {
        return `${animal.name} can fly`
    }else {
        return `${animal.name} can bark`
    }
}

// Test your implementations:
// console.log(describeValue("hello"));       // "Text: hello"
// console.log(describeValue(42));            // "Number: 42"
// console.log(describeValue(true));          // "Boolean: true"
// console.log(formatInput("hello"));         // "HELLO"
// console.log(formatInput(3.14159));         // "3.14"
// console.log(processDate(new Date("2024-01-01")));  // ISO string
// console.log(processDate("2024-01-01"));    // ISO string
// console.log(describeAnimal({ name: "Nemo", swim: () => "splash" }));  // "Nemo can swim"
