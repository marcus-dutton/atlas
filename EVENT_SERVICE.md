# Atlas EventService// app.config.ts
import { ApplicationConfig } from 'atlas';
import { provideMongoose, provideConfig, provideEventService } from 'atlas';
import { provideSocketIoServer, SocketIoServerConfig } from 'atlas/core/app-config';

const socketIoServerConfig: SocketIoServerConfig = {
  port: 3001,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  options: {
    transports: ['websocket', 'polling']
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideConfig(),
    provideMongoose(),
    provideEventService(),
    provideSocketIoServer(socketIoServerConfig) // ✅ Backend Socket.IO server
  ]
};IO Events

## 🎯 Overview

The `EventService` provides **type-safe Socket.IO event names** with automatic namespace prefixing, eliminating magic strings and providing IntelliSense support. The new **Events Module** makes it easy for developers to create their own type-safe event namespaces.

## 🚀 Features

- ✅ **Type-Safe Event Names** - No more magic strings
- ✅ **Namespace Support** - Automatic `namespace:event` formatting
- ✅ **IntelliSense** - Full autocomplete support
- ✅ **Extensible** - Easy to add new event namespaces
- ✅ **Framework Agnostic** - Works with any Socket.IO implementation
- ✅ **Angular-style Configuration** - `ApplicationConfig` with `provide*` functions

## 📋 Usage

### Angular-style Application Configuration

```typescript
// app.config.ts
import { ApplicationConfig } from 'atlas';
import { provideMongoose, provideConfig, provideEventService } from 'atlas';
import { provideSocketIoServer, SocketIoServerConfig } from 'atlas/core/app-config';

const socketIoServerConfig: SocketIoServerConfig = {
  port: 3001,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  options: {
    transports: ['websocket', 'polling']
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideConfig(),
    provideMongoose(),
    provideEventService(),
    provideSocketIoServer(socketIoServerConfig)
  ]
};
```

```typescript
// main.ts
import { bootstrapApplication } from 'atlas';
import { appConfig } from './app.config';
import { AppModule } from './app.module';

bootstrapApplication(AppModule, appConfig);
```
- ✅ **Events Module** - Simple utilities for creating custom event namespaces

## 📋 Usage

### Using the Events Module (Recommended)

```typescript
import { createEventNamespace } from './models/events.module';
import { EventService } from './services/event.service';

// Create your own event namespace
const userEvents = createEventNamespace('user', [
    'ProfileUpdate',
    'ProfileUpdateResponse',
    'GetProfile',
    'GetProfileResponse'
] as const);

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private eventService: EventService) {
        // Register with EventService for centralized management
        this.eventService.registerEvents('user', userEvents.getEvents());
    }

    handleSocket(socket: any) {
        // Type-safe event listening
        socket.on(userEvents.getEvent('ProfileUpdate'), (data) => {
            console.log('� Profile update received');
        });

        // Type-safe event emission
        socket.emit(userEvents.getEvent('ProfileUpdateResponse'), {
            success: true
        });
    }
}
```

### Basic EventService Usage

```typescript
import { EventService } from './services/event.service';

@Injectable({ providedIn: 'root' })
export class MyService {
  constructor(private events: EventService) {}

  handleSocket(socket: any) {
    // Get registered events
    const userEvents = this.events.getRegisteredEvents('user');

    socket.on(userEvents.ProfileUpdate, (data) => {
      console.log('👤 Getting user profile');
    });
  }
}
```

### Creating Event Namespaces

```typescript
import { createEventNamespace } from './models/events.module';

// Create any event namespace you need
const danceEvents = createEventNamespace('dance', [
    'GetAllSchedules',
    'GetAllSchedulesResponse',
    'CreateSchedule',
    'CreateScheduleResponse'
] as const);

const bankingEvents = createEventNamespace('banking', [
    'GetAccounts',
    'GetAccountsResponse',
    'TransferFunds',
    'TransferFundsResponse'
] as const);

// Use the events
socket.on(danceEvents.getEvent('GetAllSchedules'), handler);
socket.emit(bankingEvents.getEvent('TransferFunds'), data);
```

### Event Namespace Class

```typescript
import { createEventNamespace } from './models/events.module';

export class MyAppEvents {
    static readonly api = createEventNamespace('api', [
        'Request',
        'Response',
        'Error'
    ] as const);

    static readonly realtime = createEventNamespace('realtime', [
        'Subscribe',
        'Unsubscribe',
        'Update'
    ] as const);
}

// Usage
socket.on(MyAppEvents.api.getEvent('Request'), handler);
```

## 🛠️ Advanced Usage

### Registering Events with EventService

