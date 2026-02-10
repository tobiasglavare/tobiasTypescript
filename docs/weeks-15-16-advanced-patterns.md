# Weeks 15-16: Advanced Patterns

This guide covers advanced TypeScript patterns and design patterns.

---

## 1. Template Literal Types

String manipulation at the type level:

```typescript
// Basic template literal
type Greeting = `Hello, ${string}!`;
const g: Greeting = "Hello, World!";  // ✅

// Combining unions
type Color = "red" | "green" | "blue";
type Shade = "light" | "dark";
type ColorShade = `${Shade}-${Color}`;
// "light-red" | "light-green" | "light-blue" | "dark-red" | ...

// Event names
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<"click">;  // "onClick"

// HTTP methods
type Method = "get" | "post" | "put" | "delete";
type Endpoint = `/${string}`;
type Route = `${Uppercase<Method>} ${Endpoint}`;
// "GET /users" is valid
```

### Practical: Type-safe event handlers

```typescript
type DOMEvents = "click" | "focus" | "blur" | "submit";
type EventHandlers = {
  [K in DOMEvents as `on${Capitalize<K>}`]: (event: Event) => void;
};
// { onClick: ..., onFocus: ..., onBlur: ..., onSubmit: ... }
```

---

## 2. Mapped Type Modifiers

```typescript
// Remove optional
type Required<T> = {
  [K in keyof T]-?: T[K];
};

// Remove readonly
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Key remapping
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }

// Filter keys
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```

---

## 3. Conditional Types

```typescript
// Basic conditional
type IsString<T> = T extends string ? true : false;

// Extract types
type ArrayElement<T> = T extends (infer E)[] ? E : never;
type Elem = ArrayElement<string[]>;  // string

// Function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Promise unwrapping
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type Result = ToArray<string | number>;  // string[] | number[]

// Non-distributive (wrap in tuple)
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Result2 = ToArrayNonDist<string | number>;  // (string | number)[]
```


---

## 4. Builder Pattern

Fluent API for constructing objects:

```typescript
interface QueryConfig {
  table: string;
  columns: string[];
  where?: string;
  orderBy?: string;
  limit?: number;
}

class QueryBuilder {
  private config: Partial<QueryConfig> = {};

  from(table: string): this {
    this.config.table = table;
    return this;
  }

  select(...columns: string[]): this {
    this.config.columns = columns;
    return this;
  }

  where(condition: string): this {
    this.config.where = condition;
    return this;
  }

  orderBy(column: string): this {
    this.config.orderBy = column;
    return this;
  }

  limit(count: number): this {
    this.config.limit = count;
    return this;
  }

  build(): string {
    const { table, columns, where, orderBy, limit } = this.config;
    
    if (!table || !columns?.length) {
      throw new Error("Table and columns are required");
    }

    let query = `SELECT ${columns.join(", ")} FROM ${table}`;
    if (where) query += ` WHERE ${where}`;
    if (orderBy) query += ` ORDER BY ${orderBy}`;
    if (limit) query += ` LIMIT ${limit}`;
    
    return query;
  }
}

// Usage
const query = new QueryBuilder()
  .from("users")
  .select("id", "name", "email")
  .where("active = true")
  .orderBy("name")
  .limit(10)
  .build();
```

---

## 5. Factory Pattern

```typescript
interface Logger {
  log(message: string): void;
  error(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

class FileLogger implements Logger {
  constructor(private filename: string) {}
  
  log(message: string): void {
    // Write to file
  }
  error(message: string): void {
    // Write to file
  }
}

class SilentLogger implements Logger {
  log(): void {}
  error(): void {}
}

// Factory function
type LoggerType = "console" | "file" | "silent";

function createLogger(type: LoggerType, options?: { filename?: string }): Logger {
  switch (type) {
    case "console":
      return new ConsoleLogger();
    case "file":
      if (!options?.filename) throw new Error("Filename required");
      return new FileLogger(options.filename);
    case "silent":
      return new SilentLogger();
  }
}

// Usage
const logger = createLogger("console");
const fileLogger = createLogger("file", { filename: "app.log" });
```

