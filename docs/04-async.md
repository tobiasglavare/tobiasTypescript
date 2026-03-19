# Chapter 4: Async Programming

This document covers asynchronous JavaScript — callbacks, promises, and async/await. Understanding async is essential because almost every real application needs to talk to the outside world — APIs, databases, file systems — and all of those operations take time. Without async, your program would freeze while waiting.

---

## 1. Why Async?

JavaScript runs on a single thread, meaning it can only do one thing at a time. If you make a network request that takes 2 seconds and just wait for it synchronously, nothing else can happen — no UI updates, no other requests, nothing. Async lets your code say "start this operation, and I'll come back to handle the result when it's ready" while continuing to do other work:

```typescript
// ❌ If this were synchronous, the UI would freeze
const data = fetchFromServer();  // Takes 2 seconds
console.log(data);

// ✅ Async allows other code to run while waiting
fetchFromServer().then(data => {
  console.log(data);
});
console.log("This runs immediately!");
```

Common async operations:
- Network requests (fetch, API calls)
- File system operations
- Timers (setTimeout, setInterval)
- Database queries
- User input events

---

## 2. Callbacks

Callbacks were the first way JavaScript handled async operations. The idea is simple: pass a function as an argument, and it gets called when the operation finishes. You'll still see this pattern in older Node.js APIs and event handlers, so it's worth understanding even though we have better tools now:

```typescript
// setTimeout callback
setTimeout(() => {
  console.log("Runs after 1 second");
}, 1000);

// Node.js style callback (error-first)
function readFile(path: string, callback: (err: Error | null, data?: string) => void) {
  // ... async operation
  if (error) {
    callback(new Error("Failed to read"));
  } else {
    callback(null, fileContents);
  }
}

readFile("config.json", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

### Callback Hell

The big problem with callbacks is that async operations often depend on each other — you need the user before you can get their orders, and you need the order before you can get its details. This leads to deeply nested code that's hard to read, hard to debug, and hard to handle errors in:

```typescript
// ❌ Callback hell
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      // Finally do something...
    });
  });
});
```

This is why Promises were invented.

---

## 3. Promises

Promises were introduced to solve callback hell. Instead of nesting callbacks, a Promise is an object that represents a value that doesn't exist yet but will (or won't) in the future. This lets you chain operations in a flat, readable way and handle errors in one place. A Promise can be in one of three states:
- **Pending**: Operation in progress
- **Fulfilled**: Completed successfully with a value
- **Rejected**: Failed with an error


### Creating Promises

```typescript
// Basic promise
const promise = new Promise<string>((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) {
      resolve("Operation succeeded!");
    } else {
      reject(new Error("Operation failed"));
    }
  }, 1000);
});

// Shorthand for resolved/rejected promises
const resolved = Promise.resolve("immediate value");
const rejected = Promise.reject(new Error("immediate error"));
```

### Consuming Promises with .then() and .catch()

```typescript
promise
  .then(result => {
    console.log(result);  // "Operation succeeded!"
    return result.toUpperCase();
  })
  .then(upper => {
    console.log(upper);  // "OPERATION SUCCEEDED!"
  })
  .catch(error => {
    console.error("Error:", error.message);
  })
  .finally(() => {
    console.log("Cleanup - runs regardless of success/failure");
  });
```

### Chaining Promises

```typescript
function getUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`).then(res => res.json());
}

function getOrders(userId: number): Promise<Order[]> {
  return fetch(`/api/users/${userId}/orders`).then(res => res.json());
}

// Chain instead of nest
getUser(1)
  .then(user => getOrders(user.id))
  .then(orders => {
    console.log(orders);
  })
  .catch(error => {
    console.error("Something failed:", error);
  });
```

---

## 4. async/await

Even with Promises, chaining `.then()` calls can get verbose. `async/await` is syntactic sugar that lets you write async code that looks and reads like synchronous code. Under the hood it's still Promises — `await` just pauses the function until the Promise resolves, and `async` makes the function return a Promise automatically. This is the preferred way to write async code in modern TypeScript:

