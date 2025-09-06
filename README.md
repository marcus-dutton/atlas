# Atlas DI

[![npm version](https://badge.fury.io/js/%40marcus-dutton%2Fatlas.svg)](https://badge.fury.io/js/@marcus-dutton/atlas)
[![npm downloads](https://img.shields.io/npm/dm/%40marcus-dutton%2Fatlas.svg)](https://www.npmjs.com/package/@marcus-dutton/atlas)
[![npm](https://img.shields.io/npm/dt/%40marcus-dutton%2Fatlas.svg)](https://www.npmjs.com/package/@marcus-dutton/atlas)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

A hierarchical dependency injection system for Node.js, inspired by Angular but adapted for backend development.

## Installation

```bash
npm install @marcus-dutton/atlas
```

## Quick Start

```typescript
import { Injectable, bootstrapApplication } from 'atlas';

@Injectable({ providedIn: 'root' })
class MyService {
  getMessage() {
    return 'Hello from Atlas!';
  }
}

@Injectable()
class App {
  constructor(private service: MyService) {}

  run() {
    console.log(this.service.getMessage());
  }
}

const injector = bootstrapApplication(App);
const app = injector.get(App);
app.run(); // Output: Hello from Atlas!
```

## Angular-Style Configuration

Atlas supports Angular-style `ApplicationConfig` with `provide*` functions:

```typescript
// app.config.ts
import { ApplicationConfig } from 'atlas';
import { provideMongoose, provideSocketIoServer } from 'atlas';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMongoose(),
    provideSocketIoServer({
      port: 3001,
      cors: { origin: "*" }
    })
  ]
};

// main.ts
import { bootstrapApplication } from 'atlas';
import { appConfig } from './app.config';

const injector = bootstrapApplication(AppModule, appConfig);
```

## Features

- ✅ Hierarchical injectors (parent/child relationships)
- ✅ Multiple provider types (`useClass`, `useValue`, `useFactory`, `useExisting`)
- ✅ Multi-providers for multiple implementations
- ✅ Injection modifiers (`@Optional`, `@Self`, `@SkipSelf`, `@Host`)
- ✅ **Angular-style `providedIn` support** (`@Injectable({ providedIn: 'root' })`)
- ✅ **Advanced Directory Auto-Discovery** with configurable scan paths
- ✅ Custom injection tokens
- ✅ Backend-specific decorators (`@Controller`, `@Gateway`, `@Service`, `@Module`)
- ✅ Bootstrap system like Angular's `main.ts`

## Quick Start

### 1. Manual Setup
```typescript
import { Injector, provideClass, Injectable } from 'atlas-di';

@Injectable()
class Logger {
  log(msg: string) { console.log(msg); }
}

const injector = new Injector([
  provideClass(Logger, Logger)
]);

const logger = injector.get(Logger);
logger.log('Hello Atlas!');
```

### 2. Bootstrap Approach (Recommended)
```typescript
// main.ts
import { bootstrapApplication } from 'atlas';
import { AppModule } from './app';

bootstrapApplication(AppModule, {
  autoProvideRoot: true,  // Auto-discover @Injectable({ providedIn: 'root' }) services
  scanPaths: ['./src/services', './src/controllers'],  // Custom scan paths
  providers: [
    { provide: 'APP_NAME', useValue: 'My App' }
  ]
});

// app.ts
import { Injectable, Module } from 'atlas-di';

@Injectable()
export class App {
  constructor() {
    console.log('App started!');
  }
}

@Module([
  { provide: App, useClass: App }
])
export class AppModule {
  constructor(private app: App) {}
}
```

## Scripts

- `npm run dev` - Start with nodemon (main.ts)
- `npm run example` - Run example.ts
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled version

## Architecture

- **Hierarchical DI**: Parent injectors provide fallback for child injectors
- **Global vs Module Scope**: Root injector for singletons, module injectors for scoped services
- **Backend Focus**: Decorators for controllers, gateways, services, and middleware
- **Angular Compatibility**: Mirrors Angular's DI patterns for familiarity

## API Reference

### Core Classes
- `Injector` - Main DI container
- `AtlasBootstrap` - Bootstrap utilities

### Decorators
- `@Injectable()` - Mark class as injectable
- `@Controller(prefix)` - REST API controllers
- `@Gateway(namespace)` - WebSocket gateways
- `@Service()` - Business logic services
- `@Module(providers)` - Module definitions

### Providers
- `provideClass(token, class)` - Class provider
- `provideValue(token, value)` - Value provider
- `provideFactory(token, factory, deps)` - Factory provider
- `provideMulti(token, providers)` - Multi-provider

### Modifiers
- `@Optional()` - Optional dependencies
- `@Self()` - Only current injector
- `@SkipSelf()` - Skip current injector
- `@Host()` - Host injector only

## Examples

See `example.ts` for comprehensive usage examples including:
- Basic injection
- Hierarchical injectors
- Multi-providers
- Backend decorators
- Bootstrap patterns

## Links

- 📦 **npm**: [https://www.npmjs.com/package/@marcus-dutton/atlas](https://www.npmjs.com/package/@marcus-dutton/atlas)
- 📚 **GitHub**: [https://github.com/marcus-dutton/atlas](https://github.com/marcus-dutton/atlas)
- 📖 **Documentation**: [https://github.com/marcus-dutton/atlas#readme](https://github.com/marcus-dutton/atlas#readme)
- 🐛 **Issues**: [https://github.com/marcus-dutton/atlas/issues](https://github.com/marcus-dutton/atlas/issues)

## License

ISC License - see [LICENSE](LICENSE) file for details.
