# API Server Project (Weeks 11-12)

Build a REST API server with TypeScript.

## Suggested Project: Resource Inventory API

A simple API to manage infrastructure resources.

## Features to Implement

- [ ] CRUD endpoints for resources
- [ ] Input validation
- [ ] Error handling middleware
- [ ] Simple authentication
- [ ] Request logging

## Getting Started

```bash
npm init -y
npm install typescript @types/node -D
npm install hono @hono/node-server
# OR for Express:
# npm install express @types/express
npx tsc --init
```

## Suggested Structure

```
api-server/
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── routes/
│   │   └── resources.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── services/
│   │   └── resourceService.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── logger.ts
├── package.json
└── tsconfig.json
```

## API Endpoints

```
GET    /api/resources        # List all resources
GET    /api/resources/:id    # Get single resource
POST   /api/resources        # Create resource
PUT    /api/resources/:id    # Update resource
DELETE /api/resources/:id    # Delete resource
```

## Example Resource Schema

```typescript
interface Resource {
  id: string;
  type: 'ec2' | 's3' | 'rds' | 'lambda';
  name: string;
  region: string;
  tags: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}
```
