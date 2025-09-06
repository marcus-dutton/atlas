import { Injectable } from '../decorators/injectable';
import * as fs from 'fs';
import * as path from 'path';

export interface AtlasConfig {
  useProduction?: boolean;
  production?: {
    app: {
      name: string;
      version: string;
      port: number;
      environment: string;
    };
    database: {
      uri: string;
      username?: string;
      password?: string;
      database?: string;
      options?: any;
    };
    logging: {
      level: 'debug' | 'info' | 'warn' | 'error';
      format: 'json' | 'simple';
    };
  };
  development?: {
    app: {
      name: string;
      version: string;
      port: number;
      environment: string;
    };
    database: {
      uri: string;
      username?: string;
      password?: string;
      database?: string;
      options?: any;
    };
    logging: {
      level: 'debug' | 'info' | 'warn' | 'error';
      format: 'json' | 'simple';
    };
  };
  app: {
    name: string;
    version: string;
    port: number;
    environment: string;
  };
  database: {
    uri: string;
    username?: string;
    password?: string;
    database?: string;
    options?: any;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'simple';
  };
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: AtlasConfig;

  constructor() {
    this.config = this.loadConfig();
    console.log('⚙️ ConfigService initialized');
  }

  private loadConfig(): AtlasConfig {
    const configPath = this.findConfigFile();
    const configData = fs.readFileSync(configPath, 'utf-8');
    const userConfig: AtlasConfig = JSON.parse(configData);

    // Determine which environment config to use
    const useProduction = userConfig.useProduction || process.env.NODE_ENV === 'production';
    const envConfig = useProduction ? userConfig.production : userConfig.development;

    // Base defaults
    const defaults = {
      app: {
        name: 'Atlas App',
        version: '1.0.0',
        port: 3000,
        environment: process.env.NODE_ENV || 'development'
      },
      database: {
        uri: 'mongodb://localhost:27017/atlas'
      },
      logging: {
        level: 'info' as const,
        format: 'simple' as const
      }
    };

    // If environment-specific config exists, merge it
    if (envConfig) {
      const mergedConfig = {
        ...userConfig,
        app: { ...defaults.app, ...userConfig.app, ...envConfig.app },
        database: { ...defaults.database, ...userConfig.database, ...envConfig.database },
        logging: { ...defaults.logging, ...userConfig.logging, ...envConfig.logging }
      };

      // Dynamically construct MongoDB URI if username/password are provided separately
      if (mergedConfig.database.username && mergedConfig.database.password) {
        const baseUri = mergedConfig.database.uri;
        // Replace placeholders in URI template
        if (baseUri.includes('${DB_USERNAME}') || baseUri.includes('${DB_PASSWORD}')) {
          mergedConfig.database.uri = baseUri
            .replace('${DB_USERNAME}', mergedConfig.database.username)
            .replace('${DB_PASSWORD}', mergedConfig.database.password);
        } else if (baseUri.includes('mongodb+srv://') && !baseUri.includes('@')) {
          // If it's an Atlas URI without credentials, inject them
          const uriParts = baseUri.split('mongodb+srv://');
          mergedConfig.database.uri = `mongodb+srv://${mergedConfig.database.username}:${mergedConfig.database.password}@${uriParts[1]}`;
        } else if (baseUri.includes('mongodb://') && !baseUri.includes('@')) {
          // If it's a local MongoDB URI without credentials, inject them
          const uriParts = baseUri.split('mongodb://');
          mergedConfig.database.uri = `mongodb://${mergedConfig.database.username}:${mergedConfig.database.password}@${uriParts[1]}`;
        }
        console.log('🔧 Constructed database URI from credentials');
      }

      return mergedConfig;
    }

    return {
      ...userConfig,
      app: { ...defaults.app, ...userConfig.app },
      database: { ...defaults.database, ...userConfig.database },
      logging: { ...defaults.logging, ...userConfig.logging }
    };
  }

  private findConfigFile(): string {
    const possiblePaths = [
      path.join(process.cwd(), 'config.json'),
      path.join(process.cwd(), 'atlas.config.json'),
      path.join(process.cwd(), 'dist', 'config.json'),
      path.join(__dirname, '..', '..', 'config.json') // For bundled apps
    ];

    for (const configPath of possiblePaths) {
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }

    throw new Error('Config file not found. Please create config.json or atlas.config.json');
  }

  get<T = any>(key: string): T {
    return this.getNestedValue(this.config, key);
  }

  get app() {
    return this.config.app;
  }

  get database() {
    return this.config.database;
  }

  get logging() {
    return this.config.logging;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Provider function for Angular-style module setup
export function provideConfig(): any {
  return {
    provide: ConfigService,
    useClass: ConfigService
  };
}
