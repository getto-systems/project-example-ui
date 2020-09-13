import { ScriptAction } from "../../script/action"

import {
    LoadApplicationComponentState,
    LoadApplicationComponentEvent,
} from "./data"

import { ScriptEvent } from "../../script/data"

export interface LoadApplicationComponentAction {
    script: ScriptAction,
}

export interface LoadApplicationComponent {
    init(stateChanged: Publisher<LoadApplicationComponentState>): void
    terminalte(): void
    trigger(event: LoadApplicationComponentEvent): Promise<void>
}

export interface LoadApplicationComponentEventHandler {
    onStateChange(pub: Publisher<LoadApplicationComponentState>): void
    handleScriptEvent(event: ScriptEvent): void
}

interface Publisher<T> {
    (state: T): void
}
