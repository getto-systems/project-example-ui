import {
    LoadApplicationComponent,
    LoadApplicationComponentAction,
    LoadApplicationParam,
    LoadApplicationState,
    LoadApplicationComponentOperation,
    LoadError,
} from "../load_application/component"

import { PagePathname, ScriptEvent } from "../../../script/data"

export function initLoadApplicationComponent(action: LoadApplicationComponentAction): LoadApplicationComponent {
    return new Component(action)
}

export function packLoadApplicationParam(param: Param): LoadApplicationParam {
    return param as LoadApplicationParam & Param
}

function unpackLoadApplicationParam(param: LoadApplicationParam): Param {
    return param as unknown as Param
}

type Param = Readonly<{
    pagePathname: PagePathname
}>

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

            case "failed-to-load":
                return this.failedToLoad(operation.err)

            case "succeed-to-load":
                return this.succeedToLoad()
        }
    }

    async setParam(param: LoadApplicationParam): Promise<void> {
        this.holder = { set: true, param: unpackLoadApplicationParam(param) }
    }

    async load(): Promise<void> {
        if (this.holder.set) {
            this.action.script.load(this.holder.param.pagePathname)
        } else {
            this.paramIsNotInitialized()
        }
    }

    async failedToLoad(err: LoadError): Promise<void> {
        this.post({ type: "failed-to-load", err })
    }

    async succeedToLoad(): Promise<void> {
        if (this.holder.set) {
            this.post({ type: "succeed-to-load" })
        } else {
            this.paramIsNotInitialized()
        }
    }

    paramIsNotInitialized(): void {
        this.post({ type: "error", err: "param is not initialized" })
    }
}

function mapEvent(event: ScriptEvent): LoadApplicationState {
    return event
}

interface Post<T> {
    (state: T): void
}

type ParamHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Readonly<T> }>

interface Terminate {
    (): void
}
