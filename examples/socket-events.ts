// Example: Using the Events Module for Type-Safe Socket.IO Events

import { Injectable } from '../decorators/injectable';
import { EventService } from '../services/event.service';
import { createEventNamespace } from '../src/events/events.module';

// Define your event namespaces using the events module
const danceEvents = createEventNamespace('dance', [
    'GetAllSchedules',
    'GetAllSchedulesResponse',
    'CreateSchedule',
    'CreateScheduleResponse',
    'UpdateSchedule',
    'UpdateScheduleResponse'
] as const);

const bankingEvents = createEventNamespace('banking', [
    'GetAccounts',
    'GetAccountsResponse',
    'TransferFunds',
    'TransferFundsResponse'
] as const);

const authEvents = createEventNamespace('auth', [
    'Login',
    'LoginResponse',
    'Logout',
    'LogoutResponse'
] as const);

@Injectable({ providedIn: 'root' })
export class SocketService {
    constructor(private eventService: EventService) {
        console.log('🔌 SocketService initialized');

        // Register your event namespaces with the EventService
        this.eventService.registerEvents('dance', danceEvents.getEvents());
        this.eventService.registerEvents('banking', bankingEvents.getEvents());
        this.eventService.registerEvents('auth', authEvents.getEvents());
    }

    // Example: Setting up Socket.IO event handlers
    setupSocketHandlers(socket: any): void {
        // Dance Events - using the type-safe namespace
        socket.on(danceEvents.getEvent('GetAllSchedules'), (data: any) => {
            console.log('📅 Getting all dance schedules');
            socket.emit(danceEvents.getEvent('GetAllSchedulesResponse'), {
                schedules: []
            });
        });

        socket.on(danceEvents.getEvent('CreateSchedule'), (data: any) => {
            console.log('📅 Creating dance schedule:', data);
            socket.emit(danceEvents.getEvent('CreateScheduleResponse'), {
                success: true,
                schedule: data
            });
        });

        // Banking Events
        socket.on(bankingEvents.getEvent('GetAccounts'), (data: any) => {
            console.log('🏦 Getting accounts');
            socket.emit(bankingEvents.getEvent('GetAccountsResponse'), {
                accounts: []
            });
        });

        // Auth Events
        socket.on(authEvents.getEvent('Login'), (data: any) => {
            console.log('🔐 User login attempt');
            socket.emit(authEvents.getEvent('LoginResponse'), {
                success: true,
                token: 'jwt-token-here'
            });
        });
    }

    // Example: Type-safe event emission
    emitDanceSchedule(socket: any, schedule: any): void {
        socket.emit(danceEvents.getEvent('CreateSchedule'), schedule);
    }

    emitBankingTransfer(socket: any, transfer: any): void {
        socket.emit(bankingEvents.getEvent('TransferFunds'), transfer);
    }

    // Example: Listening for responses
    listenForScheduleResponse(socket: any, callback: (response: any) => void): void {
        socket.on(danceEvents.getEvent('CreateScheduleResponse'), callback);
    }
}

// Example: Controller using the events module
@Injectable()
export class DanceController {
    constructor(private eventService: EventService) {}

    handleGetSchedules(socket: any): void {
        // Get the registered dance events
        const danceEvents = this.eventService.getRegisteredEvents('dance');

        socket.on(danceEvents.GetAllSchedules, (data: any) => {
            console.log(`📅 Handling ${danceEvents.GetAllSchedules}`);
            socket.emit(danceEvents.GetAllSchedulesResponse, {
                schedules: []
            });
        });
    }
}

// Example: Creating custom events on-the-fly
const customEvents = createEventNamespace('custom', [
    'CustomEvent1',
    'CustomEvent2'
] as const);

// Usage:
// customEvents.getEvent('CustomEvent1') = 'custom:CustomEvent1'
// customEvents.getEvent('CustomEvent2') = 'custom:CustomEvent2'

// Example: Extending with your own event namespace class
export class MyAppEvents {
    static readonly user = createEventNamespace('user', [
        'ProfileUpdate',
        'ProfileUpdateResponse',
        'GetProfile',
        'GetProfileResponse'
    ] as const);

    static readonly chat = createEventNamespace('chat', [
        'SendMessage',
        'SendMessageResponse',
        'GetMessages',
        'GetMessagesResponse'
    ] as const);
}
