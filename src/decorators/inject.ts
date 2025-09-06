import { InjectionToken } from '../interfaces/types';

export function Inject(token: InjectionToken) {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const existing = Reflect.getMetadata('inject', target) || [];
    existing[parameterIndex] = token;
    Reflect.defineMetadata('inject', existing, target);
  };
}
