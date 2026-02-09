# TypeScript Learning Journey

A structured 16-week plan to master TypeScript fundamentals and become a stronger developer.

**Schedule:** Tuesday afternoons + Friday afternoons (2 half-days/week)

**Background:** Bash, Python, infrastructure code (cdktf-extras)

---

## Progress Tracker

| Week | Dates | Topic | Status |
|------|-------|-------|--------|
| 1 | | JavaScript Fundamentals | ⬜ |
| 2 | | TypeScript Basics | ⬜ |
| 3 | | Arrays & Functional Methods | ⬜ |
| 4 | | Async Programming | ⬜ |
| 5 | | Generics | ⬜ |
| 6 | | Advanced Types | ⬜ |
| 7 | | OOP & Classes | ⬜ |
| 8 | | Error Handling & Modules | ⬜ |
| 9-10 | | Project: CLI Tool | ⬜ |
| 11-12 | | Project: API Server | ⬜ |
| 13-14 | | Testing & Quality | ⬜ |
| 15-16 | | Advanced Patterns | ⬜ |

---

## Phase 1: Foundations (Weeks 1-4)

### Week 1: JavaScript Fundamentals

**Tuesday - Theory (Essential Chapters):**

From [JavaScript.info](https://javascript.info/):
1. [Variables](https://javascript.info/variables) - `let`, `const`, `var`
2. [Data types](https://javascript.info/types) - primitives and objects
3. [Functions](https://javascript.info/function-basics) - declarations and expressions
4. [Arrow functions](https://javascript.info/arrow-functions-basics) - concise syntax
5. [Variable scope, closure](https://javascript.info/closure) - essential for JS mastery
6. [The old "var"](https://javascript.info/var) - why we avoid it
7. [Object basics](https://javascript.info/object) - working with objects

Optional deep dives:
- [Function expressions](https://javascript.info/function-expressions)
- [The "this" keyword](https://javascript.info/object-methods) - tricky but important
- [Constructor functions](https://javascript.info/constructor-new)

**Friday - Practice:**
- Complete exercises on [W3Resource JavaScript](https://www.w3resource.com/javascript-exercises/) (no account needed)
- Try [GeeksforGeeks JavaScript Practice](https://www.geeksforgeeks.org/practice-javascript-online/) (no signup required)
- Mini-project: Write a function that creates a counter with increment/decrement/reset using closures

```typescript
// Example: Counter factory using closures
function createCounter(initial = 0) {
  let count = initial;
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => (count = initial),
    value: () => count,
  };
}
```

**Resources:**
- 📺 [Fireship - 100 seconds of JavaScript](https://www.youtube.com/watch?v=DHjqpvDnNGE)
- 📺 [Web Dev Simplified - Closures](https://www.youtube.com/watch?v=3a0I8ICR1Vg)
- [MDN - Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [MDN - Functions Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

---

### Week 2: TypeScript Basics

**Tuesday - Theory:**
- Setting up a TypeScript project (`tsconfig.json`)
- Basic types: `string`, `number`, `boolean`, `array`, `tuple`
- Type annotations vs type inference
- Interfaces vs type aliases
- Optional and readonly properties

**Friday - Practice:**
- Convert a small JavaScript file to TypeScript
- Mini-project: Create typed configuration objects for infrastructure

```typescript
// Example: Typed infrastructure config
interface ServerConfig {
  readonly name: string;
  region: 'us-east-1' | 'eu-west-1' | 'ap-southeast-1';
  instanceType: string;
  tags?: Record<string, string>;
}

interface DatabaseConfig {
  engine: 'postgres' | 'mysql' | 'aurora';
  version: string;
  multiAz: boolean;
  storage: {
    type: 'gp3' | 'io1';
    sizeGb: number;
  };
}

function validateConfig(server: ServerConfig, db: DatabaseConfig): boolean {
  // Implementation
}
```

**Resources:**
- [TypeScript Handbook - Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Playground](https://www.typescriptlang.org/play) - experiment here!
- 📺 [Fireship - TypeScript in 100 seconds](https://www.youtube.com/watch?v=zQnBQ4tB3ZA)
- 📺 [Matt Pocock - Beginner TypeScript Tutorial](https://www.youtube.com/watch?v=p6dO9u0M7MQ)
- 📺 [Jack Herrington - No BS TS Series](https://www.youtube.com/playlist?list=PLNqp92_EXZBJYFrpEzdO2EapvU0GOJ09n)

---

### Week 3: Arrays & Functional Methods

**Tuesday - Theory:**
- Array methods: `map`, `filter`, `reduce`, `find`, `some`, `every`
- Method chaining
- Immutability patterns
- Typing arrays and tuples properly

**Friday - Practice:**
- Complete array exercises on [W3Resource JavaScript Arrays](https://www.w3resource.com/javascript-exercises/javascript-array-exercises.php) (no account needed)
- Mini-project: Build a data transformation pipeline

```typescript
// Example: Transform infrastructure inventory data
interface Resource {
  id: string;
  type: 'ec2' | 's3' | 'rds' | 'lambda';
  name: string;
  cost: number;
  tags: Record<string, string>;
}

const resources: Resource[] = [/* ... */];

// Find all resources over budget
const overBudget = resources
  .filter(r => r.cost > 100)
  .map(r => ({ name: r.name, overage: r.cost - 100 }))
  .sort((a, b) => b.overage - a.overage);

// Group resources by type
const byType = resources.reduce((acc, r) => {
  acc[r.type] = acc[r.type] || [];
  acc[r.type].push(r);
  return acc;
}, {} as Record<Resource['type'], Resource[]>);

// Calculate total cost by tag
function costByTag(resources: Resource[], tagKey: string): Map<string, number> {
  // Implement this
}
```

**Resources:**
- [JavaScript.info - Array methods](https://javascript.info/array-methods)
- [MDN - Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN - Map, Filter, Reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- 📺 [Fireship - Array Methods](https://www.youtube.com/watch?v=rRgD1yVwIvE)
- 📺 [Web Dev Simplified - 8 Must Know Array Methods](https://www.youtube.com/watch?v=R8rmfD9Y5-c)
- 📺 [Fun Fun Function - Functional Programming Playlist](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)

---

### Week 4: Async Programming

**Tuesday - Theory:**
- Callbacks and callback hell
- Promises: creation, chaining, error handling
- `async`/`await` syntax
- `Promise.all`, `Promise.race`, `Promise.allSettled`
- Typing async functions

**Friday - Practice:**
- Mini-project: Build an async resource fetcher

```typescript
// Example: Async infrastructure checker
interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number;
  checkedAt: Date;
}

async function checkService(url: string): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const response = await fetch(url);
    return {
      service: url,
      status: response.ok ? 'healthy' : 'degraded',
      latencyMs: Date.now() - start,
      checkedAt: new Date(),
    };
  } catch {
    return {
      service: url,
      status: 'down',
      latencyMs: Date.now() - start,
      checkedAt: new Date(),
    };
  }
}

async function checkAllServices(urls: string[]): Promise<HealthCheck[]> {
  return Promise.all(urls.map(checkService));
}

// With timeout
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  // Implement this
}
```

**Resources:**
- [JavaScript.info - Promises](https://javascript.info/promise-basics)
- [JavaScript.info - Async/Await](https://javascript.info/async-await)
- [MDN - Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [MDN - async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
- 📺 [Fireship - Async/Await in 100 seconds](https://www.youtube.com/watch?v=vn3tm0quoqE)
- 📺 [Web Dev Simplified - JavaScript Promises](https://www.youtube.com/watch?v=DHvZLI7Db8E)
- 📺 [Traversy Media - Async JS Crash Course](https://www.youtube.com/watch?v=PoRJizFvM7s)

---

## Phase 2: Intermediate Concepts (Weeks 5-8)

### Week 5: Generics

**Tuesday - Theory:**
- Generic functions and type parameters
- Generic interfaces and classes
- Constraints with `extends`
- Default type parameters
- Built-in utility types: `Partial`, `Required`, `Pick`, `Omit`, `Record`

**Friday - Practice:**
- Mini-project: Build a generic cache/store

```typescript
// Example: Generic data store
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
userStore.set('1', { name: 'Alice', email: 'alice@example.com' });

// Challenge: Add TTL (time-to-live) support
interface StoreWithTTL<T> extends Store<T> {
  setWithTTL(id: string, value: T, ttlMs: number): void;
}
```

**Resources:**
- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Total TypeScript - Generics Tutorial](https://www.totaltypescript.com/tutorials/beginners-typescript/generics)
- 📺 [Matt Pocock - Generics for Beginners](https://www.youtube.com/watch?v=dLPgQRbVquo)
- 📺 [Jack Herrington - TypeScript Generics](https://www.youtube.com/watch?v=nViEqpgwxHE)
- 📺 [Web Dev Simplified - TypeScript Generics](https://www.youtube.com/watch?v=EcCTIExsqmI)

---

### Week 6: Advanced Types

**Tuesday - Theory:**
- Union and intersection types
- Type guards and narrowing
- Discriminated unions
- `keyof` and indexed access types
- Conditional types basics

**Friday - Practice:**
- Mini-project: Build a type-safe event system

```typescript
// Example: Discriminated union for infrastructure events
type InfraEvent =
  | { type: 'instance.created'; instanceId: string; region: string }
  | { type: 'instance.terminated'; instanceId: string; reason: string }
  | { type: 'scaling.triggered'; groupName: string; direction: 'up' | 'down'; count: number }
  | { type: 'deployment.started'; version: string; environment: string }
  | { type: 'deployment.completed'; version: string; environment: string; durationMs: number };

// Type guard
function isDeploymentEvent(event: InfraEvent): event is Extract<InfraEvent, { type: `deployment.${string}` }> {
  return event.type.startsWith('deployment.');
}

// Event handler with exhaustive checking
function handleEvent(event: InfraEvent): string {
  switch (event.type) {
    case 'instance.created':
      return `Instance ${event.instanceId} created in ${event.region}`;
    case 'instance.terminated':
      return `Instance ${event.instanceId} terminated: ${event.reason}`;
    case 'scaling.triggered':
      return `Scaling ${event.direction} by ${event.count} in ${event.groupName}`;
    case 'deployment.started':
      return `Deploying ${event.version} to ${event.environment}`;
    case 'deployment.completed':
      return `Deployed ${event.version} to ${event.environment} in ${event.durationMs}ms`;
    default:
      const _exhaustive: never = event;
      return _exhaustive;
  }
}
```

**Resources:**
- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook - Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [TypeScript Handbook - Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Total TypeScript - Type Guards](https://www.totaltypescript.com/tutorials/beginners-typescript/type-guards)
- 📺 [Matt Pocock - Discriminated Unions](https://www.youtube.com/watch?v=6GRUqpG6Yks)
- 📺 [Matt Pocock - Type Predicates](https://www.youtube.com/watch?v=wjMwQyqkqEM)
- 📺 [Basarat - TypeScript Type Guards](https://www.youtube.com/watch?v=E5JwpxiSBTs)

---

### Week 7: OOP & Classes

**Tuesday - Theory:**
- Classes in TypeScript
- Access modifiers: `public`, `private`, `protected`
- Abstract classes and methods
- Implementing interfaces
- Static members
- When to use classes vs functions

**Friday - Practice:**
- Mini-project: Build a resource manager class hierarchy

```typescript
// Example: Infrastructure resource classes
abstract class Resource {
  protected constructor(
    public readonly id: string,
    public readonly name: string,
    protected tags: Record<string, string> = {}
  ) {}

  abstract getArn(): string;
  abstract estimateCost(): number;

  addTag(key: string, value: string): void {
    this.tags[key] = value;
  }

  getTags(): Readonly<Record<string, string>> {
    return { ...this.tags };
  }
}

class EC2Instance extends Resource {
  constructor(
    id: string,
    name: string,
    private instanceType: string,
    private region: string,
    tags?: Record<string, string>
  ) {
    super(id, name, tags);
  }

  getArn(): string {
    return `arn:aws:ec2:${this.region}::instance/${this.id}`;
  }

  estimateCost(): number {
    // Simplified cost estimation
    const costs: Record<string, number> = {
      't3.micro': 8.50,
      't3.small': 17.00,
      't3.medium': 34.00,
    };
    return costs[this.instanceType] || 0;
  }
}

// Challenge: Implement S3Bucket and RDSInstance classes
```

**Resources:**
- [TypeScript Handbook - Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [JavaScript.info - Classes](https://javascript.info/classes)
- [MDN - Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- 📺 [Fireship - OOP in 100 seconds](https://www.youtube.com/watch?v=pTB0EiLXUC8)
- 📺 [Web Dev Simplified - JavaScript Classes](https://www.youtube.com/watch?v=5AWRivBk0Gw)
- 📺 [Jack Herrington - TypeScript Classes](https://www.youtube.com/watch?v=fsVL_xrYO0w)

---

### Week 8: Error Handling & Modules

**Tuesday - Theory:**
- Error handling patterns in TypeScript
- Custom error classes
- Result types (Either pattern)
- ES modules: import/export
- Module resolution
- Barrel files and re-exports

**Friday - Practice:**
- Mini-project: Build a result type and error handling utilities

```typescript
// Example: Result type for safer error handling
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { success: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// Usage in infrastructure operations
interface DeploymentError {
  code: 'TIMEOUT' | 'ROLLBACK' | 'VALIDATION' | 'PERMISSION';
  message: string;
  details?: unknown;
}

async function deploy(
  config: DeploymentConfig
): Promise<Result<DeploymentResult, DeploymentError>> {
  try {
    // Validate
    if (!config.version) {
      return err({ code: 'VALIDATION', message: 'Version required' });
    }
    
    // Deploy...
    const result = await performDeployment(config);
    return ok(result);
  } catch (e) {
    return err({ code: 'ROLLBACK', message: String(e) });
  }
}

// Challenge: Implement `map`, `flatMap`, and `unwrapOr` for Result type
```

**Resources:**
- [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [JavaScript.info - Error Handling](https://javascript.info/error-handling)
- [JavaScript.info - Modules](https://javascript.info/modules-intro)
- [MDN - JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- 📺 [Web Dev Simplified - ES Modules](https://www.youtube.com/watch?v=cRHQNNcYf6s)
- 📺 [Fireship - Modules in 100 seconds](https://www.youtube.com/watch?v=qgRUr-YUk1Q)
- 📺 [Matt Pocock - Error Handling in TypeScript](https://www.youtube.com/watch?v=53gliDkXwaI)

---

## Phase 3: Real-World Projects (Weeks 9-12)

### Weeks 9-10: Project - CLI Tool

Build a complete CLI tool that solves a real problem. Suggested project: **Infrastructure Cost Reporter**

**Features to implement:**
1. Parse command-line arguments
2. Read configuration from file or environment
3. Fetch data from an API (mock or real)
4. Transform and aggregate data
5. Output formatted results (table, JSON, CSV)
6. Handle errors gracefully

```typescript
// Project structure
// cli-tool/
// ├── src/
// │   ├── index.ts          # Entry point
// │   ├── cli.ts            # Argument parsing
// │   ├── config.ts         # Configuration loading
// │   ├── api/
// │   │   └── client.ts     # API client
// │   ├── services/
// │   │   └── reporter.ts   # Business logic
// │   ├── formatters/
// │   │   ├── table.ts
// │   │   ├── json.ts
// │   │   └── csv.ts
// │   └── types/
// │       └── index.ts      # Shared types
// ├── package.json
// └── tsconfig.json

// Example CLI interface
// $ cost-report --region us-east-1 --format table --group-by service
// $ cost-report --config ./config.json --output report.csv
```

**Learning goals:**
- Project structure and organization
- Dependency management
- Building and distributing TypeScript apps
- Real-world error handling

**Recommended libraries:**
- `commander` or `yargs` for CLI parsing
- `chalk` for colored output
- `cli-table3` for table formatting

---

### Weeks 11-12: Project - REST API Server

Build a simple REST API. Suggested project: **Resource Inventory API**

**Features to implement:**
1. CRUD endpoints for resources
2. Input validation
3. Error handling middleware
4. Simple authentication
5. Request logging

```typescript
// Project structure
// api-server/
// ├── src/
// │   ├── index.ts
// │   ├── app.ts
// │   ├── routes/
// │   │   └── resources.ts
// │   ├── middleware/
// │   │   ├── auth.ts
// │   │   ├── validation.ts
// │   │   └── errorHandler.ts
// │   ├── services/
// │   │   └── resourceService.ts
// │   ├── types/
// │   │   └── index.ts
// │   └── utils/
// │       └── logger.ts
// ├── package.json
// └── tsconfig.json

// Example endpoints
// GET    /api/resources
// GET    /api/resources/:id
// POST   /api/resources
// PUT    /api/resources/:id
// DELETE /api/resources/:id
```

**Learning goals:**
- HTTP server fundamentals
- Middleware patterns
- Request/response typing
- API design

**Recommended frameworks:**
- Hono (lightweight, great TypeScript support)
- Fastify (fast, good DX)
- Express with `@types/express`

---

## Phase 4: Advanced & Quality (Weeks 13-16)

### Weeks 13-14: Testing

**Tuesday - Theory:**
- Unit testing fundamentals
- Test structure: Arrange, Act, Assert
- Mocking and stubbing
- Test coverage
- Integration vs unit tests

**Friday - Practice:**
- Add tests to your CLI tool and API projects

```typescript
// Example: Testing with Vitest
import { describe, it, expect, vi } from 'vitest';
import { createStore } from './store';

describe('Store', () => {
  it('should store and retrieve values', () => {
    const store = createStore<{ name: string }>();
    
    store.set('1', { name: 'test' });
    
    expect(store.get('1')).toEqual({ name: 'test' });
  });

  it('should return undefined for missing keys', () => {
    const store = createStore<string>();
    
    expect(store.get('missing')).toBeUndefined();
  });

  it('should find items matching predicate', () => {
    const store = createStore<{ name: string; active: boolean }>();
    store.set('1', { name: 'Alice', active: true });
    store.set('2', { name: 'Bob', active: false });
    
    const found = store.find(item => item.active);
    
    expect(found).toEqual({ name: 'Alice', active: true });
  });
});

// Mocking example
describe('API Client', () => {
  it('should handle network errors', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
    
    const result = await checkService('http://example.com');
    
    expect(result.status).toBe('down');
  });
});
```

**Resources:**
- [Vitest Documentation](https://vitest.dev/)
- [Vitest - Getting Started](https://vitest.dev/guide/)
- [Testing Library Docs](https://testing-library.com/docs/)
- [Kent C. Dodds - Testing JavaScript](https://testingjavascript.com/) (paid but excellent)
- 📺 [Fireship - Testing in 100 seconds](https://www.youtube.com/watch?v=u6QfIXgjwGQ)
- 📺 [Jack Herrington - Vitest Tutorial](https://www.youtube.com/watch?v=7f-71kYhK00)
- 📺 [Web Dev Simplified - JavaScript Testing](https://www.youtube.com/watch?v=FgnxcUQ5vho)

---

### Weeks 15-16: Advanced Patterns

**Topics to explore:**
- Mapped types and template literal types
- Decorator patterns
- Dependency injection
- Builder pattern
- Repository pattern

```typescript
// Example: Advanced type patterns
// Template literal types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiRoute = `/${string}`;
type ApiEndpoint = `${HttpMethod} ${ApiRoute}`;

// Mapped types
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };

// Builder pattern
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];
  private sortFn?: (a: T, b: T) => number;
  private limitCount?: number;

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate);
    return this;
  }

  orderBy<K extends keyof T>(key: K, direction: 'asc' | 'desc' = 'asc'): this {
    this.sortFn = (a, b) => {
      const modifier = direction === 'asc' ? 1 : -1;
      return a[key] > b[key] ? modifier : -modifier;
    };
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  execute(data: T[]): T[] {
    let result = data.filter(item => this.filters.every(f => f(item)));
    if (this.sortFn) result = result.sort(this.sortFn);
    if (this.limitCount) result = result.slice(0, this.limitCount);
    return result;
  }
}
```

---

## Additional Resources

### Books
- "Programming TypeScript" by Boris Cherny
- "Effective TypeScript" by Dan Vanderkam

### Online Courses
- [Execute Program - TypeScript](https://www.executeprogram.com/courses/typescript)
- [Total TypeScript](https://www.totaltypescript.com/) by Matt Pocock

### Practice Platforms (No Account Required)
- [TypeScript Exercises](https://typescript-exercises.github.io/) - interactive, no signup
- [W3Resource TypeScript](https://www.w3resource.com/typescript-exercises/) - 100+ exercises with solutions
- [W3Schools TypeScript](https://www.w3schools.com/typescript/typescript_exercises.php) - quick exercises
- [Total TypeScript Tutorials](https://www.totaltypescript.com/tutorials) - free interactive tutorials
- [Type Challenges](https://github.com/type-challenges/type-challenges) - advanced type puzzles on GitHub
- [FoggyCode](https://foggycode.com/) - interactive TypeScript challenges

### YouTube Channels
- Matt Pocock (TypeScript tips)
- Theo - t3.gg (web dev ecosystem)
- Fireship (quick overviews)

---

## Notes & Reflections

See [NOTES.md](./NOTES.md) for your learning journal.
