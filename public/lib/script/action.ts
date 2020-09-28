import { PagePathname, ScriptPath, ScriptEvent } from "./data"

export interface ScriptAction {
    sub: ScriptEventSubscriber
    load(pagePathname: PagePathname): Promise<void>

    secureScriptPath(pagePathname: PagePathname): ScriptPath
}

export interface ScriptEventPublisher {
    postScriptEvent(event: ScriptEvent): void
}

export interface ScriptEventSubscriber {
    onScriptEvent(event: Post<ScriptEvent>): void
}

interface Post<T> {
    (state: T): void
}
