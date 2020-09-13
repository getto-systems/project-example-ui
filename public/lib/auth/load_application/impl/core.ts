import {
    LoadApplicationComponent,
    LoadApplicationComponentAction,
    LoadApplicationComponentEventHandler,
} from "../action"

import {
    LoadApplicationComponentState,
    LoadApplicationComponentEvent,
} from "../data"
import { ScriptEvent } from "../../../script/data"

export function initLoadApplicationComponent(
    handler: LoadApplicationComponentEventHandler,
    action: LoadApplicationComponentAction,
    currentLocation: Readonly<Location>,
): LoadApplicationComponent {
    return new Component(handler, action, currentLocation)
}
export function initLoadApplicationWorkerComponent(init: InitWorker): LoadApplicationComponent {
    return new WorkerComponent(init)
}
export function initLoadApplicationComponentEventHandler(): LoadApplicationComponentEventHandler {
    return new ComponentEventHandler()
}

class Component implements LoadApplicationComponent {
    handler: LoadApplicationComponentEventHandler
    action: LoadApplicationComponentAction

    currentLocation: Readonly<Location>

    constructor(
        handler: LoadApplicationComponentEventHandler,
        action: LoadApplicationComponentAction,
        currentLocation: Readonly<Location>,
    ) {
        this.handler = handler

        this.action = action
        this.currentLocation = currentLocation
    }

    init(stateChanged: Publisher<LoadApplicationComponentState>): void {
        this.handler.onStateChange(stateChanged)
    }

    terminalte(): void { } // eslint-disable-line @typescript-eslint/no-empty-function

    trigger(_event: LoadApplicationComponentEvent): Promise<void> {
        // event は "load" だけなので単に呼び出す
        return this.load()
    }

    async load(): Promise<void> {
        // event は "load" だけなので単に呼び出す
        await this.action.script.load(this.currentLocation)
    }
}

class ComponentEventHandler implements LoadApplicationComponentEventHandler {
    holder: PublisherHolder<LoadApplicationComponentState>

    constructor() {
        this.holder = { set: false }
    }

    onStateChange(pub: Publisher<LoadApplicationComponentState>): void {
        this.holder = { set: true, pub }
    }

    handleScriptEvent(event: ScriptEvent): void {
        this.publish(event)
    }

    publish(state: LoadApplicationComponentState): void {
        if (this.holder.set) {
            this.holder.pub(state)
        }
    }
}

class WorkerComponent implements LoadApplicationComponent {
    holder: WorkerHolder

    constructor(init: InitWorker) {
        this.holder = { set: false, init }
    }

    init(stateChanged: Publisher<LoadApplicationComponentState>): void {
        if (!this.holder.set) {
            const worker = this.holder.init()
            worker.addEventListener("message", (event) => {
                stateChanged(event.data)
            })
            this.holder = { set: true, worker }
        }
    }

    terminalte(): void {
        if (this.holder.set) {
            this.holder.worker.terminate()
        }
    }

    async trigger(event: LoadApplicationComponentEvent): Promise<void> {
        if (this.holder.set) {
            this.holder.worker.postMessage(event)
        }
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}

type WorkerHolder =
    Readonly<{ set: false, init: InitWorker }> |
    Readonly<{ set: true, worker: Worker }>

interface InitWorker {
    (): Worker
}
