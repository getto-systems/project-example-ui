import { PagePathname, ScriptEvent } from "./data"

export interface ScriptAction {
    sub: ScriptEventSubscriber
    load(pagePathname: PagePathname): Promise<void>
}

export interface ScriptEventPublisher {
    dispatchScriptEvent(event: ScriptEvent): void
}

export interface ScriptEventSubscriber {
    onScriptEvent(event: Dispatcher<ScriptEvent>): void
}

interface Dispatcher<T> {
    (state: T): void
}
