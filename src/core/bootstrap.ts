import { Injector, Provider } from '../index';
import * as fs from 'fs';
import * as path from 'path';

export interface BootstrapOptions {
  providers?: Provider[];
  rootInjector?: Injector;
  autoProvideRoot?: boolean; // Enable automatic root providers
  framework?: FrameworkAdapter; // Framework-specific adapter
  scanPaths?: string[]; // Custom directories to scan for services
  discoveryPatterns?: string[]; // File patterns for convention-based discovery
}

export interface ApplicationConfig {
  providers: Provider[];
}

export interface FrameworkAdapter {
  name: string;
  setup?: (injector: Injector, config: any) => Promise<void> | void;
  start?: (injector: Injector, config: any) => Promise<void> | void;
  stop?: (injector: Injector) => Promise<void> | void;
}

export class AtlasBootstrap {
  private static rootInjector: Injector;
  private static rootProviders: Provider[] = [];

  static bootstrap(moduleClass: any, options: BootstrapOptions = {}): Injector {
    // Create root injector with global providers
    const globalProviders = options.providers || [];

    // Auto-provide root services if enabled
    if (options.autoProvideRoot) {
      const autoRootProviders = this.scanSrcDirectoryForRootProviders(options);
      globalProviders.push(...autoRootProviders);
    }

    this.rootInjector = options.rootInjector || new Injector(globalProviders);

    // Get module metadata
    const moduleProviders = Reflect.getMetadata('module:providers', moduleClass) || [];

    // Add the module class itself as a provider
    const allProviders = [
      { provide: moduleClass, useClass: moduleClass },
      ...moduleProviders
    ];

    const moduleInjector = this.rootInjector.createChild(allProviders);

    // Instantiate the main module
    const mainModule = moduleInjector.get(moduleClass);

    console.log('🚀 Atlas application bootstrapped successfully!');

    // Setup framework if provided
    if (options.framework) {
      console.log(`🔧 Setting up ${options.framework.name} framework...`);
      if (options.framework.setup) {
        const result = options.framework.setup(moduleInjector, {});
        if (result instanceof Promise) {
          result.catch(error => console.error('Framework setup error:', error));
        }
      }
    }

    return moduleInjector;
  }

  static getRootInjector(): Injector {
    return this.rootInjector;
  }

  static createModuleInjector(providers: Provider[]): Injector {
    return this.rootInjector.createChild(providers);
  }

  // Collect services marked with providedIn: 'root'
  private static collectRootProviders(): Provider[] {
    const providers: Provider[] = [];

    // Get all root providers that were manually registered
    providers.push(...this.rootProviders);

    // Auto-discover from the entire src directory
    const autoDiscovered = this.scanSrcDirectoryForRootProviders();
    providers.push(...autoDiscovered);

    return providers;
  }

  // Scan src directory for all @Injectable({ providedIn: 'root' }) services
  private static scanSrcDirectoryForRootProviders(options?: BootstrapOptions): Provider[] {
    const providers: Provider[] = [];
    const scanPaths = options?.scanPaths || [path.join(process.cwd(), 'src')];

    console.log('🔍 Scanning for root providers...');

    try {
      for (const scanPath of scanPaths) {
        console.log(`📂 Scanning path: ${scanPath}`);
        const discoveredClasses = this.scanDirectory(scanPath);

        for (const cls of discoveredClasses) {
          if (typeof cls === 'function') {
            const injectableOptions = Reflect.getMetadata('injectable:options', cls);
            if (injectableOptions?.providedIn === 'root') {
              // Check if not already registered
              const alreadyRegistered = providers.some(p => p.provide === cls);
              if (!alreadyRegistered) {
                providers.push({ provide: cls, useClass: cls });
                console.log(`📦 Auto-registered root provider: ${cls.name}`);
              }
            }
          }
        }
      }

      console.log(`✅ Found ${providers.length} root providers`);
    } catch (error) {
      console.warn('⚠️ Could not scan for root providers:', (error as Error).message);
    }

    return providers;
  }

  // Recursively scan directory for TypeScript files and extract classes
  private static scanDirectory(dirPath: string): any[] {
    const classes: any[] = [];

    if (!fs.existsSync(dirPath)) {
      return classes;
    }

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        // Recursively scan subdirectories
        classes.push(...this.scanDirectory(fullPath));
      } else if (stat.isFile() && item.endsWith('.ts') && !item.endsWith('.d.ts')) {
        // Load TypeScript file and extract classes
        try {
          const module = require(fullPath.replace(/\.ts$/, ''));
          const moduleClasses = Object.values(module).filter(
            (value: any) => typeof value === 'function' && value.prototype
          );
          classes.push(...moduleClasses);
        } catch (error) {
          // Skip files that can't be loaded (might have dependencies)
          console.debug(`⚠️ Could not load ${item}: ${(error as Error).message}`);
        }
      }
    }

    return classes;
  }

  // Manually register a root provider (for services not auto-discovered)
  static provideRoot(provider: Provider): void {
    this.rootProviders.push(provider);
  }
}

export function bootstrapApplication(moduleClass: any, options?: BootstrapOptions): Injector;
export function bootstrapApplication(moduleClass: any, config: ApplicationConfig): Injector;
export function bootstrapApplication(moduleClass: any, configOrOptions?: BootstrapOptions | ApplicationConfig): Injector {
  // Handle ApplicationConfig (Angular-style)
  if (configOrOptions && 'providers' in configOrOptions && !('rootInjector' in configOrOptions)) {
    const config = configOrOptions as ApplicationConfig;
    return AtlasBootstrap.bootstrap(moduleClass, { providers: config.providers });
  }

  // Handle BootstrapOptions (existing Atlas style)
  const options = configOrOptions as BootstrapOptions;
  return AtlasBootstrap.bootstrap(moduleClass, options);
}
