import {
    LoadApplicationComponent,
    LoadApplicationParam,
    LoadApplicationState,
    LoadApplicationOperation,
} from "../load_application/component"

import { ScriptAction } from "../../../script/action"

import { PagePathname } from "../../../script/data"

interface Action {
    script: ScriptAction,
}

export function initLoadApplicationComponent(action: Action): LoadApplicationComponent {
    return new Component(action)
}

export function packLoadApplicationParam(param: Param): LoadApplicationParam {
    return param as LoadApplicationParam & Param
}

function unpackParam(param: LoadApplicationParam): Param {
    return param as unknown as Param
}

type Param = Readonly<{
    pagePathname: PagePathname
}>

class Component implements LoadApplicationComponent {
    action: Action

    listener: Post<LoadApplicationState>[] = []
    holder: ParamHolder = { set: false }

    constructor(action: Action) {
        this.action = action
    }
    post(state: LoadApplicationState): void {
        this.listener.forEach(post => post(state))
    }

    onStateChange(stateChanged: Post<LoadApplicationState>): void {
        this.listener.push(stateChanged)
    }

    init(): ComponentResource<LoadApplicationOperation> {
        return {
            send: operation => this.send(operation),
            terminate: () => { /* WorkerComponent とインターフェイスを合わせるために必要 */ },
        }
    }
    send(operation: LoadApplicationOperation): void {
        switch (operation.type) {
            case "set-param":
                this.holder = { set: true, param: unpackParam(operation.param) }
                return

            case "load":
                if (this.holder.set) {
                    this.post({
                        type: "try-to-load",
                        scriptPath: this.action.script.secureScriptPath(this.holder.param.pagePathname),
                    })
                } else {
                    this.post(errorParamIsNotSet)
                }
                return

            case "failed-to-load":
                this.post({ type: "failed-to-load", err: operation.err })
                return

            default:
                assertNever(operation)
        }
    }
}

const errorParamIsNotSet: LoadApplicationState = { type: "error", err: "param is not set: do `set-param` first" }

interface Post<T> {
    (state: T): void
}

type ParamHolder =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Param }>

interface Terminate {
    (): void
}

type ComponentResource<T> = Readonly<{
    send: Post<T>
    terminate: Terminate
}>

function assertNever(_: never): never {
    throw new Error("NEVER")
}
