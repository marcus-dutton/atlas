// Example: Angular-style module with provider functions
import { Module } from '../decorators/backend';
import { provideMongoose, MongooseService } from '../services/mongoose.service';
import { provideConfig, ConfigService } from '../services/config.service';

@Module([
  // Using provider functions (Angular-style)
  provideConfig(),
  provideMongoose(),

  // Can still mix with traditional providers
  { provide: 'APP_NAME', useValue: 'Atlas Demo' }
])
export class DatabaseModule {
  constructor(
    private config: ConfigService,
    private mongoose: MongooseService
  ) {
    console.log('🗄️ DatabaseModule initialized with provider functions');
  }
}

// Usage in bootstrap:
import { bootstrapApplication } from '../core/bootstrap';
import { DatabaseModule } from './database.module';

const injector = bootstrapApplication(DatabaseModule, {
  providers: [
    provideConfig(),      // ✅ Provider function
    provideMongoose()     // ✅ Provider function
  ]
});

// Getting services (traditional way still works):
const configService = injector.get(ConfigService);
const mongooseService = injector.get(MongooseService);
