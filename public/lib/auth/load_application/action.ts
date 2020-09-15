import { ScriptAction, ScriptEventHandler } from "../../script/action"

import {
    LoadApplicationComponentState,
    LoadApplicationComponentEvent,
} from "./data"

export interface LoadApplicationComponentAction {
    script: ScriptAction,
}

export interface LoadApplicationComponent {
    init(stateChanged: Publisher<LoadApplicationComponentState>): void
    terminalte(): void
    trigger(event: LoadApplicationComponentEvent): Promise<void>
}

export interface LoadApplicationComponentEventHandler extends ScriptEventHandler {
    onStateChange(pub: Publisher<LoadApplicationComponentState>): void
}

interface Publisher<T> {
    (state: T): void
}
