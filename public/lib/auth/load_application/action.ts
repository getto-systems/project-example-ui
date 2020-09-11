import { ScriptAction, ScriptEvent } from "../../script/action"

import { ScriptPath, CheckError } from "../../script/data"

export interface LoadApplicationComponentAction {
    script: ScriptAction,
}

export interface LoadApplicationComponent {
    initialState: LoadApplicationComponentState
    onStateChange(stateChanged: LoadApplicationComponentStateHandler): void

    load(currentLocation: Readonly<Location>): Promise<void>
}

export interface LoadApplicationComponentEvent extends ScriptEvent {
    onStateChange(stateChanged: LoadApplicationComponentStateHandler): void
}

export type LoadApplicationComponentState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>

export interface LoadApplicationComponentStateHandler {
    (state: LoadApplicationComponentState): void
}
