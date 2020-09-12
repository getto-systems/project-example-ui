import { ScriptAction, ScriptEvent } from "../../script/action"

import { ScriptPath, CheckError } from "../../script/data"

export interface LoadApplicationComponentAction {
    script: ScriptAction,
}

export interface LoadApplicationComponent {
    initialState: LoadApplicationComponentState

    load(event: LoadApplicationComponentEvent, currentLocation: Readonly<Location>): Promise<void>
}

export type LoadApplicationComponentState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>

export interface LoadApplicationComponentEvent extends ScriptEvent { } // eslint-disable-line @typescript-eslint/no-empty-interface

export interface LoadApplicationComponentEventInit {
    (stateChanged: LoadApplicationComponentStateHandler): LoadApplicationComponentEvent
}

export interface LoadApplicationComponentStateHandler {
    (state: LoadApplicationComponentState): void
}