```typescript
@Injectable({ providedIn: 'root' })
export class EventManager {
    constructor(private eventService: EventService) {
        // Create and register multiple event namespaces
        const chatEvents = createEventNamespace('chat', [
            'SendMessage',
            'ReceiveMessage',
            'JoinRoom',
            'LeaveRoom'
        ] as const);

        const gameEvents = createEventNamespace('game', [
            'StartGame',
            'EndGame',
            'PlayerMove'
        ] as const);

        // Register for centralized access
        this.eventService.registerEvents('chat', chatEvents.getEvents());
        this.eventService.registerEvents('game', gameEvents.getEvents());
    }
}
```

### Integration with Controllers

```typescript
@Injectable()
export class ChatController {
    constructor(private eventService: EventService) {}

    handleConnection(socket: any) {
        const chatEvents = this.eventService.getRegisteredEvents('chat');

        socket.on(chatEvents.SendMessage, (data) => {
            // Handle message
            socket.emit(chatEvents.ReceiveMessage, processedData);
        });
    }
}
```
    socket.on(this.customEvents.SendMessage, (message) => {
      // Handle message
      socket.emit(this.customEvents.ReceiveMessage, {
        text: message.text,
        timestamp: Date.now()
      });
    });
  }
}
```

### Socket.IO Integration

```typescript
@Injectable({ providedIn: 'root' })
export class SocketService {
  constructor(private events: EventService) {}

  setupEventHandlers(socket: any) {
    // Dance events
    socket.on(this.events.danceEvents.GetAllSchedules, this.handleGetSchedules.bind(this));
    socket.on(this.events.danceEvents.CreateSchedule, this.handleCreateSchedule.bind(this));

    // Banking events
    socket.on(this.events.bankingEvents.GetAccounts, this.handleGetAccounts.bind(this));

    // System events
    socket.on(this.events.systemEvents.Ping, () => {
      socket.emit(this.events.systemEvents.Pong, { timestamp: Date.now() });
    });
  }

  private handleGetSchedules(socket: any, data: any) {
    // Business logic here
    socket.emit(this.events.danceEvents.GetAllSchedulesResponse, {
      schedules: []
    });
  }
}
```

### Type-Safe Event Data

```typescript
interface ScheduleData {
  id: string;
  name: string;
  date: Date;
}

@Injectable()
export class DanceController {
  constructor(private events: EventService) {}

  createSchedule(socket: any, scheduleData: ScheduleData) {
    // Type-safe event emission
    socket.emit(this.events.danceEvents.CreateSchedule, scheduleData);

    // Type-safe response handler
    socket.once(this.events.danceEvents.CreateScheduleResponse, (response: {
      success: boolean;
      schedule: ScheduleData;
    }) => {
      if (response.success) {
        console.log('✅ Schedule created:', response.schedule);
      }
    });
  }
}
```

## 🔧 Provider Setup

### Using Provider Function
```typescript
import { provideEventService } from './services/event.service';

@Module([
  provideEventService()
])
export class AppModule {}
```

### Manual Registration
```typescript
@Module([
  { provide: EventService, useClass: EventService }
])
export class AppModule {}
```

## 🎯 Benefits

### Before (Magic Strings)
```typescript
socket.on('dance:GetAllSchedules', handler);
socket.emit('dance:GetAllSchedulesResponse', data);
// ❌ No type safety, prone to typos
```

### After (Type-Safe)
```typescript
socket.on(events.danceEvents.GetAllSchedules, handler);
socket.emit(events.danceEvents.GetAllSchedulesResponse, data);
// ✅ Full type safety, IntelliSense support
```

### Key Advantages
- **🔍 IntelliSense** - Auto-complete event names
- **🛡️ Type Safety** - Compile-time error checking
- **📚 Self-Documenting** - Event names are explicit
- **🔄 Refactoring Safe** - Rename events safely
- **📖 Team Consistency** - Standardized event naming

## 🚀 Integration with Frameworks

The EventService works with any framework:

### Express + Socket.IO
```typescript
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  eventService.setupEventHandlers(socket);
});
```

### Fastify + Socket.IO
```typescript
fastify.register(require('fastify-socket.io'));
fastify.io.on('connection', (socket) => {
  eventService.setupEventHandlers(socket);
});
```

## 📊 Event Registry

Get all available events for debugging:

```typescript
const allEvents = eventService.getAllEvents();
console.log(allEvents);
// {
//   dance: { GetAllSchedules: 'dance:GetAllSchedules', ... },
//   banking: { GetAccounts: 'banking:GetAccounts', ... },
//   auth: { Login: 'auth:Login', ... },
//   ...
// }
```

The EventService makes Socket.IO development **type-safe, maintainable, and developer-friendly**! 🎉
