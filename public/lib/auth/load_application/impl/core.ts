import {
    LoadApplicationComponent,
    LoadApplicationComponentAction,
    LoadApplicationComponentEventHandler,
} from "../action"

import {
    LoadApplicationComponentState,
    LoadApplicationComponentEvent,
} from "../data"
import { PagePathname, ScriptEvent } from "../../../script/data"

export function initLoadApplicationComponent(
    handler: LoadApplicationComponentEventHandler,
    action: LoadApplicationComponentAction,
    currentLocation: Readonly<Location>,
): LoadApplicationComponent {
    return new Component(handler, action, currentLocation)
}
export function initLoadApplicationWorkerComponent(init: WorkerInit): LoadApplicationComponent {
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

    terminate(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }

    trigger(event: LoadApplicationComponentEvent): Promise<void> {
        // event は "load" だけなので単に呼び出す
        return this.load(event.pagePathname)
    }

    async load(pagePathname: PagePathname): Promise<void> {
        await this.action.script.load(pagePathname)
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

    constructor(init: WorkerInit) {
        this.holder = { set: false, init }
    }

    init(stateChanged: Publisher<LoadApplicationComponentState>): void {
        if (!this.holder.set) {
            this.holder = { set: true, worker: this.initWorker(this.holder.init, stateChanged) }
        }
    }
    initWorker(init: WorkerInit, stateChanged: Publisher<LoadApplicationComponentState>): Worker {
        const worker = init()
        worker.addEventListener("message", (event) => {
            stateChanged(event.data)
        })
        return worker
    }

    terminate(): void {
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
    Readonly<{ set: false, init: WorkerInit }> |
    Readonly<{ set: true, worker: Worker }>

interface WorkerInit {
    (): Worker
}
