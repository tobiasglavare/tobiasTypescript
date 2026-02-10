# Week 7: OOP & Classes

This document covers object-oriented programming in TypeScript — classes, inheritance, and access modifiers.

---

## 1. Class Basics

```typescript
class Person {
  // Properties
  name: string;
  age: number;

  // Constructor
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // Method
  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

const alice = new Person("Alice", 30);
console.log(alice.greet());  // "Hello, I'm Alice"
```

### Shorthand constructor

```typescript
// Instead of declaring properties and assigning in constructor:
class Person {
  constructor(
    public name: string,
    public age: number
  ) {}
  // Properties are automatically created and assigned
}

const bob = new Person("Bob", 25);
console.log(bob.name);  // "Bob"
```

---

## 2. Access Modifiers

Control property/method visibility:

### public (default)

```typescript
class Person {
  public name: string;  // Accessible everywhere
  
  constructor(name: string) {
    this.name = name;
  }
}

const p = new Person("Alice");
console.log(p.name);  // ✅ OK
```

### private

```typescript
class BankAccount {
  private balance: number;  // Only accessible within class
  
  constructor(initial: number) {
    this.balance = initial;
  }
  
  deposit(amount: number): void {
    this.balance += amount;
  }
  
  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(account.getBalance());  // 150
console.log(account.balance);       // ❌ Error: private
```

### protected

```typescript
class Animal {
  protected name: string;  // Accessible in class and subclasses
  
  constructor(name: string) {
    this.name = name;
  }
}

class Dog extends Animal {
  bark(): string {
    return `${this.name} says woof!`;  // ✅ Can access protected
  }
}

const dog = new Dog("Buddy");
console.log(dog.bark());  // "Buddy says woof!"
console.log(dog.name);    // ❌ Error: protected
```


### readonly

```typescript
class Config {
  readonly apiUrl: string;
  
  constructor(url: string) {
    this.apiUrl = url;  // Can set in constructor
  }
  
  updateUrl(url: string): void {
    this.apiUrl = url;  // ❌ Error: readonly
  }
}
```

### Private fields (ES2022)

```typescript
class Counter {
  #count = 0;  // True private (not just TypeScript)
  
  increment(): void {
    this.#count++;
  }
  
  get value(): number {
    return this.#count;
  }
}

const counter = new Counter();
counter.increment();
console.log(counter.value);   // 1
console.log(counter.#count);  // ❌ Syntax error
```

---

## 3. Getters and Setters

```typescript
class Circle {
  private _radius: number;
  
  constructor(radius: number) {
    this._radius = radius;
  }
  
  // Getter
  get radius(): number {
    return this._radius;
  }
  
  // Setter with validation
  set radius(value: number) {
    if (value < 0) {
      throw new Error("Radius cannot be negative");
    }
    this._radius = value;
  }
  
  // Computed property (getter only)
  get area(): number {
    return Math.PI * this._radius ** 2;
  }
}

const circle = new Circle(5);
console.log(circle.radius);  // 5
console.log(circle.area);    // 78.54...

circle.radius = 10;          // Uses setter
circle.radius = -1;          // Throws error
```

---

## 4. Static Members

Belong to the class itself, not instances:

```typescript
class MathUtils {
  static PI = 3.14159;
  
  static square(n: number): number {
    return n * n;
  }
  
  static cube(n: number): number {
    return n * n * n;
  }
}

// Access without creating instance
console.log(MathUtils.PI);        // 3.14159
console.log(MathUtils.square(4)); // 16
```

### Static factory methods

```typescript
class User {
  private constructor(
    public id: string,
    public name: string,
    public email: string
  ) {}
  
  // Factory methods
  static create(name: string, email: string): User {
    const id = crypto.randomUUID();
    return new User(id, name, email);
  }
  
  static fromJSON(json: string): User {
    const data = JSON.parse(json);
    return new User(data.id, data.name, data.email);
  }
}

const user = User.create("Alice", "alice@example.com");
```

---

## 5. Inheritance

