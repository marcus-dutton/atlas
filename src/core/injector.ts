import 'reflect-metadata';
import { InjectionToken, Provider } from '../interfaces/types';

export class Injector {
  private providers = new Map<InjectionToken, Provider>();
  private instances = new Map<InjectionToken, any>();
  private parent?: Injector;

  constructor(providers: Provider[] = [], parent?: Injector) {
    this.parent = parent;
    providers.forEach(p => this.providers.set(p.provide, p));
  }

  get<T>(token: InjectionToken, notFoundValue?: T, options?: { optional?: boolean; self?: boolean; skipSelf?: boolean; host?: boolean }): T {
    if (this.instances.has(token)) return this.instances.get(token);
    
    let injectorToUse: Injector = this;
    
    if (options?.skipSelf) {
      injectorToUse = this.parent || this;
    }
    
    if (options?.self) {
      injectorToUse = this;
    }
    
    const providers = this.getAllProviders(token, injectorToUse, options);
    
    if (providers.length === 0) {
      if (options?.optional || notFoundValue !== undefined) {
        return notFoundValue as T;
      }
      throw new Error(`No provider for ${String(token)}`);
    }

    // Handle multi-providers
    if (providers.some(p => p.multi)) {
      const instances = providers.map(p => this.resolveProvider(p));
      this.instances.set(token, instances);
      return instances as any;
    }

    const instance = this.resolveProvider(providers[0]);
    this.instances.set(token, instance);
    return instance;
  }

  private getAllProviders(token: InjectionToken, injector: Injector, options?: { self?: boolean; skipSelf?: boolean }): Provider[] {
    const providers: Provider[] = [];
    
    if (injector.providers.has(token)) {
      providers.push(injector.providers.get(token)!);
    }
    
    if (!options?.self && !options?.skipSelf && injector.parent) {
      providers.push(...this.getAllProviders(token, injector.parent, options));
    }
    
    return providers;
  }

  private resolveProvider(provider: Provider): any {
    if (provider.useValue !== undefined) return provider.useValue;
    if (provider.useClass) return new (provider.useClass as new (...args: any[]) => any)(...this.resolveDeps(provider.useClass));
    if (provider.useFactory) return provider.useFactory(...this.resolveDeps(provider.useFactory));
    if (provider.useExisting) return this.get(provider.useExisting);
    throw new Error('Invalid provider');
  }

  private resolveDeps(target: any): any[] {
    const customDeps = Reflect.getMetadata('inject', target);
    const optionalDeps = Reflect.getMetadata('optional', target) || [];
    const selfDeps = Reflect.getMetadata('self', target) || [];
    const skipSelfDeps = Reflect.getMetadata('skipSelf', target) || [];
    const hostDeps = Reflect.getMetadata('host', target) || [];
    
    if (customDeps) {
      return customDeps.map((token: any, index: number) => 
        this.get(token, undefined, {
          optional: optionalDeps[index],
          self: selfDeps[index],
          skipSelf: skipSelfDeps[index],
          host: hostDeps[index]
        })
      );
    }
    
    const deps = Reflect.getMetadata('design:paramtypes', target) || [];
    return deps.map((dep: any, index: number) => 
      this.get(dep, undefined, {
        optional: optionalDeps[index],
        self: selfDeps[index],
        skipSelf: skipSelfDeps[index],
        host: hostDeps[index]
      })
    );
  }

  createChild(providers: Provider[]): Injector {
    return new Injector(providers, this);
  }
}
