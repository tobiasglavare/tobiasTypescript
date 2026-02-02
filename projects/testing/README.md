# Testing Practice (Weeks 13-14)

Learn and practice testing with TypeScript.

## Setup

```bash
npm init -y
npm install typescript @types/node -D
npm install vitest -D
npx tsc --init
```

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

## Topics to Practice

- [ ] Unit testing fundamentals
- [ ] Test structure: Arrange, Act, Assert
- [ ] Mocking and stubbing
- [ ] Test coverage
- [ ] Integration vs unit tests

## Example Test Structure

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('MyFunction', () => {
  it('should do something expected', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Exercises

1. Write tests for your Week 5 generic store
2. Add tests to your CLI tool project
3. Write integration tests for your API server
4. Practice mocking external dependencies
