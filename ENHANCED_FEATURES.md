# Atlas DI System - Enhanced Configuration & Framework Support

## 🎯 New Features Overview

### 1. Environment-Specific Configuration
Atlas now supports separate configuration trees for development and production environments.

#### Configuration Structure
```json
{
  "useProduction": false,
  "production": {
    "app": { "name": "Atlas Production", "port": 3000 },
    "database": {
      "uri": "mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster.mongodb.net/atlas",
      "username": "${DB_USERNAME}",
      "password": "${DB_PASSWORD}"
    }
  },
  "development": {
    "app": { "name": "Atlas Development", "port": 3000 },
    "database": {
      "uri": "mongodb://localhost:27017/atlas",
      "username": null,
      "password": null
    }
  }
}
```

#### Usage
```typescript
// Automatically uses production config when useProduction: true
const config = {
  useProduction: process.env.NODE_ENV === 'production'
};
```

### 3. Advanced Directory-Based Auto-Discovery
Atlas now supports configurable directory scanning for automatic service discovery.

#### Configurable Scan Paths
```typescript
// Scan multiple directories for services
const injector = bootstrapApplication(AppModule, {
  autoProvideRoot: true,
  scanPaths: [
    './src/services',      // Service directory
    './src/controllers',   // Controller directory
    './lib/utilities',     // Shared utilities
    './modules/auth'       // Feature modules
  ]
});
```

#### Benefits
- **Flexible Project Structure**: Organize services by feature/domain
- **Scalable Architecture**: Support for large applications with many services
- **Convention Over Configuration**: Less manual provider registration
- **Hot Swapping**: Easy to add/remove services without code changes

#### Example Project Structure
```
my-app/
├── src/
│   ├── services/
│   │   ├── user.service.ts      // @Injectable({ providedIn: 'root' })
│   │   └── auth.service.ts      // @Injectable({ providedIn: 'root' })
│   ├── controllers/
│   │   ├── user.controller.ts   // @Injectable({ providedIn: 'root' })
│   └── modules/
│       └── payment/
│           └── payment.service.ts // @Injectable({ providedIn: 'root' })
└── lib/
    └── shared/
        └── logger.service.ts     // @Injectable({ providedIn: 'root' })
```

### 3. Framework-Agnostic Bootstrap
Atlas can now bootstrap any framework (Express, Fastify, Koa, etc.) using adapter pattern.

#### Framework Adapters
```typescript
// Express Adapter
const expressAdapter = {
  name: 'Express',
  setup: (injector, config) => { /* setup logic */ },
  start: (injector, config) => { /* start logic */ }
};

// Fastify Adapter
const fastifyAdapter = {
  name: 'Fastify',
  setup: (injector, config) => { /* setup logic */ },
  start: (injector, config) => { /* start logic */ }
};
```

#### Bootstrap Any Framework
```typescript
import { bootstrapFramework } from 'atlas/frameworks';

// Bootstrap with Express
const injector = await bootstrapFramework(AppModule, 'express', {
  autoProvideRoot: true
});

// Bootstrap with Fastify
const injector = await bootstrapFramework(AppModule, 'fastify', {
  autoProvideRoot: true
});

// Bootstrap with custom framework
const injector = await bootstrapFramework(AppModule, customAdapter, {
  autoProvideRoot: true
});
```

### 4. Enhanced ConfigService
The ConfigService now automatically merges environment-specific configurations.

```typescript
@Injectable({ providedIn: 'root' })
export class ConfigService {
  // Automatically uses production or development config based on useProduction flag
  private config = this.loadConfigWithEnvironment();

  get app() { return this.config.app; }
  get database() { return this.config.database; }
  get logging() { return this.config.logging; }
}
```

## 🚀 Quick Start Examples

### Basic Usage (Development)
```json
// config.json
{
  "useProduction": false,
  "development": {
    "database": { "uri": "mongodb://localhost:27017/atlas" }
  }
}
```

### Production Usage
```json
// config.json
{
  "useProduction": true,
  "production": {
    "database": {
      "uri": "mongodb+srv://user:pass@cluster.mongodb.net/atlas",
      "username": "user",
      "password": "pass"
    }
  }
}
```

### Framework Bootstrap
```typescript
// Bootstrap with Express
import { bootstrapFramework } from 'atlas';

const injector = await bootstrapFramework(AppModule, 'express', {
  autoProvideRoot: true
});

// Bootstrap with Fastify
const injector = await bootstrapFramework(AppModule, 'fastify', {
  autoProvideRoot: true
});
```

## 🎯 Benefits

1. **Environment Flexibility**: Separate configs for dev/prod without code changes
2. **Security**: Database credentials as environment variables
3. **Framework Agnostic**: Use with any Node.js framework
4. **Developer Experience**: Simple configuration, powerful features
5. **Production Ready**: Environment-specific optimizations

## 📋 Migration Guide

### From Old Config
```json
// Old config.json
{
  "database": { "uri": "mongodb://localhost:27017/atlas" }
}
```

### To New Config
```json
// New config.json
{
  "useProduction": false,
  "development": {
    "database": { "uri": "mongodb://localhost:27017/atlas" }
  },
  "production": {
    "database": {
      "uri": "mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster.mongodb.net/atlas",
      "username": "${DB_USERNAME}",
      "password": "${DB_PASSWORD}"
    }
  }
}
```

The Atlas DI system is now **enterprise-ready** with production-grade configuration management and multi-framework support! 🚀
