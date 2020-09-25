import { ScriptAction } from "../../../script/action"

import { ScriptPath } from "../../../script/data"

export interface LoadApplicationComponent {
    onStateChange(stateChanged: Post<LoadApplicationState>): void
    init(): void
    terminate(): void
    trigger(operation: LoadApplicationComponentOperation): Promise<void>
}

export type LoadApplicationParam = { LoadApplicationParam: never }

export type LoadApplicationState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>

export const initialLoadApplicationState: LoadApplicationState = { type: "initial-load" }

export type CheckError =
    Readonly<{ type: "not-found" }>

export type LoadApplicationComponentOperation =
    Readonly<{ type: "load", param: LoadApplicationParam }>

export interface LoadApplicationComponentAction {
    script: ScriptAction,
}

interface Post<T> {
    (state: T): void
}
