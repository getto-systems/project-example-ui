import { PagePathname, ScriptEvent } from "./data"

export interface ScriptAction {
    load(pagePathname: PagePathname): Promise<void>
}

export interface ScriptEventPublisher {
    publishScriptEvent(event: ScriptEvent): void
}

export interface ScriptEventSubscriber {
    onScriptEvent(event: Publisher<ScriptEvent>): void
}

interface Publisher<T> {
    (state: T): void
}
