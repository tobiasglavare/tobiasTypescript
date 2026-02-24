# TypeScript Learning Journey

A structured plan to master TypeScript fundamentals and become a stronger developer.

**Background:** Bash, Python, infrastructure code (cdktf-extras)

---

## Progress Tracker

| # | Chapter | Status |
|---|---------|--------|
| 1 | JavaScript Fundamentals | ✅ |
| 2 | TypeScript Basics | ✅ |
| 3 | Arrays & Functional Methods | ⬜ |
| 4 | Async Programming | ⬜ |
| 5 | Generics | ⬜ |
| 6 | Advanced Types | ⬜ |
| 7 | OOP & Classes | ⬜ |
| 8 | Error Handling & Modules | ⬜ |
| 9 | Project: CLI Tool | ⬜ |
| 10 | Project: API Server | ⬜ |
| 11 | Testing | ⬜ |
| 12 | Advanced Patterns | ⬜ |

---

## Part 1: Foundations

### Chapter 1: JavaScript Fundamentals

📖 **Full reference:** [docs/01-js-fundamentals.md](./docs/01-js-fundamentals.md)

**Topics:**
- Variables: `let`, `const`, `var` and scoping
- Data types: primitives and objects
- Functions: declarations, expressions, arrow functions
- Scope: global, function, block, lexical
- Closures: the most important concept
- Objects: literals, destructuring, spread
- The `this` keyword

