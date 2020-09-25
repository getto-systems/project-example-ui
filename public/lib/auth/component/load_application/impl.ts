import { unpackLoadApplicationParam } from "./param"

import {
    LoadApplicationComponent,
    LoadApplicationComponentAction,
    LoadApplicationParam,
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

    param: Param<{
        pagePathname: PagePathname
    }>

    constructor(action: LoadApplicationComponentAction) {
        this.action = action
        this.action.script.sub.onScriptEvent((event) => {
            const state = mapEvent(event)
            this.listener.forEach(post => post(state))
        })

        this.listener = []
        this.param = { set: false }
    }

    onStateChange(stateChanged: Post<LoadApplicationState>): void {
        this.listener.push(stateChanged)
    }

    init(): Terminate {
        return () => this.terminate()
    }
    terminate(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }

    trigger(operation: LoadApplicationComponentOperation): Promise<void> {
        switch (operation.type) {
            case "set-param":
                return this.setParam(operation.param)

            case "load":
                return this.action.script.load(unwrap(this.param).pagePathname)
        }
    }

    async setParam(param: LoadApplicationParam): Promise<void> {
        this.param = { set: true, param: unpackLoadApplicationParam(param) }
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

    init(): Terminate {
        this.initComponent()
        return () => this.terminate()
    }

    initComponent(): void {
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

type Param<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Readonly<T> }>

function unwrap<T>(param: Param<T>): Readonly<T> {
    if (!param.set) {
        throw new Error("not initialized")
    }
    return param.param
}

interface Terminate {
    (): void
}
