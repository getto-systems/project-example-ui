import { ScriptPath, CheckError } from "./data"

export interface ScriptAction {
    load(event: ScriptEvent, url: Readonly<URL>): Promise<void>
}

export interface ScriptEvent {
    tryToLoad(scriptPath: ScriptPath): void
    failedToLoad(err: CheckError): void
}