```typescript
// With Promises
function fetchData() {
  return fetch("/api/data")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    });
}

// With async/await
async function fetchData() {
  const response = await fetch("/api/data");
  const data = await response.json();
  console.log(data);
  return data;
}
```

### Rules of async/await

```typescript
// 1. await can only be used inside async functions
async function example() {
  const result = await somePromise();
}

// 2. async functions always return a Promise
async function getValue(): Promise<number> {
  return 42;  // Automatically wrapped in Promise.resolve(42)
}

// 3. Top-level await (in modules)
// In a .mjs file or with "type": "module"
const data = await fetch("/api").then(r => r.json());
```


### Error Handling with try/catch

```typescript
async function fetchUser(id: number) {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;  // Re-throw or handle
  }
}

// Or handle at call site
async function main() {
  try {
    const user = await fetchUser(1);
    console.log(user);
  } catch (error) {
    console.error("Error in main:", error);
  }
}
```

---

## 5. Promise Static Methods

These static methods on the `Promise` class are tools for coordinating multiple async operations. Choosing the right one depends on whether you need all results, just the first, or want to handle failures gracefully.

### Promise.all()

Use this when you have multiple independent operations and need all of them to succeed. It runs them in parallel and returns all results at once. If any single promise rejects, the whole thing fails immediately — this "fail fast" behavior is useful when all results are required:

```typescript
const urls = ["/api/users", "/api/posts", "/api/comments"];

const promises = urls.map(url => fetch(url).then(r => r.json()));

// All succeed or first failure
const [users, posts, comments] = await Promise.all(promises);

// Practical example: parallel fetches
async function getDashboardData() {
  const [user, notifications, stats] = await Promise.all([
    fetchUser(),
    fetchNotifications(),
    fetchStats(),
  ]);
  return { user, notifications, stats };
}
```

### Promise.allSettled()

Unlike `Promise.all()`, this waits for every promise to finish regardless of whether they succeed or fail. Use it when you want to attempt multiple operations and handle each result individually — for example, sending notifications to multiple users where some might fail but you still want to process the rest:

```typescript
const results = await Promise.allSettled([
  fetch("/api/users"),
  fetch("/api/broken"),  // This fails
  fetch("/api/posts"),
]);

results.forEach((result, i) => {
  if (result.status === "fulfilled") {
    console.log(`Promise ${i} succeeded:`, result.value);
  } else {
    console.log(`Promise ${i} failed:`, result.reason);
  }
});
```

### Promise.race()

Returns the result of whichever promise settles first (whether it fulfills or rejects). The classic use case is implementing timeouts — race your actual operation against a timer:

```typescript
// Timeout pattern
async function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), timeoutMs);
  });
  
  return Promise.race([promise, timeout]);
}

const data = await fetchWithTimeout(fetch("/api/slow"), 5000);
```

### Step by step: Promise.all vs Promise.allSettled

```typescript
// Imagine you're sending notifications to 3 users.
// Some might fail — how do you want to handle that?

const notifications = [
  sendEmail("alice@test.com"),   // ✅ succeeds
  sendEmail("bad-address"),       // ❌ fails
  sendEmail("bob@test.com"),     // ✅ succeeds
];

// --- Promise.all: fails fast ---
// If ANY promise rejects, the whole thing rejects immediately.
// You don't get the successful results at all.
try {
  const results = await Promise.all(notifications);
  // ❌ Never reaches here because one failed
} catch (error) {
  // error is from "bad-address" — but what about Alice and Bob?
  // You don't know if they succeeded or not.
}

// --- Promise.allSettled: waits for everything ---
// Every promise runs to completion. You get a status for each one.
const results = await Promise.allSettled(notifications);
// results is:
// [
//   { status: "fulfilled", value: "sent to alice" },
//   { status: "rejected",  reason: Error("invalid address") },
//   { status: "fulfilled", value: "sent to bob" },
// ]

// Now you can handle each result individually:
const failed = results.filter(r => r.status === "rejected");
console.log(`${failed.length} notifications failed`);
// Use Promise.all when ALL must succeed (loading a dashboard).
// Use Promise.allSettled when you want to try everything and handle failures individually.
```

