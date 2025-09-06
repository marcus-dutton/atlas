// app.config.ts - Angular-style configuration
import { ApplicationConfig } from '@marcus-dutton/atlas';
import { provideMongoose, provideConfig, provideEventService } from '../src';
import { provideSocketIoServer, SocketIoServerConfig } from '../src/core/app-config';

const socketIoServerConfig: SocketIoServerConfig = {
  port: 3001,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  options: {
    transports: ['websocket', 'polling'],
    maxHttpBufferSize: 10 * 1024 * 1024
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideConfig(),
    provideMongoose(),
    provideEventService(),
    provideSocketIoServer(socketIoServerConfig) // ✅ handles Socket.IO server injection internally
  ]
};
