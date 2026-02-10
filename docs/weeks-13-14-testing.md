# Weeks 13-14: Testing

This guide covers testing TypeScript code with Vitest.

---

## 1. Setup

```bash
npm install vitest -D
```

### package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

### vitest.config.ts (optional)

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "html"]
    }
  }
});
```

---

## 2. Basic Tests

```typescript
// src/math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

// src/math.test.ts
import { describe, it, expect } from "vitest";
import { add, divide } from "./math";

describe("add", () => {
  it("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("adds negative numbers", () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it("adds zero", () => {
    expect(add(5, 0)).toBe(5);
  });
});

describe("divide", () => {
  it("divides two numbers", () => {
    expect(divide(10, 2)).toBe(5);
  });

  it("throws on division by zero", () => {
    expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
  });
});
```

---

## 3. Test Structure: AAA Pattern

```typescript
describe("UserService", () => {
  it("creates a user with valid data", () => {
    // Arrange - set up test data
    const userData = { name: "Alice", email: "alice@example.com" };
    const service = new UserService();

    // Act - perform the action
    const user = service.create(userData);

    // Assert - verify the result
    expect(user.id).toBeDefined();
    expect(user.name).toBe("Alice");
    expect(user.email).toBe("alice@example.com");
  });
});
```

---

## 4. Common Matchers

```typescript
// Equality
expect(value).toBe(5);              // Strict equality (===)
expect(obj).toEqual({ a: 1 });      // Deep equality
expect(value).not.toBe(10);         // Negation

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3, 5);  // For floating point

// Strings
expect(str).toMatch(/pattern/);
expect(str).toContain("substring");

// Arrays
expect(arr).toContain(item);
expect(arr).toHaveLength(3);
expect(arr).toEqual(expect.arrayContaining([1, 2]));

// Objects
expect(obj).toHaveProperty("key");
expect(obj).toHaveProperty("key", "value");
expect(obj).toMatchObject({ partial: "match" });

// Errors
expect(() => fn()).toThrow();
expect(() => fn()).toThrow("message");
expect(() => fn()).toThrow(ErrorClass);

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```


---

## 5. Setup and Teardown

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from "vitest";

describe("Database tests", () => {
  // Run once before all tests in this describe block
  beforeAll(async () => {
    await database.connect();
  });

  // Run once after all tests
  afterAll(async () => {
    await database.disconnect();
  });

  // Run before each test
  beforeEach(async () => {
    await database.clear();
  });

  // Run after each test
  afterEach(() => {
    // Cleanup
  });

  it("inserts a record", async () => {
    // Test with clean database
  });
});
```

---

## 6. Mocking

### Mock functions

```typescript
import { vi, describe, it, expect } from "vitest";

describe("with mocks", () => {
  it("tracks calls", () => {
    const mockFn = vi.fn();
    
    mockFn("arg1", "arg2");
    mockFn("arg3");
    
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("returns values", () => {
    const mockFn = vi.fn()
      .mockReturnValue("default")
      .mockReturnValueOnce("first")
      .mockReturnValueOnce("second");
    
    expect(mockFn()).toBe("first");
    expect(mockFn()).toBe("second");
    expect(mockFn()).toBe("default");
  });

  it("implements custom logic", () => {
    const mockFn = vi.fn((x: number) => x * 2);
    
    expect(mockFn(5)).toBe(10);
  });
});
```

### Mock modules

```typescript
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock entire module
vi.mock("./api", () => ({
  fetchUser: vi.fn()
}));

import { fetchUser } from "./api";
import { getUserName } from "./userService";

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns user name", async () => {
    vi.mocked(fetchUser).mockResolvedValue({ name: "Alice" });
    
    const name = await getUserName("123");
    
    expect(name).toBe("Alice");
    expect(fetchUser).toHaveBeenCalledWith("123");
  });
});
```

### Spying

```typescript
import { vi, describe, it, expect } from "vitest";

describe("spying", () => {
  it("spies on object methods", () => {
    const obj = {
      method: (x: number) => x * 2
    };
    
    const spy = vi.spyOn(obj, "method");
    
    obj.method(5);
    
    expect(spy).toHaveBeenCalledWith(5);
    expect(spy).toHaveReturnedWith(10);
  });

  it("spies on console", () => {
    const consoleSpy = vi.spyOn(console, "log");
    
    console.log("test message");
    
    expect(consoleSpy).toHaveBeenCalledWith("test message");
    
    consoleSpy.mockRestore();
  });
});
```


