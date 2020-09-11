import { AuthAction, AuthEvent } from "../auth/action"
import { ScriptEvent } from "../script/action"

import { ScriptPath, CheckError } from "../script/data"

export interface LoadApplicationComponent {
    initialState(): LoadState
    onStateChange(stateChanged: LoadEventHandler): void

    load(): Promise<void>
}

export type LoadState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>

export interface LoadEventHandler {
    (state: LoadState): void
}

export function initLoadApplication(action: AuthAction, authEvent: AuthEvent, url: Readonly<URL>): LoadApplicationComponent {
    return new Component(action, authEvent, url)
}

class Component implements LoadApplicationComponent {
    action: AuthAction
    authEvent: AuthEvent
    url: Readonly<URL>
    eventHolder: EventHolder<ComponentEvent>

    constructor(action: AuthAction, authEvent: AuthEvent, url: Readonly<URL>) {
        this.action = action
        this.authEvent = authEvent
        this.url = url
        this.eventHolder = { hasEvent: false }
    }

    initialState(): LoadState {
        return { type: "initial-load" }
    }

    onStateChange(stateChanged: LoadEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged, this.authEvent) }
    }
    event(): ComponentEvent {
        return unwrap(this.eventHolder)
    }

    async load(): Promise<void> {
        await this.action.script.load(this.event(), this.url)
    }
}

class ComponentEvent implements ScriptEvent {
    stateChanged: LoadEventHandler
    authEvent: AuthEvent

    constructor(stateChanged: LoadEventHandler, authEvent: AuthEvent) {
        this.stateChanged = stateChanged
        this.authEvent = authEvent
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
