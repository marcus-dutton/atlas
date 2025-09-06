// Angular's Build-Time Registry (simplified concept)
export const ROOT_PROVIDERS = [
  { provide: AppConfig, useClass: AppConfig },
  { provide: AppService, useClass: AppService },
  { provide: ConfigService, useClass: ConfigService },
  { provide: MongooseService, useClass: MongooseService },
  // ... all @Injectable({ providedIn: 'root' }) services auto-discovered
];

// This would be generated during build time by scanning all .ts files
// and finding services with @Injectable({ providedIn: 'root' })