---

## 7. Testing Async Code

```typescript
import { describe, it, expect } from "vitest";

// Function to test
async function fetchData(id: string): Promise<{ id: string; name: string }> {
  const response = await fetch(`/api/data/${id}`);
  return response.json();
}

describe("async tests", () => {
  // Using async/await
  it("fetches data", async () => {
    const data = await fetchData("123");
    expect(data.id).toBe("123");
  });

  // Using resolves/rejects
  it("resolves with data", async () => {
    await expect(fetchData("123")).resolves.toHaveProperty("id");
  });

  it("rejects on error", async () => {
    await expect(fetchData("invalid")).rejects.toThrow();
  });
});
```

---

## 8. Testing Classes

```typescript
// src/store.ts
export class Store<T> {
  private items = new Map<string, T>();

  set(id: string, item: T): void {
    this.items.set(id, item);
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  delete(id: string): boolean {
    return this.items.delete(id);
  }

  list(): T[] {
    return Array.from(this.items.values());
  }
}

// src/store.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { Store } from "./store";

describe("Store", () => {
  let store: Store<{ name: string }>;

  beforeEach(() => {
    store = new Store();
  });

  it("stores and retrieves items", () => {
    store.set("1", { name: "Alice" });
    
    expect(store.get("1")).toEqual({ name: "Alice" });
  });

  it("returns undefined for missing items", () => {
    expect(store.get("nonexistent")).toBeUndefined();
  });

  it("deletes items", () => {
    store.set("1", { name: "Alice" });
    
    expect(store.delete("1")).toBe(true);
    expect(store.get("1")).toBeUndefined();
  });

  it("lists all items", () => {
    store.set("1", { name: "Alice" });
    store.set("2", { name: "Bob" });
    
    expect(store.list()).toHaveLength(2);
    expect(store.list()).toEqual(
      expect.arrayContaining([{ name: "Alice" }, { name: "Bob" }])
    );
  });
});
```

---

## 9. Testing Error Handling

```typescript
import { describe, it, expect } from "vitest";

class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateEmail(email: string): void {
  if (!email.includes("@")) {
    throw new ValidationError("email", "Invalid email format");
  }
}

describe("validateEmail", () => {
  it("accepts valid email", () => {
    expect(() => validateEmail("test@example.com")).not.toThrow();
  });

  it("throws ValidationError for invalid email", () => {
    expect(() => validateEmail("invalid")).toThrow(ValidationError);
  });

  it("includes field name in error", () => {
    try {
      validateEmail("invalid");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).field).toBe("email");
    }
  });

  // Alternative with expect.assertions
  it("throws with correct message", () => {
    expect.assertions(1);
    try {
      validateEmail("invalid");
    } catch (error) {
      expect((error as Error).message).toBe("Invalid email format");
    }
  });
});
```

---

## 10. Test Organization Tips

```typescript
// Group related tests
describe("UserService", () => {
  describe("create", () => {
    it("creates user with valid data", () => {});
    it("throws on duplicate email", () => {});
    it("hashes password", () => {});
  });

  describe("findById", () => {
    it("returns user when found", () => {});
    it("returns undefined when not found", () => {});
  });

  describe("update", () => {
    it("updates existing user", () => {});
    it("throws on non-existent user", () => {});
  });
});

// Skip tests
it.skip("not implemented yet", () => {});

// Focus on specific test
it.only("debug this test", () => {});

// Todo tests
it.todo("should handle edge case");
```

---

## Quick Reference

```typescript
// Test structure
describe("group", () => {
  beforeAll(() => {});
  beforeEach(() => {});
  afterEach(() => {});
  afterAll(() => {});
  
  it("test case", () => {});
  it.skip("skipped", () => {});
  it.only("focused", () => {});
  it.todo("todo");
});

// Mocking
const mock = vi.fn();
vi.spyOn(obj, "method");
vi.mock("./module");
vi.mocked(fn).mockReturnValue(value);
vi.clearAllMocks();

// Common matchers
expect(x).toBe(y);
expect(x).toEqual(y);
expect(x).toBeTruthy();
expect(x).toContain(y);
expect(fn).toThrow();
await expect(p).resolves.toBe(y);
```
