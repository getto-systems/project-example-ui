import { AuthEvent } from "../../../auth/action"
import {
    LoadApplicationComponentAction,
    LoadApplicationComponent,
    LoadApplicationComponentState,
    LoadApplicationComponentEvent,
    LoadApplicationComponentEventInit,
    LoadApplicationComponentStateHandler,
} from "../action"

import { ScriptPath, CheckError } from "../../../script/data"

export function initLoadApplicationComponent(action: LoadApplicationComponentAction): LoadApplicationComponent {
    return new Component(action)
}
export function initLoadApplicationComponentEvent(authEvent: AuthEvent): LoadApplicationComponentEventInit {
    return (stateChanged) => new ComponentEvent(authEvent, stateChanged)
}

class Component implements LoadApplicationComponent {
    action: LoadApplicationComponentAction

    initialState: LoadApplicationComponentState = { type: "initial-load" }

    constructor(action: LoadApplicationComponentAction) {
        this.action = action
    }

    async load(event: LoadApplicationComponentEvent, currentLocation: Readonly<Location>): Promise<void> {
        await this.action.script.load(event, currentLocation)
    }
}

class ComponentEvent implements LoadApplicationComponentEvent {
    authEvent: AuthEvent
    stateChanged: LoadApplicationComponentStateHandler

    constructor(authEvent: AuthEvent, stateChanged: LoadApplicationComponentStateHandler) {
        this.authEvent = authEvent
        this.stateChanged = stateChanged
    }

    tryToLoad(scriptPath: ScriptPath): void {
        this.stateChanged({ type: "try-to-load", scriptPath })
    }
    failedToLoad(err: CheckError): void {
        this.authEvent.failedToAuth({ type: "check", err })
    }
}
