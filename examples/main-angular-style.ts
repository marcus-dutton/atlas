// main.ts - Angular-style bootstrap
import { bootstrapApplication } from '../src';
import { appConfig } from './app.config';
import { AppModule } from './app-example';

try {
  const injector = bootstrapApplication(AppModule, appConfig);
  console.log('🚀 Atlas application started with Angular-style config!');
} catch (err) {
  console.error(err);
}
