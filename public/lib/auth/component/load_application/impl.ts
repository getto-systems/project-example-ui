import { unpackLoadApplicationParam } from "./param"

import {
    LoadApplicationComponent,
    LoadApplicationComponentAction,
    LoadApplicationState,
    LoadApplicationComponentOperation,
} from "../load_application/component"

import { PagePathname, ScriptEvent } from "../../../script/data"

export function initLoadApplicationComponent(action: LoadApplicationComponentAction): LoadApplicationComponent {
    return new Component(action)
}
export function initLoadApplicationWorkerComponent(init: WorkerInit): LoadApplicationComponent {
    return new WorkerComponent(init)
}

class Component implements LoadApplicationComponent {
    action: LoadApplicationComponentAction
    listener: Post<LoadApplicationState>[]

    constructor(action: LoadApplicationComponentAction) {
        this.action = action
        this.action.script.sub.onScriptEvent((event) => {
            const state = mapEvent(event)
            this.listener.forEach(post => post(state))
        })

        this.listener = []
    }

    onStateChange(stateChanged: Post<LoadApplicationState>): void {
        this.listener.push(stateChanged)
    }

    init(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }
    terminate(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }

    trigger(operation: LoadApplicationComponentOperation): Promise<void> {
        // type は "load" だけなので単に呼び出す
        return this.load(unpackLoadApplicationParam(operation.param).pagePathname)
    }

    async load(pagePathname: PagePathname): Promise<void> {
        await this.action.script.load(pagePathname)
    }
}

class WorkerComponent implements LoadApplicationComponent {
    worker: WorkerHolder

    listener: Post<LoadApplicationState>[]

    constructor(init: WorkerInit) {
        this.worker = { set: false, init }
        this.listener = []
    }

    onStateChange(stateChanged: Post<LoadApplicationState>): void {
        this.listener.push(stateChanged)
    }

    init(): void {
        if (!this.worker.set) {
            const instance = this.worker.init()

            instance.addEventListener("message", (event) => {
                const state = event.data as LoadApplicationState
                this.listener.forEach(post => post(state))
            })

            this.worker = { set: true, instance }
        }
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

function mapEvent(event: ScriptEvent): LoadApplicationState {
    return event
}

interface Post<T> {
    (state: T): void
}

type WorkerHolder =
    Readonly<{ set: false, init: WorkerInit }> |
    Readonly<{ set: true, instance: Worker }>

interface WorkerInit {
    (): Worker
}
