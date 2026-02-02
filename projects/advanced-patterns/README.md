# Advanced Patterns (Weeks 15-16)

Explore advanced TypeScript patterns and techniques.

## Topics to Practice

- [ ] Mapped types and template literal types
- [ ] Decorator patterns
- [ ] Dependency injection
- [ ] Builder pattern
- [ ] Repository pattern

## Example Patterns

### Template Literal Types

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiRoute = `/${string}`;
type ApiEndpoint = `${HttpMethod} ${ApiRoute}`;
```

### Builder Pattern

```typescript
class QueryBuilder<T> {
  where(predicate: (item: T) => boolean): this { /* ... */ }
  orderBy<K extends keyof T>(key: K): this { /* ... */ }
  limit(count: number): this { /* ... */ }
  execute(data: T[]): T[] { /* ... */ }
}
```

### Mapped Types

```typescript
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
```

## Resources

- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [TypeScript Deep Dive - Advanced Types](https://basarat.gitbook.io/typescript/type-system)
