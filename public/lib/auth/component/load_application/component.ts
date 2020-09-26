import { ScriptAction } from "../../../script/action"

import { PagePathname, ScriptPath } from "../../../script/data"

export interface LoadApplicationComponent {
    onStateChange(stateChanged: Post<LoadApplicationState>): void
    init(): Terminate
    trigger(operation: LoadApplicationComponentOperation): Promise<void>
}

export type LoadApplicationParam = { LoadApplicationParam: never }

export interface LoadApplicationParamPacker {
    (pagePathname: PagePathname): LoadApplicationParam
}

export type LoadApplicationState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>

export const initialLoadApplicationState: LoadApplicationState = { type: "initial-load" }

export type CheckError =
    Readonly<{ type: "not-found" }>

export type LoadApplicationComponentOperation =
    Readonly<{ type: "set-param", param: LoadApplicationParam }> |
    Readonly<{ type: "load" }>

export interface LoadApplicationComponentAction {
    script: ScriptAction,
}

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}
