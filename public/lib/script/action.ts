import { ScriptPath, ScriptError } from "./data";

export interface ScriptAction {
    load(event: ScriptEvent): Promise<void>
}

export interface ScriptEvent {
    failedToLoad(err: ScriptError): void
    succeedToLoad(scriptPath: ScriptPath): void
}
