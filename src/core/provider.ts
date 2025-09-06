import { InjectionToken, Provider } from '../interfaces/types';

export function provideClass(token: InjectionToken, cls: Function): Provider {
  return { provide: token, useClass: cls };
}

export function provideValue(token: InjectionToken, value: any): Provider {
  return { provide: token, useValue: value };
}

export function provideFactory(token: InjectionToken, factory: Function, deps: any[] = []): Provider {
  return { provide: token, useFactory: factory, deps };
}

export function provideExisting(token: InjectionToken, useExisting: InjectionToken): Provider {
  return { provide: token, useExisting };
}

export function provideMulti(token: InjectionToken, providers: Provider[]): Provider[] {
  return providers.map(p => ({ ...p, provide: token, multi: true }));
}
