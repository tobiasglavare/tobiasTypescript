// Exercise: keyof and Indexed Access Types
//
// keyof gives you a union of all property names of a type.
// Indexed access (Type["key"]) gives you the type of a specific property.
// Together they let you write very precise generic functions.
//
// Tasks:
// 1. Implement pluck() — extract an array of values for a given key
// 2. Implement pick() — create a new object with only selected keys
// 3. Create types using indexed access

// Task 1: Pluck
// Given an array of objects and a key, return an array of just that property's values.
// Use keyof to constrain the key parameter.
//
// Example:
//   const servers = [
//     { name: "web", region: "us-east-1", port: 80 },
//     { name: "api", region: "eu-west-1", port: 3000 },
//   ];
//   pluck(servers, "name") returns ["web", "api"]
//   pluck(servers, "port") returns [80, 3000]
//   pluck(servers, "missing") should NOT compile
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
    // Hint: use .map() to extract the property from each item
    return items.map(item => item[key])
}

// Task 2: Pick (manual implementation)
// Given an object and an array of keys, return a new object with only those keys.
// This is basically what the built-in Pick<T, K> utility type does, but as a function.
//
// Example:
//   const server = { name: "web", region: "us-east-1", port: 80, env: "prod" };
//   pick(server, ["name", "port"]) returns { name: "web", port: 80 }
//
// Hint: Create an empty object, loop through the keys, copy each property
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const picked = {} as Pick<T, K>;
    for (const k of keys){
    }
    return picked
}

// Task 3: Indexed access types
// Use indexed access to create these types from the ServerConfig interface.
// No code to write — just fill in the type aliases.

interface ServerConfig {
    host: string;
    port: number;
    tags: Record<string, string>;
    regions: ("us-east-1" | "eu-west-1" | "ap-southeast-1")[];
}

// TODO: Create a type that is just the type of the "tags" property
// Should be Record<string, string>
type ServerTags = unknown; // Replace "unknown" with the indexed access type

// TODO: Create a type that is the type of a single region
// Should be "us-east-1" | "eu-west-1" | "ap-southeast-1"
// Hint: ServerConfig["regions"] gives you the array type,
//       then use [number] to get the element type
type Region = unknown; // Replace "unknown" with the indexed access type

// Test your implementations:
// const servers = [
//   { name: "web", region: "us-east-1", port: 80 },
//   { name: "api", region: "eu-west-1", port: 3000 },
// ];
// console.log(pluck(servers, "name"));   // ["web", "api"]
// console.log(pluck(servers, "port"));   // [80, 3000]
//
// const server = { name: "web", region: "us-east-1", port: 80, env: "prod" };
// console.log(pick(server, ["name", "port"]));  // { name: "web", port: 80 }
