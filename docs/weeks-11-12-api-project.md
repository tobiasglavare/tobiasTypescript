# Weeks 11-12: API Server Project

This guide helps you build a REST API server in TypeScript.

---

## 1. Project Setup with Hono

Hono is a lightweight, fast web framework with excellent TypeScript support.

```bash
mkdir api-server && cd api-server
npm init -y
npm install typescript @types/node -D
npm install hono @hono/node-server
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
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

### package.json

```json
{
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts"
  }
}
```

---

## 2. Basic Server

```typescript
// src/index.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});
```

---

## 3. Route Organization

```typescript
// src/routes/resources.ts
import { Hono } from "hono";
import type { Resource } from "../types";

const resources = new Hono();

// In-memory store (replace with database)
const store = new Map<string, Resource>();

// GET /resources
resources.get("/", (c) => {
  const items = Array.from(store.values());
  return c.json(items);
});

// GET /resources/:id
resources.get("/:id", (c) => {
  const id = c.req.param("id");
  const resource = store.get(id);
  
  if (!resource) {
    return c.json({ error: "Not found" }, 404);
  }
  
  return c.json(resource);
});

// POST /resources
resources.post("/", async (c) => {
  const body = await c.req.json<Omit<Resource, "id">>();
  const id = crypto.randomUUID();
  const resource: Resource = { id, ...body, createdAt: new Date() };
  
  store.set(id, resource);
  return c.json(resource, 201);
});

// PUT /resources/:id
resources.put("/:id", async (c) => {
  const id = c.req.param("id");
  const existing = store.get(id);
  
  if (!existing) {
    return c.json({ error: "Not found" }, 404);
  }
  
  const body = await c.req.json<Partial<Resource>>();
  const updated = { ...existing, ...body, updatedAt: new Date() };
  
  store.set(id, updated);
  return c.json(updated);
});

// DELETE /resources/:id
resources.delete("/:id", (c) => {
  const id = c.req.param("id");
  
  if (!store.has(id)) {
    return c.json({ error: "Not found" }, 404);
  }
  
  store.delete(id);
  return c.json({ deleted: true });
});

export default resources;
```


---

## 4. Middleware

```typescript
// src/middleware/logger.ts
import type { MiddlewareHandler } from "hono";

export const logger: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  
  await next();
  
  const duration = Date.now() - start;
  const status = c.res.status;
  
  console.log(`${method} ${path} ${status} ${duration}ms`);
};

// src/middleware/errorHandler.ts
import type { ErrorHandler } from "hono";

export const errorHandler: ErrorHandler = (err, c) => {
  console.error("Error:", err);
  
  if (err instanceof ValidationError) {
    return c.json({ error: err.message, fields: err.fields }, 400);
  }
  
  if (err instanceof NotFoundError) {
    return c.json({ error: err.message }, 404);
  }
  
  return c.json({ error: "Internal server error" }, 500);
};

// src/middleware/auth.ts
import type { MiddlewareHandler } from "hono";

export const auth: MiddlewareHandler = async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  // Validate token (simplified)
  if (token !== "valid-token") {
    return c.json({ error: "Invalid token" }, 401);
  }
  
  // Add user to context
  c.set("userId", "user-123");
  
  await next();
};
```

---

## 5. Validation

```typescript
// src/middleware/validation.ts
import type { MiddlewareHandler } from "hono";

interface ValidationSchema {
  [key: string]: {
    type: "string" | "number" | "boolean";
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export function validate(schema: ValidationSchema): MiddlewareHandler {
  return async (c, next) => {
    const body = await c.req.json();
    const errors: string[] = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];
      
      if (rules.required && (value === undefined || value === null)) {
        errors.push(`${field} is required`);
        continue;
      }
      
      if (value !== undefined) {
        if (rules.type === "string" && typeof value !== "string") {
          errors.push(`${field} must be a string`);
        }
        
        if (rules.type === "string" && rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }
      }
    }
    
    if (errors.length > 0) {
      return c.json({ error: "Validation failed", details: errors }, 400);
    }
    
    await next();
  };
}

// Usage
resources.post(
  "/",
  validate({
    name: { type: "string", required: true, minLength: 1 },
    type: { type: "string", required: true }
  }),
  async (c) => {
    // Handler
  }
);
```

---

## 6. Types

```typescript
// src/types/index.ts
export interface Resource {
  id: string;
  name: string;
  type: "ec2" | "s3" | "rds" | "lambda";
  region: string;
  tags: Record<string, string>;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateResourceDTO {
  name: string;
  type: Resource["type"];
  region: string;
  tags?: Record<string, string>;
}

export interface UpdateResourceDTO {
  name?: string;
  tags?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiError {
  error: string;
  details?: string[];
  code?: string;
}
```

---

## 7. Service Layer

```typescript
// src/services/resourceService.ts
import type { Resource, CreateResourceDTO, UpdateResourceDTO } from "../types";

// In-memory store (replace with database)
const store = new Map<string, Resource>();

export const resourceService = {
  findAll(): Resource[] {
    return Array.from(store.values());
  },
  
  findById(id: string): Resource | undefined {
    return store.get(id);
  },
  
  create(data: CreateResourceDTO): Resource {
    const resource: Resource = {
      id: crypto.randomUUID(),
      ...data,
      tags: data.tags || {},
      createdAt: new Date()
    };
    store.set(resource.id, resource);
    return resource;
  },
  
  update(id: string, data: UpdateResourceDTO): Resource | undefined {
    const existing = store.get(id);
    if (!existing) return undefined;
    
    const updated: Resource = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };
    store.set(id, updated);
    return updated;
  },
  
  delete(id: string): boolean {
    return store.delete(id);
  },
  
  findByType(type: Resource["type"]): Resource[] {
    return Array.from(store.values()).filter(r => r.type === type);
  }
};
```


---

## 8. Complete App Structure

```typescript
// src/index.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import resources from "./routes/resources";

const app = new Hono();

// Global middleware
app.use("*", cors());
app.use("*", logger);
app.onError(errorHandler);

// Routes
app.get("/health", (c) => c.json({ status: "ok" }));
app.route("/api/resources", resources);

// 404 handler
app.notFound((c) => c.json({ error: "Not found" }, 404));

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});
```

### Project Structure

```
api-server/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   ├── resources.ts
│   │   └── users.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── logger.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── services/
│   │   └── resourceService.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── errors.ts
├── package.json
└── tsconfig.json
```

---

## 9. Testing with curl

```bash
# Health check
curl http://localhost:3000/health

# List resources
curl http://localhost:3000/api/resources

# Create resource
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name": "web-server", "type": "ec2", "region": "us-east-1"}'

# Get single resource
curl http://localhost:3000/api/resources/{id}

# Update resource
curl -X PUT http://localhost:3000/api/resources/{id} \
  -H "Content-Type: application/json" \
  -d '{"name": "updated-name"}'

# Delete resource
curl -X DELETE http://localhost:3000/api/resources/{id}
```

---

## 10. Alternative: Express Setup

If you prefer Express:

```bash
npm install express
npm install @types/express -D
```

```typescript
import express from "express";

const app = express();
app.use(express.json());

app.get("/api/resources", (req, res) => {
  res.json([]);
});

app.post("/api/resources", (req, res) => {
  const resource = { id: "1", ...req.body };
  res.status(201).json(resource);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

## Project Ideas

1. **Resource Inventory API:** CRUD for cloud resources
2. **Task Manager API:** Tasks with status, priority, due dates
3. **Bookmark API:** Save and categorize URLs
4. **Note-taking API:** Notes with tags and search
5. **Simple Auth API:** User registration and login
