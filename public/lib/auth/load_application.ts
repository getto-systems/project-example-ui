import { AuthAction, AuthEvent } from "../auth/action"
import { ScriptEvent } from "../script/action"

import { ScriptPath, CheckError } from "../script/data"

export interface LoadApplicationComponent {
    initialState(): LoadState
    onStateChange(stateChanged: LoadEventHandler): void

    load(currentLocation: Readonly<Location>): Promise<void>
}

export interface LoadApplicationComponentEvent extends ScriptEvent { // eslint-disable-line @typescript-eslint/no-empty-interface
    onStateChange(stateChanged: LoadEventHandler): void
}

export type LoadState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>

export interface LoadEventHandler {
    (state: LoadState): void
}

export function initLoadApplication(action: AuthAction, authEvent: AuthEvent): LoadApplicationComponent {
    const event = new LoadApplicationComponentEventImpl(authEvent)
    return new Component(action, event)
}

export function initLoadApplicationWorker(action: AuthAction, event: LoadApplicationComponentEvent): LoadApplicationComponent {
    return new Component(action, event)
}

class Component implements LoadApplicationComponent {
    action: AuthAction
    event: LoadApplicationComponentEvent

    constructor(action: AuthAction, event: LoadApplicationComponentEvent) {
        this.action = action
        this.event = event
    }

    initialState(): LoadState {
        return { type: "initial-load" }
    }

    onStateChange(stateChanged: LoadEventHandler): void {
        this.event.onStateChange(stateChanged)
    }

    async load(currentLocation: Readonly<Location>): Promise<void> {
        await this.action.script.load(this.event, currentLocation)
    }
}

class LoadApplicationComponentEventImpl implements LoadApplicationComponentEvent {
    authEvent: AuthEvent
    eventHolder: EventHolder<LoadEventHandler>

    constructor(authEvent: AuthEvent) {
        this.authEvent = authEvent
        this.eventHolder = { hasEvent: false }
    }
    onStateChange(stateChanged: LoadEventHandler): void {
        this.eventHolder = { hasEvent: true, event: stateChanged }
    }
    stateChanged(state: LoadState): void {
        unwrap(this.eventHolder)(state)
    }

    tryToLoad(scriptPath: ScriptPath): void {
        this.stateChanged({ type: "try-to-load", scriptPath })
    }
    failedToLoad(err: CheckError): void {
        this.authEvent.failedToAuth({ type: "check", err })
    }
}

type EventHolder<T> =
    Readonly<{ hasEvent: false }> |
    Readonly<{ hasEvent: true, event: T }>
function unwrap<T>(holder: EventHolder<T>): T {
    if (!holder.hasEvent) {
        throw new Error("event is not initialized")
    }
    return holder.event
}
