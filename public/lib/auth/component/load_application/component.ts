import { PagePathname, ScriptPath } from "../../../script/data"

export type LoadApplicationParam = { LoadApplicationParam: never }

export interface LoadApplicationParamPacker {
    (param: Param): LoadApplicationParam
}
type Param = Readonly<{
    pagePathname: PagePathname
}>

export interface LoadApplicationComponent {
    onStateChange(stateChanged: Post<LoadApplicationState>): void
    init(): ComponentResource<LoadApplicationOperation>
}

export type LoadApplicationState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: LoadError }> |
    Readonly<{ type: "error", err: string }>

export const initialLoadApplicationState: LoadApplicationState = { type: "initial-load" }

export type LoadApplicationOperation =
    Readonly<{ type: "set-param", param: LoadApplicationParam }> |
    Readonly<{ type: "load" }> |
    Readonly<{ type: "failed-to-load", err: LoadError }>

export const initialLoadApplicationSend: Post<LoadApplicationOperation> = (): void => {
    throw new Error("Component is not initialized. use: `init()`")
}

export type LoadError =
    Readonly<{ type: "infra-error", err: string }>

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

type ComponentResource<T> = Readonly<{
    send: Post<T>
    terminate: Terminate
}>
