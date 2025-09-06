import { bootstrapApplication } from './src';
import { AppModule } from './app-example';
import { provideMongoose, MongooseService } from './src/services/mongoose.service';
import { UserModel } from './developer-examples';

async function main() {
  try {
    console.log('🔄 Bootstrapping Atlas application...');

    // Bootstrap the application with auto root providers
    const injector = bootstrapApplication(AppModule, {
      autoProvideRoot: true,
      scanPaths: ['./src/services', './src/controllers'], // Custom scan paths
      providers: [
        // Additional global providers
        { provide: 'APP_NAME', useValue: 'Atlas DI Demo' },
        { provide: 'VERSION', useValue: '1.0.0' }
      ]
    });

    // Initialize database connection
    const mongooseService = injector.get(MongooseService) as MongooseService;
    try {
      await mongooseService.connect();
      console.log('📦 Database ready for operations');
    } catch (dbError) {
      console.warn('⚠️ Database connection failed, continuing without database:', (dbError as Error).message);
      console.log('💡 Make sure MongoDB is running locally or update config.json with correct connection details');
    }

    // Register models (this would be automated in a full implementation)
    try {
      mongooseService.registerModel({
        name: 'User',
        schema: UserModel.schema
      });
      console.log('📋 User model registered successfully');
    } catch (modelError) {
      console.warn('⚠️ Model registration failed:', (modelError as Error).message);
    }

    // Get the app module and bootstrap it
    const appModule: any = injector.get(AppModule);
    appModule.bootstrap();

    console.log('✅ Application started successfully!');

    // Keep the process running
    process.on('SIGINT', () => {
      console.log('🛑 Shutting down Atlas application...');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to bootstrap application:', error);
    process.exit(1);
  }
}

// Start the application
main();
