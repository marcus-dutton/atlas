import { Injectable } from '../decorators/injectable';

@Injectable({ providedIn: 'root' })
export class EventService {
    private createEvents<const T extends string>(
        namespace: string,
        events: readonly T[]
    ): { readonly [E in T]: `${typeof namespace}:${E}` } {
        return events.reduce((acc, event) => {
            acc[event] = `${namespace}:${event}` as const;
            return acc;
        }, {} as { [K in T]: `${typeof namespace}:${K}` });
    }

    // Utility methods for Socket.IO
    emit<T = any>(socket: any, event: string, data?: T): void {
        socket.emit(event, data);
    }

    on<T = any>(socket: any, event: string, callback: (data: T) => void): void {
        socket.on(event, callback);
    }

    // Type-safe event emission
    emitTyped<T = any>(socket: any, event: string, data?: T): void {
        this.emit(socket, event, data);
    }

    // Create custom events for any namespace
    createNamespaceEvents<const T extends string>(
        namespace: string,
        events: readonly T[]
    ): { readonly [E in T]: `${typeof namespace}:${E}` } {
        return this.createEvents(namespace, events);
    }

    // Register and get events from external models
    private registeredEvents: Map<string, any> = new Map();

    registerEvents(namespace: string, events: any): void {
        this.registeredEvents.set(namespace, events);
    }

    getRegisteredEvents(namespace: string): any {
        return this.registeredEvents.get(namespace);
    }

    // Get all registered events (for debugging/logging)
    getAllRegisteredEvents(): Record<string, any> {
        const result: Record<string, any> = {};
        this.registeredEvents.forEach((events, namespace) => {
            result[namespace] = events;
        });
        return result;
    }
}

// Provider function for Angular-style module setup
export function provideEventService(): any {
  return {
    provide: EventService,
    useClass: EventService
  };
}