```typescript
class Animal {
  constructor(public name: string) {}
  
  move(distance: number): void {
    console.log(`${this.name} moved ${distance}m`);
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name);  // Call parent constructor
  }
  
  bark(): void {
    console.log(`${this.name} says woof!`);
  }
  
  // Override parent method
  move(distance: number): void {
    console.log("Running...");
    super.move(distance);  // Call parent method
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.bark();     // "Buddy says woof!"
dog.move(10);   // "Running..." then "Buddy moved 10m"
```


---

## 6. Abstract Classes

Cannot be instantiated directly — must be extended:

```typescript
abstract class Shape {
  constructor(public color: string) {}
  
  // Abstract method: must be implemented by subclasses
  abstract getArea(): number;
  
  // Concrete method: inherited as-is
  describe(): string {
    return `A ${this.color} shape with area ${this.getArea()}`;
  }
}

class Circle extends Shape {
  constructor(color: string, public radius: number) {
    super(color);
  }
  
  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(
    color: string,
    public width: number,
    public height: number
  ) {
    super(color);
  }
  
  getArea(): number {
    return this.width * this.height;
  }
}

// const shape = new Shape("red");  // ❌ Cannot instantiate abstract class
const circle = new Circle("red", 5);
console.log(circle.describe());  // "A red shape with area 78.54..."
```

---

## 7. Implementing Interfaces

```typescript
interface Printable {
  print(): void;
}

interface Serializable {
  toJSON(): string;
}

class Document implements Printable, Serializable {
  constructor(public title: string, public content: string) {}
  
  print(): void {
    console.log(`${this.title}\n${this.content}`);
  }
  
  toJSON(): string {
    return JSON.stringify({ title: this.title, content: this.content });
  }
}

// Interface as type
function printAll(items: Printable[]): void {
  items.forEach(item => item.print());
}
```

### Interface vs Abstract Class

| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| Multiple inheritance | Yes | No |
| Implementation | No | Can have |
| Properties | Declarations only | Can have values |
| Access modifiers | No | Yes |
| Constructor | No | Yes |

```typescript
// Use interface when you only need a contract
interface Logger {
  log(message: string): void;
}

// Use abstract class when you need shared implementation
abstract class BaseLogger implements Logger {
  abstract log(message: string): void;
  
  // Shared implementation
  error(message: string): void {
    this.log(`ERROR: ${message}`);
  }
}
```

---

## 8. Generic Classes

```typescript
class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop());  // 2

const stringStack = new Stack<string>();
stringStack.push("hello");
```

### Generic constraints in classes

```typescript
interface HasId {
  id: string;
}

class Repository<T extends HasId> {
  private items = new Map<string, T>();
  
  add(item: T): void {
    this.items.set(item.id, item);
  }
  
  get(id: string): T | undefined {
    return this.items.get(id);
  }
  
  getAll(): T[] {
    return Array.from(this.items.values());
  }
}
```


---

## 9. When to Use Classes vs Functions

### Use classes when:
- You need to maintain state across method calls
- You have related methods that operate on shared data
- You need inheritance hierarchies
- You're implementing design patterns (Factory, Singleton, etc.)

### Use functions when:
- Logic is stateless
- You need simple data transformations
- You want easier testing and composition
- You prefer functional programming style

```typescript
// Class approach
class UserService {
  constructor(private apiUrl: string) {}
  
  async getUser(id: string): Promise<User> {
    const response = await fetch(`${this.apiUrl}/users/${id}`);
    return response.json();
  }
}

// Functional approach
const createUserService = (apiUrl: string) => ({
  getUser: async (id: string): Promise<User> => {
    const response = await fetch(`${apiUrl}/users/${id}`);
    return response.json();
  }
});

// Or even simpler
const getUser = (apiUrl: string) => async (id: string): Promise<User> => {
  const response = await fetch(`${apiUrl}/users/${id}`);
  return response.json();
};
```

---

## 10. Practical Example: Resource Manager

