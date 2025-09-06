// Application Configuration - Angular-style provider system
import { ApplicationConfig } from '../core/bootstrap';
import { Provider } from '../interfaces/types';
import { MongooseService, provideMongoose } from '../services/mongoose.service';
import { ConfigService, provideConfig } from '../services/config.service';
import { EventService, provideEventService } from '../services/event.service';

// Enhanced provider functions with configuration options
export function provideMongooseConfig(config?: { uri?: string; database?: string }): Provider {
  return {
    provide: MongooseService,
    useClass: MongooseService,
    // Could add configuration here
  };
}

export function provideConfigWithOptions(options?: { filePath?: string }): Provider {
  return {
    provide: ConfigService,
    useClass: ConfigService,
    // Could add configuration here
  };
}

export function provideEventServiceWithOptions(options?: { autoRegister?: boolean }): Provider {
  return {
    provide: EventService,
    useClass: EventService,
  };
}

// Framework-specific providers
export function provideExpress(options?: { port?: number; middleware?: any[] }): Provider {
  return {
    provide: 'EXPRESS_CONFIG',
    useValue: { port: options?.port || 3000, middleware: options?.middleware || [] }
  };
}

export function provideFastify(options?: { port?: number; plugins?: any[] }): Provider {
  return {
    provide: 'FASTIFY_CONFIG',
    useValue: { port: options?.port || 3000, plugins: options?.plugins || [] }
  };
}

// Socket.IO Server provider (for backend server setup)
export interface SocketIoServerConfig {
  port?: number;
  cors?: {
    origin?: string | string[];
    methods?: string[];
    credentials?: boolean;
  };
  options?: {
    transports?: string[];
    [key: string]: any;
  };
}

export function provideSocketIoServer(config?: SocketIoServerConfig): Provider {
  return {
    provide: 'SOCKET_IO_SERVER_CONFIG',
    useValue: {
      port: config?.port || 3001,
      cors: config?.cors || { origin: "*", methods: ["GET", "POST"] },
      options: {
        transports: ['websocket', 'polling'],
        ...config?.options
      }
    }
  };
}

// Application-level providers
export function provideZoneChangeDetection(options?: { eventCoalescing?: boolean }): Provider {
  return {
    provide: 'ZONE_CHANGE_DETECTION',
    useValue: { eventCoalescing: options?.eventCoalescing ?? true }
  };
}

export function provideErrorHandler(): Provider {
  return {
    provide: 'ERROR_HANDLER',
    useValue: (error: any) => console.error('Application Error:', error)
  };
}

// Example application config (Angular-style)
export function createApplicationConfig(providers: Provider[]): ApplicationConfig {
  return { providers };
}

// Pre-configured application configs
export const defaultAppConfig: ApplicationConfig = {
  providers: [
    provideConfig(),
    provideMongoose(),
    provideEventService(),
    provideErrorHandler()
  ]
};

export const webAppConfig: ApplicationConfig = {
  providers: [
    provideConfig(),
    provideMongoose(),
    provideEventService(),
    provideExpress({ port: 3000 }),
    provideErrorHandler()
  ]
};

export const socketAppConfig: ApplicationConfig = {
  providers: [
    provideConfig(),
    provideMongoose(),
    provideEventService(),
    provideSocketIoServer({
      port: 3001,
      cors: { origin: "*", methods: ["GET", "POST"] },
      options: {
        transports: ['websocket', 'polling']
      }
    }),
    provideErrorHandler()
  ]
};
