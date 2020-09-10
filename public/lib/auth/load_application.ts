import { AuthAction, AuthEvent } from "../auth/action";
import { ScriptEvent } from "../script/action";

import { ScriptPath, ScriptError } from "../script/data";

export interface LoadApplicationComponent {
    initialState(): LoadState
    onStateChange(stateChanged: LoadEventHandler): void

    load(): Promise<void>
}

export type LoadState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "failed-to-load", err: ScriptError }> |
    Readonly<{ type: "succeed-to-load", scriptPath: ScriptPath }>

export interface LoadEventHandler {
    (state: LoadState): void
}

export function initLoadApplication(action: AuthAction, authEvent: AuthEvent): LoadApplicationComponent {
    return new Component(action, authEvent);
}

class Component implements LoadApplicationComponent {
    action: AuthAction
    authEvent: AuthEvent
    eventHolder: EventHolder<ComponentEvent>

    constructor(action: AuthAction, authEvent: AuthEvent) {
        this.action = action;
        this.authEvent = authEvent;
        this.eventHolder = { hasEvent: false }
    }

    initialState(): LoadState {
        return { type: "initial-load" };
    }

    onStateChange(stateChanged: LoadEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged, this.authEvent) }
    }
    event(): ComponentEvent {
        return unwrap(this.eventHolder);
    }

    async load(): Promise<void> {
        await this.action.script.load(this.event());
    }
}

class ComponentEvent implements ScriptEvent {
    stateChanged: LoadEventHandler
    authEvent: AuthEvent

    constructor(stateChanged: LoadEventHandler, authEvent: AuthEvent) {
        this.stateChanged = stateChanged;
        this.authEvent = authEvent;
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
