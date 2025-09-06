export interface InjectableOptions {
  providedIn?: 'root' | 'platform' | 'any' | Function;
}

export function Injectable(options: InjectableOptions = {}) {
  return (target: any) => {
    Reflect.defineMetadata('injectable', true, target);
    Reflect.defineMetadata('injectable:options', options, target);
  };
}
