import { ServiceType } from '../interfaces/types';

export function Controller(prefix: string = '') {
  return (target: any) => {
    Reflect.defineMetadata('service:type', ServiceType.Controller, target);
    Reflect.defineMetadata('controller:prefix', prefix, target);
  };
}

export function Gateway(namespace: string = '/') {
  return (target: any) => {
    Reflect.defineMetadata('service:type', ServiceType.Gateway, target);
    Reflect.defineMetadata('gateway:namespace', namespace, target);
  };
}

export function Service() {
  return (target: any) => {
    Reflect.defineMetadata('service:type', ServiceType.Service, target);
  };
}

export function Middleware() {
  return (target: any) => {
    Reflect.defineMetadata('service:type', ServiceType.Middleware, target);
  };
}

export function Module(providers: any[] = []) {
  return (target: any) => {
    Reflect.defineMetadata('service:type', ServiceType.Module, target);
    Reflect.defineMetadata('module:providers', providers, target);
  };
}