### Promise.any()

Similar to `race()`, but only cares about the first success — it ignores rejections unless every promise fails. This is great for redundancy patterns where you try multiple sources and use whichever responds first:

```typescript
// Try multiple sources, use first success
const data = await Promise.any([
  fetch("https://primary-api.com/data"),
  fetch("https://backup-api.com/data"),
  fetch("https://fallback-api.com/data"),
]);
```


---

## 6. Common Patterns

### Sequential vs Parallel

One of the most common async mistakes is accidentally running things sequentially when they could run in parallel. If two operations don't depend on each other, run them at the same time with `Promise.all()`. This can dramatically reduce total wait time:

```typescript
// ❌ Sequential (slow) - each waits for previous
async function sequential() {
  const user = await fetchUser();      // 1 second
  const posts = await fetchPosts();    // 1 second
  const comments = await fetchComments(); // 1 second
  // Total: 3 seconds
}

// ✅ Parallel (fast) - all run at once
async function parallel() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),      // 1 second
    fetchPosts(),     // 1 second  
    fetchComments(),  // 1 second
  ]);
  // Total: 1 second
}

// Mixed: some parallel, some sequential
async function mixed() {
  const user = await fetchUser();  // Need user first
  const [posts, friends] = await Promise.all([
    fetchPosts(user.id),
    fetchFriends(user.id),
  ]);
}
```

### Retry Pattern

Network requests fail. Servers go down temporarily. The retry pattern handles transient failures by attempting the operation multiple times with a delay between attempts. This is especially common when calling external APIs or services that might have brief outages:

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying...`);
      await sleep(delay);
    }
  }
  throw new Error("Should not reach here");
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage
const data = await fetchWithRetry(() => fetch("/api/flaky"));
```

### Step by step: async/await with error handling

```typescript
// Let's trace through a real async flow step by step.

async function getUserOrders(userId: string) {
  // 1. Start an async function — it always returns a Promise.
  //    The caller gets a Promise<Order[]> back immediately.

  try {
    // 2. `await` pauses THIS function (not the whole program)
    //    until the fetch completes. Other code keeps running.
    const response = await fetch(`/api/users/${userId}/orders`);

    // 3. We're back. `response` is now a real Response object.
    //    But the body hasn't been read yet — that's also async.
    if (!response.ok) {
      // 4. We throw manually for HTTP errors (fetch doesn't throw on 404/500).
      //    This jumps straight to the catch block below.
      throw new Error(`HTTP ${response.status}`);
    }

    // 5. Another await — pause again while the JSON body is parsed.
    const orders = await response.json();

    // 6. Return the data. Since we're in an async function,
    //    this actually resolves the Promise the caller is waiting on.
    return orders;

  } catch (error) {
    // 7. Catches BOTH network failures (fetch threw)
    //    AND our manual throw from step 4.
    //    Also catches JSON parse errors from step 5.
    console.error("Failed to get orders:", error);

    // 8. Re-throw so the caller knows it failed.
    //    Without this, the function would return undefined.
    throw error;
  }
}

// Calling it:
try {
  const orders = await getUserOrders("123");
  //    ↑ pauses here until the whole function resolves
  console.log(orders);
} catch (error) {
  // Handles the re-thrown error from step 8
  showErrorMessage("Could not load orders");
}
```

### Debounce and Throttle

```typescript
// Debounce: wait until calls stop
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Throttle: limit call frequency
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### Processing Arrays Sequentially

```typescript
// Process one at a time
async function processSequentially<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (const item of items) {
    results.push(await fn(item));
  }
  return results;
}

