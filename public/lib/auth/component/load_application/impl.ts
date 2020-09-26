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

export function packLoadApplicationParam(pagePathname: PagePathname): LoadApplicationParam {
    return { pagePathname } as LoadApplicationParam & Param
}

function unpackLoadApplicationParam(param: LoadApplicationParam): Param {
    return param as unknown as Param
}

type Param = {
    pagePathname: PagePathname
}

class Component implements LoadApplicationComponent {
    action: LoadApplicationComponentAction
    listener: Post<LoadApplicationState>[]

    holder: ParamHolder<Param>

    constructor(action: LoadApplicationComponentAction) {
        this.action = action
        this.action.script.sub.onScriptEvent((event) => {
            const state = mapEvent(event)
            this.listener.forEach(post => post(state))
        })

        this.listener = []
        this.holder = { set: false }
    }

    onStateChange(stateChanged: Post<LoadApplicationState>): void {
        this.listener.push(stateChanged)
    }

    post(state: LoadApplicationState): void {
        this.listener.forEach(post => post(state))
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
                return this.load()
        }
    }

    async setParam(param: LoadApplicationParam): Promise<void> {
        this.holder = { set: true, param: unpackLoadApplicationParam(param) }
    }

    async load(): Promise<void> {
        if (this.holder.set) {
            this.action.script.load(this.holder.param.pagePathname)
        } else {
            this.post({ type: "error", err: "param is not initialized" })
        }
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

type ParamHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Readonly<T> }>

interface Terminate {
    (): void
}
