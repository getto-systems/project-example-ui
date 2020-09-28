import { ScriptAction } from "../../../script/action"

import { PagePathname, ScriptPath } from "../../../script/data"

export interface LoadApplicationComponent {
    onStateChange(stateChanged: Post<LoadApplicationState>): void
    init(): Terminate
    trigger(operation: LoadApplicationComponentOperation): Promise<void>
}

export type LoadApplicationParam = { LoadApplicationParam: never }

export interface LoadApplicationParamPacker {
    (param: Param): LoadApplicationParam
}
type Param = Readonly<{
    pagePathname: PagePathname
}>

export type LoadApplicationState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: LoadError }> |
    Readonly<{ type: "succeed-to-load" }> |
    Readonly<{ type: "error", err: string }>

export const initialLoadApplicationState: LoadApplicationState = { type: "initial-load" }

export type LoadApplicationComponentOperation =
    Readonly<{ type: "set-param", param: LoadApplicationParam }> |
    Readonly<{ type: "load" }> |
    Readonly<{ type: "failed-to-load", err: LoadError }> |
    Readonly<{ type: "succeed-to-load" }>

export type LoadError =
    Readonly<{ type: "infra-error", err: string }>

export interface LoadApplicationComponentAction {
    script: ScriptAction,
}

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}
