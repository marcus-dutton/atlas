export type InjectionToken = string | symbol | Function;

export enum ServiceType {
  Injectable = 'injectable',
  Controller = 'controller',
  Gateway = 'gateway',
  Service = 'service',
  Middleware = 'middleware',
  Module = 'module'
}

export interface Provider {
  provide: InjectionToken;
  useClass?: Function;
  useValue?: any;
  useFactory?: Function;
  useExisting?: InjectionToken;
  deps?: any[];
  multi?: boolean;
}

export interface ModuleWithProviders<T = any> {
  ngModule: T;
  providers: Provider[];
}

export class OpaqueToken<T = any> {
  constructor(protected _desc: string, options?: { providedIn?: 'root' | 'platform' | 'any' | null; factory: () => T }) {}
  
  toString(): string {
    return `OpaqueToken ${this._desc}`;
  }
}
