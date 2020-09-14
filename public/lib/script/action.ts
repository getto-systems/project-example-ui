import { PagePathname, ScriptEvent } from "./data"

export interface ScriptAction {
    load(pagePathname: PagePathname): Promise<void>
}

export interface ScriptEventHandler {
    handleScriptEvent(event: ScriptEvent): void
}
