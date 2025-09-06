// Example: Angular-style Application Configuration
import { ApplicationConfig, bootstrapApplication } from '../src';
import { provideMongoose, provideConfig, provideEventService } from '../src';
import { provideSocketIoServer, SocketIoServerConfig } from '../src/core/app-config';

// Example App Module
import { Injectable, Module } from '../src';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor() {
    console.log('🔧 AppService initialized');
  }
}

@Module([])
export class AppModule {
  constructor(private appService: AppService) {
    console.log('📦 AppModule initialized');
  }
}

// Socket.IO Server Configuration (for backend server)
const socketIoServerConfig: SocketIoServerConfig = {
  port: 3001,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  options: {
    transports: ['websocket', 'polling'],
    maxHttpBufferSize: 10 * 1024 * 1024 // 10MB
  }
};

// Application Configuration (Angular-style)
export const appConfig: ApplicationConfig = {
  providers: [
    provideConfig(),           // ✅ Handles ConfigService injection internally
    provideMongoose(),         // ✅ Handles MongooseService injection internally
    provideEventService(),     // ✅ Handles EventService injection internally
    provideSocketIoServer(socketIoServerConfig) // ✅ Handles Socket.IO server config injection internally
  ]
};

// Bootstrap with configuration (Angular-style)
try {
  const injector = bootstrapApplication(AppModule, appConfig);
  console.log('🚀 Atlas application started with Angular-style config!');
} catch (err) {
  console.error(err);
}
