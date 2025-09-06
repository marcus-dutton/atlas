import { Injectable, Module, Controller, Gateway, Service, bootstrapApplication } from '../src';

@Injectable({ providedIn: 'root' })
export class AppConfig {
  constructor() {
    console.log('📋 AppConfig initialized (providedIn: root)');
  }

  get port(): number {
    return 3000;
  }

  get environment(): string {
    return process.env.NODE_ENV || 'development';
  }
}

@Injectable({ providedIn: 'root' })
@Service()
export class AppService {
  constructor(private config: AppConfig) {
    console.log('🔧 AppService initialized (providedIn: root)');
  }

  start() {
    console.log(`🚀 Starting Atlas app on port ${this.config.port} in ${this.config.environment} mode`);
  }
}

@Controller('/health')
export class HealthController {
  constructor() {
    console.log('🏥 HealthController initialized');
  }

  check() {
    return { status: 'ok', timestamp: new Date() };
  }
}

@Gateway('/notifications')
export class NotificationGateway {
  constructor() {
    console.log('📢 NotificationGateway initialized');
  }

  send(message: string) {
    console.log(`📤 Sending notification: ${message}`);
  }
}

@Injectable()
export class App {
  constructor(
    private appService: AppService,    // From root (providedIn: 'root')
    private healthController: HealthController,  // Scoped to this module
    private notificationGateway: NotificationGateway  // Scoped to this module
  ) {
    console.log('🎯 App component initialized');
  }

  run() {
    this.appService.start();
    console.log('Health check:', this.healthController.check());
    this.notificationGateway.send('Application started successfully!');
  }
}

@Module([
  // Module-specific providers (App and components)
  { provide: App, useClass: App },
  { provide: HealthController, useClass: HealthController },
  { provide: NotificationGateway, useClass: NotificationGateway }
  // Root services are now auto-discovered!
])
export class AppModule {
  constructor(private app: App) {
    console.log('📦 AppModule initialized');
  }

  bootstrap() {
    this.app.run();
  }
}
