import {
    LoadApplicationComponentAction,
} from "./action"

import {
    LoadApplicationComponent,
    LoadApplicationComponentState,
    LoadApplicationComponentOperation,
} from "./data"
import { PagePathname, ScriptEvent } from "../../script/data"

export function initLoadApplicationComponent(action: LoadApplicationComponentAction): LoadApplicationComponent {
    return new Component(action)
}
export function initLoadApplicationWorkerComponent(init: WorkerInit): LoadApplicationComponent {
    return new WorkerComponent(init)
}

class Component implements LoadApplicationComponent {
    action: LoadApplicationComponentAction

    constructor(action: LoadApplicationComponentAction) {
        this.action = action
    }

    init(stateChanged: Publisher<LoadApplicationComponentState>): void {
        this.action.script.sub.onScriptEvent((event) => {
            stateChanged(map(event))

            function map(event: ScriptEvent): LoadApplicationComponentState {
                return event
            }
        })
    }

    terminate(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }

    trigger(operation: LoadApplicationComponentOperation): Promise<void> {
        // type は "load" だけなので単に呼び出す
        return this.load(operation.pagePathname)
    }

    async load(pagePathname: PagePathname): Promise<void> {
        await this.action.script.load(pagePathname)
    }
}

class WorkerComponent implements LoadApplicationComponent {
    worker: WorkerHolder

    constructor(init: WorkerInit) {
        this.worker = { set: false, init }
    }

    init(stateChanged: Publisher<LoadApplicationComponentState>): void {
        if (!this.worker.set) {
            this.worker = { set: true, instance: this.initWorker(this.worker.init, stateChanged) }
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
        if (this.worker.set) {
            this.worker.instance.terminate()
        }
    }

    async trigger(operation: LoadApplicationComponentOperation): Promise<void> {
        if (this.worker.set) {
            this.worker.instance.postMessage(operation)
        }
    }
}

interface Publisher<T> {
    (state: T): void
}

type WorkerHolder =
    Readonly<{ set: false, init: WorkerInit }> |
    Readonly<{ set: true, instance: Worker }>

interface WorkerInit {
    (): Worker
}
