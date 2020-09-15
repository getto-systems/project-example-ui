import { PagePathname, ScriptPath, CheckError } from "../../script/data"

export interface LoadApplicationComponent {
    init(stateChanged: Publisher<LoadApplicationComponentState>): void
    terminate(): void
    trigger(operation: LoadApplicationComponentOperation): Promise<void>
}

export type LoadApplicationComponentState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>

export const initialLoadApplicationComponentState: LoadApplicationComponentState = { type: "initial-load" }

export type LoadApplicationComponentOperation =
    Readonly<{ type: "load", pagePathname: PagePathname }>

interface Publisher<T> {
    (state: T): void
}
