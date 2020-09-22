import { LoadApplicationState, LoadApplicationComponentOperation } from "./data"

import { ScriptAction } from "../../script/action"

export interface LoadApplicationComponent {
    onStateChange(stateChanged: Publisher<LoadApplicationState>): void
    terminate(): void
    trigger(operation: LoadApplicationComponentOperation): Promise<void>
}

export interface LoadApplicationComponentAction {
    script: ScriptAction,
}

interface Publisher<T> {
    (state: T): void
}
