// Exercise: Discriminated Unions
//
// A discriminated union is when each variant of a union has a common
// "tag" property (like "type" or "kind") with a unique literal value.
// TypeScript can use that tag to narrow the type in a switch/if.
//
// Think of it like: each variant wears a name tag so you always know which one it is.
//
// Tasks:
// 1. Implement describeShape() — handle circle, rectangle, triangle
// 2. Implement handleResult() — handle success/error Result type
// 3. Implement processAction() — handle a set of infra deployment actions

// Task 1: Describe shape
// Given a Shape, return a string describing it with its area.
//
// type Shape =
//   | { type: "circle"; radius: number }
//   | { type: "rectangle"; width: number; height: number }
//   | { type: "triangle"; base: number; height: number };
//
// Example: describeShape({ type: "circle", radius: 5 })
//   returns "Circle with area 78.54"
// Example: describeShape({ type: "rectangle", width: 4, height: 6 })
//   returns "Rectangle with area 24.00"
// Example: describeShape({ type: "triangle", base: 10, height: 5 })
//   returns "Triangle with area 25.00"
//
// Hint: Use switch on shape.type
// Hint: Circle area = Math.PI * radius² — use ** for exponent
// Hint: Triangle area = (base * height) / 2
// Hint: Use .toFixed(2) to format to 2 decimal places

type Shape =
  | { type: "circle"; radius: number }
  | { type: "rectangle"; width: number; height: number }
  | { type: "triangle"; base: number; height: number };

function describeShape(shape: Shape): string {
  switch (shape.type) {
    case "circle":
      return `Circle with area ${(Math.PI * shape.radius ** 2).toFixed(2)}`
    
    case "rectangle":
      return `Rectangle with area ${(shape.width * shape.height).toFixed(2)}`
    
    case "triangle":
      return `Triangle with area ${((shape.base * shape.height)/2).toFixed(2)}`
  }
}

// Task 2: Handle result
// A common pattern: a Result type that's either success or error.
// Write a function that returns the data on success, or throws on error.
//
// Example: handleResult({ status: "success", data: "hello" }) returns "hello"
// Example: handleResult({ status: "error", error: "oops" }) throws Error("oops")

type Result<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handleResult<T>(result: Result<T>): T {
  if (result.status === "success") {
    return result.data
  } else {
    throw new Error(result.error)
  }
}

// Task 3: Process deployment action
// Given an infra action, return a description of what will happen.
//
// Example: processAction({ action: "deploy", service: "api", version: "1.2.0" })
//   returns "Deploying api version 1.2.0"
// Example: processAction({ action: "rollback", service: "api", previousVersion: "1.1.0" })
//   returns "Rolling back api to 1.1.0"
// Example: processAction({ action: "scale", service: "api", replicas: 3 })
//   returns "Scaling api to 3 replicas"

type DeployAction =
  | { action: "deploy"; service: string; version: string }
  | { action: "rollback"; service: string; previousVersion: string }
  | { action: "scale"; service: string; replicas: number };

function processAction(action: DeployAction): string {
  switch (action.action) {
    case "deploy":
      return `Deploying ${action.service} version ${action.version}`

    case "rollback":
      return `Rolling back ${action.service} to ${action.previousVersion}`
    
    case "scale":
      return `Scaling ${action.service} to ${action.replicas} replicas`
  }
}

// Test your implementations:
// console.log(describeShape({ type: "circle", radius: 5 }));
// console.log(describeShape({ type: "rectangle", width: 4, height: 6 }));
// console.log(describeShape({ type: "triangle", base: 10, height: 5 }));
// console.log(handleResult({ status: "success", data: "hello" }));
// console.log(processAction({ action: "deploy", service: "api", version: "1.2.0" }));
// console.log(processAction({ action: "rollback", service: "api", previousVersion: "1.1.0" }));
// console.log(processAction({ action: "scale", service: "api", replicas: 3 }));
