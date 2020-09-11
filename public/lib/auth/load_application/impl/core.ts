import { AuthEvent } from "../../../auth/action"
import {
    LoadApplicationComponentAction,
    LoadApplicationComponent,
    LoadApplicationComponentEvent,
    LoadApplicationComponentState,
    LoadApplicationComponentStateHandler,
} from "../action"

import { ScriptPath, CheckError } from "../../../script/data"

export function initLoadApplication(action: LoadApplicationComponentAction, authEvent: AuthEvent): LoadApplicationComponent {
    const event = new LoadApplicationComponentEventImpl(authEvent)
    return new Component(action, event)
}

export function initLoadApplicationWorker(action: LoadApplicationComponentAction, event: LoadApplicationComponentEvent): LoadApplicationComponent {
    return new Component(action, event)
}

class Component implements LoadApplicationComponent {
    action: LoadApplicationComponentAction
    event: LoadApplicationComponentEvent

    initialState: LoadApplicationComponentState = { type: "initial-load" }

    constructor(action: LoadApplicationComponentAction, event: LoadApplicationComponentEvent) {
        this.action = action
        this.event = event
    }

    onStateChange(stateChanged: LoadApplicationComponentStateHandler): void {
        this.event.onStateChange(stateChanged)
    }

    async load(currentLocation: Readonly<Location>): Promise<void> {
        await this.action.script.load(this.event, currentLocation)
    }
}

class LoadApplicationComponentEventImpl implements LoadApplicationComponentEvent {
    authEvent: AuthEvent
    eventHolder: EventHolder<LoadApplicationComponentStateHandler>

    constructor(authEvent: AuthEvent) {
        this.authEvent = authEvent
        this.eventHolder = { hasEvent: false }
    }
    onStateChange(stateChanged: LoadApplicationComponentStateHandler): void {
        this.eventHolder = { hasEvent: true, event: stateChanged }
    }
    stateChanged(state: LoadApplicationComponentState): void {
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