// Process with concurrency limit
async function processWithLimit<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  limit: number
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];
  
  for (const item of items) {
    const p = fn(item).then(result => {
      results.push(result);
    });
    executing.push(p);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  await Promise.all(executing);
  return results;
}
```


---

## 7. TypeScript and Async

### Typing async functions

```typescript
// Return type is always Promise<T>
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Typing the resolved value
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

const result = await fetchData<User[]>("/api/users");
// result.data is User[]
```

### Typing Promise callbacks

```typescript
// Promise constructor
const promise = new Promise<string>((resolve, reject) => {
  resolve("success");  // Must be string
  reject(new Error("fail"));  // Error type
});

// then() callback
promise.then((value: string) => {
  return value.length;  // Returns number
}).then((length: number) => {
  console.log(length);
});
```

### `Awaited<T>` utility type

```typescript
// Extract the resolved type from a Promise
type A = Awaited<Promise<string>>;  // string
type B = Awaited<Promise<Promise<number>>>;  // number (unwraps nested)
type C = Awaited<boolean | Promise<string>>;  // boolean | string
```

---

## 8. Error Handling Best Practices

### Custom error classes

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.statusText}`,
      response.status,
      await response.json().catch(() => null)
    );
  }
  
  return response.json();
}

// Handle specific errors
try {
  const data = await fetchApi("/api/users");
} catch (error) {
  if (error instanceof ApiError) {
    if (error.statusCode === 404) {
      console.log("Not found");
    } else if (error.statusCode >= 500) {
      console.log("Server error");
    }
  }
  throw error;
}
```

### Result type pattern

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function safeFetch<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { ok: false, error: new Error(`HTTP ${response.status}`) };
    }
    const data = await response.json();
    return { ok: true, value: data };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

// Usage - no try/catch needed
const result = await safeFetch<User>("/api/user");
if (result.ok) {
  console.log(result.value.name);
} else {
  console.error(result.error.message);
}
```

---

## 9. Real-World Example

```typescript
interface HealthCheck {
  service: string;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  checkedAt: Date;
}

async function checkService(url: string): Promise<HealthCheck> {
  const start = Date.now();
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    
    return {
      service: url,
      status: response.ok ? "healthy" : "degraded",
      latencyMs: Date.now() - start,
      checkedAt: new Date(),
    };
  } catch (error) {
    return {
      service: url,
      status: "down",
      latencyMs: Date.now() - start,
      checkedAt: new Date(),
    };
  }
}

async function checkAllServices(urls: string[]): Promise<HealthCheck[]> {
  return Promise.all(urls.map(checkService));
}

// Usage
const services = [
  "https://api.example.com/health",
  "https://db.example.com/health",
  "https://cache.example.com/health",
];

const results = await checkAllServices(services);
const unhealthy = results.filter(r => r.status !== "healthy");
```

---

## Quick Reference

### Promise Methods
```typescript
Promise.resolve(value)      // Create resolved promise
Promise.reject(error)       // Create rejected promise
Promise.all([...])          // All must succeed
Promise.allSettled([...])   // Wait for all, get all results
Promise.race([...])         // First to settle wins
Promise.any([...])          // First to succeed wins
```

### async/await
```typescript
async function fn(): Promise<T> { }  // Async function
const result = await promise;         // Wait for promise
```

### Error Handling
```typescript
// try/catch with async/await
try {
  const data = await fetchData();
} catch (error) {
  handleError(error);
} finally {
  cleanup();
}

// .catch() with promises
fetchData()
  .then(handleSuccess)
  .catch(handleError)
  .finally(cleanup);
```

---

## Exercises

1. **Fetch with timeout:** Create a function that fetches data but rejects if it takes longer than N milliseconds.

2. **Retry logic:** Implement a function that retries a failed async operation up to 3 times with exponential backoff.

3. **Parallel with limit:** Process an array of URLs, but only fetch 3 at a time.

4. **Sequential processing:** Process items one at a time, collecting results.

5. **Health checker:** Build a service that checks multiple endpoints and reports their status.

