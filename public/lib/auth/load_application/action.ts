import { ScriptAction, ScriptEventHandler } from "../../script/action"

import { LoadApplicationComponentState } from "./data"

export interface LoadApplicationComponentAction {
    script: ScriptAction,
}

export interface LoadApplicationComponentEventHandler extends ScriptEventHandler {
    onStateChange(pub: Publisher<LoadApplicationComponentState>): void
}

interface Publisher<T> {
    (state: T): void
}
