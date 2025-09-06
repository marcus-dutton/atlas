// Example: Advanced Directory-Based Auto-Discovery
import { bootstrapApplication } from '@marcus-dutton/atlas';
import { AppModule } from './app-example';

const injector = bootstrapApplication(AppModule, {
  autoProvideRoot: true,
  scanPaths: [
    './src/services',     // Custom service directory
    './src/controllers',  // Controllers directory
    './lib/shared'        // Shared utilities
  ],
  providers: [
    // Additional providers
  ]
});

console.log('🚀 Application with advanced auto-discovery started!');
