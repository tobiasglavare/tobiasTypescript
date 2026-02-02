# CLI Tool Project (Weeks 9-10)

Build a command-line tool that solves a real problem.

## Suggested Project: Infrastructure Cost Reporter

A CLI that fetches, transforms, and displays infrastructure cost data.

## Features to Implement

- [ ] Parse command-line arguments
- [ ] Read configuration from file or environment
- [ ] Fetch data from an API (mock or real)
- [ ] Transform and aggregate data
- [ ] Output formatted results (table, JSON, CSV)
- [ ] Handle errors gracefully

## Getting Started

```bash
npm init -y
npm install typescript @types/node -D
npm install commander chalk cli-table3
npx tsc --init
```

## Suggested Structure

```
cli-tool/
├── src/
│   ├── index.ts          # Entry point
│   ├── cli.ts            # Argument parsing
│   ├── config.ts         # Configuration loading
│   ├── api/
│   │   └── client.ts     # API client
│   ├── services/
│   │   └── reporter.ts   # Business logic
│   ├── formatters/
│   │   ├── table.ts
│   │   ├── json.ts
│   │   └── csv.ts
│   └── types/
│       └── index.ts      # Shared types
├── package.json
└── tsconfig.json
```

## Example Usage

```bash
# After building
./cost-report --region us-east-1 --format table --group-by service
./cost-report --config ./config.json --output report.csv
```