```typescript
// Base resource class
abstract class Resource {
  protected constructor(
    public readonly id: string,
    public readonly name: string,
    protected tags: Record<string, string> = {}
  ) {}

  abstract getArn(): string;
  abstract estimateMonthlyCost(): number;

  addTag(key: string, value: string): void {
    this.tags[key] = value;
  }

  getTags(): Readonly<Record<string, string>> {
    return { ...this.tags };
  }

  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      arn: this.getArn(),
      tags: this.tags,
      estimatedCost: this.estimateMonthlyCost()
    };
  }
}

// EC2 Instance
class EC2Instance extends Resource {
  private static readonly HOURLY_COSTS: Record<string, number> = {
    "t3.micro": 0.0104,
    "t3.small": 0.0208,
    "t3.medium": 0.0416,
    "m5.large": 0.096,
  };

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

  estimateMonthlyCost(): number {
    const hourlyRate = EC2Instance.HOURLY_COSTS[this.instanceType] || 0;
    return hourlyRate * 24 * 30;  // Hours per month
  }
}

// S3 Bucket
class S3Bucket extends Resource {
  constructor(
    id: string,
    name: string,
    private region: string,
    private storageSizeGB: number = 0,
    tags?: Record<string, string>
  ) {
    super(id, name, tags);
  }

  getArn(): string {
    return `arn:aws:s3:::${this.name}`;
  }

  estimateMonthlyCost(): number {
    return this.storageSizeGB * 0.023;  // $0.023 per GB
  }

  setStorageSize(sizeGB: number): void {
    this.storageSizeGB = sizeGB;
  }
}

// Resource Manager
class ResourceManager {
  private resources: Resource[] = [];

  add(resource: Resource): void {
    this.resources.push(resource);
  }

  getTotalMonthlyCost(): number {
    return this.resources.reduce(
      (total, r) => total + r.estimateMonthlyCost(),
      0
    );
  }

  findByTag(key: string, value: string): Resource[] {
    return this.resources.filter(r => r.getTags()[key] === value);
  }

  generateReport(): object[] {
    return this.resources.map(r => r.toJSON());
  }
}

// Usage
const manager = new ResourceManager();

const webServer = new EC2Instance(
  "i-123",
  "web-server",
  "t3.medium",
  "us-east-1",
  { environment: "production" }
);

const dataBucket = new S3Bucket(
  "bucket-456",
  "my-data-bucket",
  "us-east-1",
  100
);
dataBucket.addTag("environment", "production");

manager.add(webServer);
manager.add(dataBucket);

console.log(`Total monthly cost: $${manager.getTotalMonthlyCost().toFixed(2)}`);
console.log(manager.findByTag("environment", "production"));
```

---

## Quick Reference

### Class Syntax
```typescript
class MyClass {
  public prop: Type;           // Public property
  private _prop: Type;         // Private property
  protected prop: Type;        // Protected property
  readonly prop: Type;         // Readonly property
  static prop: Type;           // Static property
  
  constructor(param: Type) {}  // Constructor
  
  method(): ReturnType {}      // Instance method
  static method(): Type {}     // Static method
  
  get prop(): Type {}          // Getter
  set prop(v: Type) {}         // Setter
}
```

### Inheritance
```typescript
class Child extends Parent {
  constructor() {
    super();  // Call parent constructor
  }
  
  method(): void {
    super.method();  // Call parent method
  }
}
```

### Abstract Classes
```typescript
abstract class Base {
  abstract method(): void;     // Must implement
  concreteMethod(): void {}    // Inherited
}
```

### Interfaces
```typescript
interface MyInterface {
  prop: Type;
  method(): ReturnType;
}

class MyClass implements MyInterface { }
```

---

## Exercises

1. **Bank Account:** Create a BankAccount class with deposit, withdraw, and balance methods. Use private for balance.

2. **Shape Hierarchy:** Create an abstract Shape class with Circle, Rectangle, and Triangle subclasses.

3. **Generic Repository:** Build a generic Repository<T> class with CRUD operations.

4. **Logger System:** Create a Logger interface and implement ConsoleLogger and FileLogger classes.

5. **Resource Manager:** Extend the example to add RDS and Lambda resource types.
