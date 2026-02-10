# TypeScript Playground

A local web app for testing JavaScript and TypeScript code snippets.

## Running the App

You can open it directly in your browser or use a local server:

### Option 1: Direct file open
Just open `index.html` in your browser:
```bash
open app/index.html
# or on Linux:
xdg-open app/index.html
```

### Option 2: Local server (recommended)
```bash
cd app
npx serve .
# or
python3 -m http.server 8000
```

Then open http://localhost:8000 (or the port shown).

## Features

- **TypeScript & JavaScript support** - Switch between languages
- **Real-time compilation** - TypeScript compiles in the browser
- **Console output** - `console.log`, `console.error`, etc. display in the output panel
- **Keyboard shortcuts**:
  - `Ctrl+Enter` - Run code
  - `Ctrl+L` - Clear output
  - `Tab` - Insert spaces
- **Auto-save** - Your code persists in localStorage
- **Resizable panels** - Drag the divider to resize

## How It Works

- Uses the official TypeScript compiler loaded from CDN
- Code runs in a sandboxed `Function()` with a custom console
- No server needed - everything runs in the browser

## Example Code to Try

```typescript
// Test closures
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    value: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2

// Test async/await
async function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Data loaded!"), 1000);
  });
}

fetchData().then(console.log);

// Test generics
function identity<T>(value: T): T {
  return value;
}

console.log(identity<string>("hello"));
console.log(identity<number>(42));
```