---

## 6. Singleton Pattern

```typescript
class Database {
  private static instance: Database | null = null;
  private connected = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  connect(): void {
    if (!this.connected) {
      console.log("Connecting to database...");
      this.connected = true;
    }
  }

  query(sql: string): void {
    if (!this.connected) {
      throw new Error("Not connected");
    }
    console.log(`Executing: ${sql}`);
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2);  // true
```

---

## 7. Repository Pattern

```typescript
interface Entity {
  id: string;
}

interface Repository<T extends Entity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, "id">): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

// In-memory implementation
class InMemoryRepository<T extends Entity> implements Repository<T> {
  protected items = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    return this.items.get(id) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  async create(data: Omit<T, "id">): Promise<T> {
    const id = crypto.randomUUID();
    const item = { id, ...data } as T;
    this.items.set(id, item);
    return item;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    
    const updated = { ...existing, ...data };
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}

// Usage
interface User extends Entity {
  name: string;
  email: string;
}

const userRepo = new InMemoryRepository<User>();
await userRepo.create({ name: "Alice", email: "alice@example.com" });
```


---

## 8. Dependency Injection

```typescript
// Interfaces
interface Logger {
  log(message: string): void;
}

interface UserRepository {
  findById(id: string): Promise<User | null>;
}

// Service with dependencies
class UserService {
  constructor(
    private logger: Logger,
    private userRepo: UserRepository
  ) {}

  async getUser(id: string): Promise<User | null> {
    this.logger.log(`Fetching user ${id}`);
    return this.userRepo.findById(id);
  }
}

// Simple DI container
class Container {
  private services = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  resolve<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) throw new Error(`Service ${key} not found`);
    return factory();
  }
}

// Setup
const container = new Container();
container.register("logger", () => new ConsoleLogger());
container.register("userRepo", () => new InMemoryUserRepository());
container.register("userService", () => new UserService(
  container.resolve("logger"),
  container.resolve("userRepo")
));

// Usage
const userService = container.resolve<UserService>("userService");
```

---

## 9. Observer Pattern

```typescript
type Listener<T> = (data: T) => void;

class EventEmitter<Events extends Record<string, any>> {
  private listeners: {
    [K in keyof Events]?: Listener<Events[K]>[];
  } = {};

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);

    // Return unsubscribe function
    return () => {
      const idx = this.listeners[event]!.indexOf(listener);
      if (idx > -1) this.listeners[event]!.splice(idx, 1);
    };
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.listeners[event]?.forEach(listener => listener(data));
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    const unsubscribe = this.on(event, (data) => {
      unsubscribe();
      listener(data);
    });
  }
}

// Usage
interface AppEvents {
  userCreated: { id: string; name: string };
  userDeleted: { id: string };
  error: Error;
}

const events = new EventEmitter<AppEvents>();

const unsubscribe = events.on("userCreated", (user) => {
  console.log(`User created: ${user.name}`);
});

events.emit("userCreated", { id: "1", name: "Alice" });
unsubscribe();
```

---

## 10. Decorator Pattern (Runtime)

```typescript
// Function decorator
function logged<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    console.log(`${fn.name} returned`, result);
    return result;
  }) as T;
}

const add = logged((a: number, b: number) => a + b);
add(2, 3);  // Logs: Calling add with [2, 3], add returned 5

// Method decorator (experimental)
function measure(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = original.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${end - start}ms`);
    return result;
  };
  
  return descriptor;
}
```

---

## Quick Reference

### Template Literals
```typescript
type Event = `on${Capitalize<"click">}`;  // "onClick"
```

### Mapped Types
```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
```

### Conditional Types
```typescript
type Unwrap<T> = T extends Promise<infer U> ? U : T;
```

### Design Patterns
- Builder: Fluent API for object construction
- Factory: Create objects without specifying class
- Singleton: Single instance globally
- Repository: Abstract data access
- Observer: Event-based communication
- Dependency Injection: Decouple dependencies

---

## Further Learning

- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Effective TypeScript](https://effectivetypescript.com/)
- [Total TypeScript](https://www.totaltypescript.com/)
