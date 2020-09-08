import { AuthAction, AuthEvent } from "../auth/action";
import { ScriptEvent } from "../ability/script/action";

import { ScriptPath, ScriptError } from "../ability/script/data";

export interface LoadApplicationComponent {
    initialState(): LoadState
    onStateChange(stateChanged: LoadEventHandler): void

    load(): Promise<void>
}

export type LoadState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load" }> |
    Readonly<{ type: "failed-to-load", err: ScriptError }> |
    Readonly<{ type: "succeed-to-load", scriptPath: ScriptPath }>

export interface LoadEventHandler {
    (state: LoadState): void
}

export function initLoadApplication(action: AuthAction, authEvent: AuthEvent): LoadApplicationComponent {
    return new LoadApplicationComponentImpl(action, authEvent);
}

class LoadApplicationComponentImpl implements LoadApplicationComponent {
    action: AuthAction
    authEvent: AuthEvent
    eventHolder: EventHolder<EventImpl>

    constructor(action: AuthAction, authEvent: AuthEvent) {
        this.action = action;
        this.authEvent = authEvent;
        this.eventHolder = { hasEvent: false }
    }

    initialState(): LoadState {
        return { type: "initial-load" };
    }

    onStateChange(stateChanged: LoadEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new EventImpl(this.authEvent, stateChanged) }
    }
    event(): EventImpl {
        return unwrap(this.eventHolder);
    }

    load(): Promise<void> {
        return this.action.script.load_withEvent(this.event());
    }
}

class EventImpl implements ScriptEvent {
    authEvent: AuthEvent
    stateChanged: LoadEventHandler

    constructor(authEvent: AuthEvent, stateChanged: LoadEventHandler) {
        this.authEvent = authEvent;
        this.stateChanged = stateChanged;
    }

    tryToLoad(): void {
        this.stateChanged({ type: "try-to-load" });
    }
    failedToLoad(err: ScriptError): void {
        this.stateChanged({ type: "failed-to-load", err });
    }
    succeedToLoad(scriptPath: ScriptPath): void {
        this.stateChanged({ type: "succeed-to-load", scriptPath });
    }
}

type EventHolder<T> =
    Readonly<{ hasEvent: false }> |
    Readonly<{ hasEvent: true, event: T }>
function unwrap<T>(holder: EventHolder<T>): T {
    if (!holder.hasEvent) {
        throw new Error("event is not initialized");
    }
    return holder.event;
}
