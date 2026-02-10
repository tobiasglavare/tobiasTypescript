# Week 4: Async Programming

This document covers asynchronous JavaScript — callbacks, promises, and async/await.

---

## 1. Why Async?

JavaScript is single-threaded. Async operations prevent blocking:

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

The original async pattern — pass a function to be called later:

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

Nested callbacks become unreadable:

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

A Promise represents a future value. It can be:
- **Pending**: Operation in progress
- **Fulfilled**: Completed successfully
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

Syntactic sugar over Promises — makes async code look synchronous:

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

### Promise.all()

Wait for all promises to resolve (fails fast on first rejection):

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

Wait for all promises, regardless of success/failure:

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

First promise to settle wins:

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

### Promise.any()

First promise to fulfill wins (ignores rejections until all fail):

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

### Awaited<T> utility type

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
