# Weeks 9-10: CLI Tool Project

This guide helps you build a command-line tool in TypeScript.

---

## 1. Project Setup

```bash
mkdir cli-tool && cd cli-tool
npm init -y
npm install typescript @types/node -D
npm install commander chalk cli-table3
npx tsc --init
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

### package.json scripts

```json
{
  "name": "my-cli",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "my-cli": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  }
}
```

---

## 2. Argument Parsing with Commander

```typescript
// src/index.ts
#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .name("my-cli")
  .description("A CLI tool built with TypeScript")
  .version("1.0.0");

// Simple command
program
  .command("greet")
  .description("Greet someone")
  .argument("<name>", "Name to greet")
  .option("-l, --loud", "Shout the greeting")
  .action((name: string, options: { loud?: boolean }) => {
    const greeting = `Hello, ${name}!`;
    console.log(options.loud ? greeting.toUpperCase() : greeting);
  });

// Command with options
program
  .command("fetch")
  .description("Fetch data from API")
  .requiredOption("-u, --url <url>", "API URL")
  .option("-f, --format <format>", "Output format", "json")
  .option("-o, --output <file>", "Output file")
  .action(async (options) => {
    console.log(`Fetching from ${options.url}`);
    // Implementation
  });

program.parse();
```

---

## 3. Colored Output with Chalk

```typescript
import chalk from "chalk";

// Basic colors
console.log(chalk.green("Success!"));
console.log(chalk.red("Error!"));
console.log(chalk.yellow("Warning!"));
console.log(chalk.blue("Info"));

// Styles
console.log(chalk.bold("Bold text"));
console.log(chalk.italic("Italic text"));
console.log(chalk.underline("Underlined"));

// Combinations
console.log(chalk.bold.red("Bold red error"));
console.log(chalk.bgRed.white(" ERROR ") + " Something went wrong");

// Template literals
const name = "World";
console.log(chalk`Hello {green ${name}}!`);
```


---

## 4. Tables with cli-table3

```typescript
import Table from "cli-table3";

// Basic table
const table = new Table({
  head: ["Name", "Age", "City"],
  colWidths: [20, 10, 15]
});

table.push(
  ["Alice", "30", "New York"],
  ["Bob", "25", "London"],
  ["Charlie", "35", "Tokyo"]
);

console.log(table.toString());

// Styled table
const styledTable = new Table({
  head: [
    chalk.cyan("Resource"),
    chalk.cyan("Type"),
    chalk.cyan("Cost")
  ],
  style: {
    head: [],
    border: ["grey"]
  }
});

styledTable.push(
  ["web-server", "EC2", "$50.00"],
  ["database", "RDS", "$100.00"],
  [{ colSpan: 2, content: chalk.bold("Total") }, chalk.green("$150.00")]
);
```

---

## 5. Configuration Loading

```typescript
// src/config.ts
import { readFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

interface Config {
  apiUrl: string;
  apiKey?: string;
  defaultRegion: string;
  outputFormat: "json" | "table" | "csv";
}

const DEFAULT_CONFIG: Config = {
  apiUrl: "https://api.example.com",
  defaultRegion: "us-east-1",
  outputFormat: "table"
};

export function loadConfig(): Config {
  const configPaths = [
    join(process.cwd(), ".mycli.json"),
    join(homedir(), ".mycli.json")
  ];

  for (const path of configPaths) {
    if (existsSync(path)) {
      try {
        const content = readFileSync(path, "utf-8");
        const userConfig = JSON.parse(content);
        return { ...DEFAULT_CONFIG, ...userConfig };
      } catch (error) {
        console.warn(`Warning: Could not parse ${path}`);
      }
    }
  }

  return DEFAULT_CONFIG;
}

// Environment variable override
export function getConfig(): Config {
  const config = loadConfig();
  
  return {
    ...config,
    apiUrl: process.env.MYCLI_API_URL || config.apiUrl,
    apiKey: process.env.MYCLI_API_KEY || config.apiKey,
  };
}
```

---

## 6. API Client

```typescript
// src/api/client.ts
interface ApiResponse<T> {
  data: T;
  status: number;
}

interface ApiError {
  message: string;
  code: string;
}

type Result<T> = 
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export class ApiClient {
  constructor(
    private baseUrl: string,
    private apiKey?: string
  ) {}

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` })
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        return {
          ok: false,
          error: {
            message: `HTTP ${response.status}: ${response.statusText}`,
            code: "HTTP_ERROR"
          }
        };
      }

      const data = await response.json();
      return { ok: true, data };
    } catch (error) {
      return {
        ok: false,
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          code: "NETWORK_ERROR"
        }
      };
    }
  }

  get<T>(path: string): Promise<Result<T>> {
    return this.request<T>("GET", path);
  }

  post<T>(path: string, body: unknown): Promise<Result<T>> {
    return this.request<T>("POST", path, body);
  }
}
```

---

## 7. Output Formatters

```typescript
// src/formatters/index.ts
import Table from "cli-table3";

export type OutputFormat = "json" | "table" | "csv";

export function formatOutput<T extends Record<string, unknown>>(
  data: T[],
  format: OutputFormat,
  columns?: (keyof T)[]
): string {
  const keys = columns || (Object.keys(data[0] || {}) as (keyof T)[]);

  switch (format) {
    case "json":
      return JSON.stringify(data, null, 2);
    
    case "csv":
      const header = keys.join(",");
      const rows = data.map(item => 
        keys.map(k => String(item[k])).join(",")
      );
      return [header, ...rows].join("\n");
    
    case "table":
      const table = new Table({
        head: keys.map(String)
      });
      data.forEach(item => {
        table.push(keys.map(k => String(item[k])));
      });
      return table.toString();
  }
}

// Usage
const resources = [
  { name: "web-server", type: "EC2", cost: 50 },
  { name: "database", type: "RDS", cost: 100 }
];

console.log(formatOutput(resources, "table"));
console.log(formatOutput(resources, "json"));
console.log(formatOutput(resources, "csv", ["name", "cost"]));
```

---

## 8. Complete Example Structure

```
cli-tool/
├── src/
│   ├── index.ts           # Entry point, CLI definition
│   ├── config.ts          # Configuration loading
│   ├── api/
│   │   └── client.ts      # API client
│   ├── commands/
│   │   ├── list.ts        # List command
│   │   ├── create.ts      # Create command
│   │   └── delete.ts      # Delete command
│   ├── formatters/
│   │   └── index.ts       # Output formatters
│   ├── types/
│   │   └── index.ts       # Shared types
│   └── utils/
│       └── logger.ts      # Logging utilities
├── package.json
└── tsconfig.json
```

---

## 9. Building and Publishing

```bash
# Build
npm run build

# Test locally
npm link
my-cli --help

# Add shebang to dist/index.js (should be automatic)
#!/usr/bin/env node

# Publish to npm
npm publish
```

---

## Project Ideas

1. **Cost Reporter:** Fetch and display cloud resource costs
2. **Log Analyzer:** Parse and summarize log files
3. **API Tester:** Send requests and display responses
4. **File Organizer:** Sort files into directories by type/date
5. **Git Stats:** Show repository statistics
