import {
    LoadApplicationComponentAction,
} from "../action"

import { ScriptEventSubscriber } from "../../../script/action"

import {
    LoadApplicationComponent,
    LoadApplicationComponentState,
    LoadApplicationComponentOperation,
} from "../data"
import { PagePathname, ScriptEvent } from "../../../script/data"

export function initLoadApplicationComponent(
    sub: ScriptEventSubscriber,
    action: LoadApplicationComponentAction,
): LoadApplicationComponent {
    return new Component(sub, action)
}
export function initLoadApplicationWorkerComponent(init: WorkerInit): LoadApplicationComponent {
    return new WorkerComponent(init)
}

class Component implements LoadApplicationComponent {
    sub: ScriptEventSubscriber
    action: LoadApplicationComponentAction

    constructor(
        sub: ScriptEventSubscriber,
        action: LoadApplicationComponentAction,
    ) {
        this.sub = sub
        this.action = action
    }

    init(stateChanged: Publisher<LoadApplicationComponentState>): void {
        this.sub.onScriptEvent((event) => {
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

    async trigger(operation: LoadApplicationComponentOperation): Promise<void> {
        if (this.holder.set) {
            this.holder.worker.postMessage(operation)
        }
    }
}

interface Publisher<T> {
    (state: T): void
}

type WorkerHolder =
    Readonly<{ set: false, init: WorkerInit }> |
    Readonly<{ set: true, worker: Worker }>

interface WorkerInit {
    (): Worker
}
