import { InjectionToken } from '../interfaces/types';

export function Optional() {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const existing = Reflect.getMetadata('optional', target) || [];
    existing[parameterIndex] = true;
    Reflect.defineMetadata('optional', existing, target);
  };
}

export function Self() {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const existing = Reflect.getMetadata('self', target) || [];
    existing[parameterIndex] = true;
    Reflect.defineMetadata('self', existing, target);
  };
}

export function SkipSelf() {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const existing = Reflect.getMetadata('skipSelf', target) || [];
    existing[parameterIndex] = true;
    Reflect.defineMetadata('skipSelf', existing, target);
  };
}

export function Host() {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const existing = Reflect.getMetadata('host', target) || [];
    existing[parameterIndex] = true;
    Reflect.defineMetadata('host', existing, target);
  };
}