**Practice:**
- Exercises on [Exercism JavaScript](https://exercism.org/tracks/javascript) or [W3Resource](https://www.w3resource.com/javascript-exercises/)
- Mini-project: Create a counter factory using closures

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

---

### Chapter 2: TypeScript Basics

📖 **Full reference:** [docs/02-typescript-basics.md](./docs/02-typescript-basics.md)

**Topics:**
- Setting up a TypeScript project (`tsconfig.json`)
- Basic types: `string`, `number`, `boolean`, `array`, `tuple`
- Type annotations vs type inference
- Interfaces vs type aliases
- Optional and readonly properties

**Practice:**
- Convert JavaScript files to TypeScript
- Mini-project: Create typed configuration objects

```typescript
interface ServerConfig {
  readonly name: string;
  region: 'us-east-1' | 'eu-west-1' | 'ap-southeast-1';
  instanceType: string;
  tags?: Record<string, string>;
}
```

---

### Chapter 3: Arrays & Functional Methods

📖 **Full reference:** [docs/03-arrays-functional.md](./docs/03-arrays-functional.md)

**Topics:**
- Array methods: `map`, `filter`, `reduce`, `find`, `some`, `every`
- Method chaining
- Immutability patterns
- Typing arrays and tuples

**Practice:**
- Array exercises on [Exercism](https://exercism.org/tracks/typescript) or [Codewars](https://www.codewars.com/)
- Mini-project: Build a data transformation pipeline

```typescript
const resources: Resource[] = [/* ... */];

const expensiveInProduction = resources
  .filter(r => r.tags.env === 'production')
  .filter(r => r.cost > 100)
  .map(r => ({ name: r.name, cost: r.cost }))
  .sort((a, b) => b.cost - a.cost);
```

---

### Chapter 4: Async Programming

📖 **Full reference:** [docs/04-async.md](./docs/04-async.md)

**Topics:**
- Callbacks and callback hell
- Promises: creation, chaining, error handling
- `async`/`await` syntax
- `Promise.all`, `Promise.race`, `Promise.allSettled`
- Typing async functions

**Practice:**
- Mini-project: Build an async service health checker

```typescript
async function checkService(url: string): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const response = await fetch(url);
    return {
      service: url,
      status: response.ok ? 'healthy' : 'degraded',
      latencyMs: Date.now() - start,
    };
  } catch {
    return { service: url, status: 'down', latencyMs: Date.now() - start };
  }
}
```

---

## Part 2: Intermediate Concepts

### Chapter 5: Generics

📖 **Full reference:** [docs/05-generics.md](./docs/05-generics.md)

**Topics:**
- Generic functions and type parameters
- Generic interfaces and classes
- Constraints with `extends`
- Default type parameters
- Utility types: `Partial`, `Required`, `Pick`, `Omit`, `Record`

**Practice:**
- Mini-project: Build a generic data store

```typescript
interface Store<T> {
  get(id: string): T | undefined;
  set(id: string, value: T): void;
  delete(id: string): boolean;
  list(): T[];
}

function createStore<T>(): Store<T> {
  const data = new Map<string, T>();
  return {
    get: (id) => data.get(id),
    set: (id, value) => { data.set(id, value); },
    delete: (id) => data.delete(id),
    list: () => Array.from(data.values()),
  };
}
```

---

### Chapter 6: Advanced Types

📖 **Full reference:** [docs/06-advanced-types.md](./docs/06-advanced-types.md)

**Topics:**
- Union and intersection types
- Type guards and narrowing
- Discriminated unions
- `keyof` and indexed access types
- Conditional types basics

**Practice:**
- Mini-project: Build a type-safe event system

```typescript
type InfraEvent =
  | { type: 'instance.created'; instanceId: string; region: string }
  | { type: 'instance.terminated'; instanceId: string; reason: string }
  | { type: 'deployment.completed'; version: string; durationMs: number };

function handleEvent(event: InfraEvent): string {
  switch (event.type) {
    case 'instance.created':
      return `Instance ${event.instanceId} created in ${event.region}`;
    case 'instance.terminated':
      return `Instance ${event.instanceId} terminated: ${event.reason}`;
    case 'deployment.completed':
      return `Deployed ${event.version} in ${event.durationMs}ms`;
  }
}
```

---

### Chapter 7: OOP & Classes

📖 **Full reference:** [docs/07-oop-classes.md](./docs/07-oop-classes.md)

**Topics:**
- Classes in TypeScript
- Access modifiers: `public`, `private`, `protected`
- Abstract classes and methods
- Implementing interfaces
- Static members
- When to use classes vs functions

**Practice:**
- Mini-project: Build a resource manager class hierarchy

```typescript
abstract class Resource {
  constructor(
    public readonly id: string,
    public readonly name: string
  ) {}

  abstract getArn(): string;
  abstract estimateCost(): number;
}

class EC2Instance extends Resource {
  constructor(id: string, name: string, private instanceType: string) {
    super(id, name);
  }
  
  getArn(): string {
    return `arn:aws:ec2:::instance/${this.id}`;
  }
  
  estimateCost(): number {
    const costs: Record<string, number> = { 't3.micro': 8.50, 't3.small': 17 };
    return costs[this.instanceType] || 0;
  }
}
```

---

### Chapter 8: Error Handling & Modules

📖 **Full reference:** [docs/08-errors-modules.md](./docs/08-errors-modules.md)

**Topics:**
- Error handling patterns
- Custom error classes
- Result types (Either pattern)
- ES modules: import/export
- Module organization and barrel files

**Practice:**
- Mini-project: Build a Result type with utilities

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
```

---

## Part 3: Projects

### Chapter 9: CLI Tool Project

📖 **Full reference:** [docs/09-cli-project.md](./docs/09-cli-project.md)

Build a command-line tool. Suggested: **Infrastructure Cost Reporter**

**Features:**
- Parse command-line arguments (Commander)
- Read configuration from file/environment
- Fetch and transform data
- Output formatted results (table, JSON, CSV)
- Error handling

---

### Chapter 10: API Server Project

📖 **Full reference:** [docs/10-api-project.md](./docs/10-api-project.md)

Build a REST API. Suggested: **Resource Inventory API**

**Features:**
- CRUD endpoints
- Input validation
- Error handling middleware
- Request logging
- Simple authentication

---

## Part 4: Quality & Advanced

### Chapter 11: Testing

📖 **Full reference:** [docs/11-testing.md](./docs/11-testing.md)

**Topics:**
- Unit testing with Vitest
- Test structure: Arrange, Act, Assert
- Mocking and stubbing
- Test coverage

**Practice:**
- Add tests to your CLI and API projects

---

### Chapter 12: Advanced Patterns

📖 **Full reference:** [docs/12-advanced-patterns.md](./docs/12-advanced-patterns.md)

**Topics:**
- Template literal types
- Mapped types
- Conditional types
- Design patterns: Builder, Factory, Repository
- Dependency injection

---

## Additional Resources

### Exercism Exercises by Chapter

The [Exercism TypeScript track](https://exercism.org/tracks/typescript) has ~100 exercises. Here are recommended ones for each chapter:

**Chapter 1-2: Fundamentals & Basics**
- `hello-world` - Setup and workflow intro
- `two-fer` - String interpolation, default params
- `resistor-color` - Arrays, indexOf
- `resistor-color-duo` - Array manipulation
- `rna-transcription` - String mapping
- `leap` - Boolean logic, conditionals

**Chapter 3: Arrays & Functional**
- `resistor-color-trio` - Array methods
- `acronym` - map, join, string methods
- `isogram` - filter, Set
- `pangram` - every, some
- `bob` - String analysis
- `difference-of-squares` - reduce
- `sum-of-multiples` - filter, reduce
- `flatten-array` - Recursion, flat

**Chapter 4: Async**
- `promises` - Promise basics (if available)
- Practice async patterns with your own mini-projects

**Chapter 5: Generics**
- `linked-list` - Generic data structure
- `simple-linked-list` - Generic list
- `list-ops` - Generic list operations (map, filter, reduce)
- `binary-search-tree` - Generic tree

**Chapter 6: Advanced Types**
- `grade-school` - Record types, sorting
- `robot-name` - State management
- `clock` - Value objects, equality
- `complex-numbers` - Custom types

**Chapter 7: OOP & Classes**
- `robot-simulator` - Classes, state
- `bank-account` - Encapsulation
- `circular-buffer` - Class with generics
- `simple-cipher` - Class methods

**Chapter 8: Error Handling**
- `grains` - Error throwing
- `queen-attack` - Validation, errors
- `bowling` - Complex validation
- `error-handling` - Try/catch patterns

**Difficulty progression:**
- Easy (1-3): hello-world, two-fer, resistor-color, leap
- Medium (4-6): acronym, isogram, clock, robot-simulator
- Hard (7-10): linked-list, bowling, binary-search-tree

Start with `hello-world`, then pick 2-3 exercises per chapter that interest you.

---

### Books
- "Programming TypeScript" by Boris Cherny
- "Effective TypeScript" by Dan Vanderkam

### Online Courses
- [Execute Program - TypeScript](https://www.executeprogram.com/courses/typescript)
- [Total TypeScript](https://www.totaltypescript.com/) by Matt Pocock

### Practice Platforms

**Recommended (account required):**
- [Exercism](https://exercism.org/tracks/typescript) - Free, mentored exercises. ⭐ Highly recommended
- [Codewars](https://www.codewars.com/) - Gamified challenges ranked by difficulty
- [LeetCode](https://leetcode.com/) - Algorithm-focused, good for interview prep

**No account required:**
- [TypeScript Exercises](https://typescript-exercises.github.io/)
- [W3Resource TypeScript](https://www.w3resource.com/typescript-exercises/)
- [Type Challenges](https://github.com/type-challenges/type-challenges) - Advanced type puzzles

### YouTube Channels
- Matt Pocock (TypeScript tips)
- Theo - t3.gg (web dev ecosystem)
- Fireship (quick overviews)

---

## Notes & Reflections

See [NOTES.md](./NOTES.md) for your learning journal.
