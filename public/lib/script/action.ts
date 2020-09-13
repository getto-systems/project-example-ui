import { ScriptEvent } from "./data"

export interface ScriptAction {
    load(currentLocation: Readonly<Location>): Promise<void>
}

export interface ScriptEventHandler {
    handleScriptEvent(event: ScriptEvent): void
}
