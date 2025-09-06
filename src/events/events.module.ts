// Events Module - Type-safe event creation utilities
export class EventNamespace<const T extends string> {
    private readonly events: { readonly [E in T]: `${string}:${E}` };

    constructor(namespace: string, eventNames: readonly T[]) {
        this.events = eventNames.reduce((acc, event) => {
            acc[event] = `${namespace}:${event}` as const;
            return acc;
        }, {} as { [K in T]: `${string}:${K}` });
    }

    getEvents(): { readonly [E in T]: `${string}:${E}` } {
        return this.events;
    }

    getEvent(event: T): `${string}:${T}` {
        return this.events[event];
    }
}

// Factory function for creating event namespaces
export function createEventNamespace<const T extends string>(
    namespace: string,
    events: readonly T[]
): EventNamespace<T> {
    return new EventNamespace(namespace, events);
}

// Type helper for event names
export type EventName<T extends readonly string[]> = T[number];

// Example usage:
/*
// Create a dance events namespace
const danceEvents = createEventNamespace('dance', [
    'GetAllSchedules',
    'GetAllSchedulesResponse',
    'CreateSchedule',
    'CreateScheduleResponse'
] as const);

// Use the events
const event = danceEvents.getEvent('GetAllSchedules'); // 'dance:GetAllSchedules'
const allEvents = danceEvents.getEvents(); // { GetAllSchedules: 'dance:GetAllSchedules', ... }
*/
