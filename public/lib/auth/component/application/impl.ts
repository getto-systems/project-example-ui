import {
    ApplicationComponent,
    ApplicationComponentResource,
    ApplicationParam,
    ApplicationState,
    ApplicationOperation,
} from "../application/component"

import { ApplicationAction } from "../../../application/action"

import { PagePathname } from "../../../application/data"

type Action = Readonly<{
    application: ApplicationAction
}>

export function initApplicationComponent(action: Action): ApplicationComponent {
    return new Component(action)
}

export function packApplicationParam(param: Param): ApplicationParam {
    return param as ApplicationParam & Param
}

function unpackParam(param: ApplicationParam): Param {
    return param as unknown as Param
}

type Param = Readonly<{
    pagePathname: PagePathname
}>

class Component implements ApplicationComponent {
    action: Action

    listener: Post<ApplicationState>[] = []
    holder: ParamHolder = { set: false }

    constructor(action: Action) {
        this.action = action
    }
    post(state: ApplicationState): void {
        this.listener.forEach(post => post(state))
    }

    onStateChange(stateChanged: Post<ApplicationState>): void {
        this.listener.push(stateChanged)
    }

    init(): ApplicationComponentResource {
        return {
            request: operation => this.request(operation),
            terminate: () => { /* WorkerComponent とインターフェイスを合わせるために必要 */ },
        }
    }
    request(operation: ApplicationOperation): void {
        switch (operation.type) {
            case "set-param":
                this.holder = { set: true, param: unpackParam(operation.param) }
                return

            case "load":
                if (this.holder.set) {
                    this.post({
                        type: "try-to-load",
                        scriptPath: this.action.application.secureScriptPath(this.holder.param.pagePathname),
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

const errorParamIsNotSet: ApplicationState = { type: "error", err: "param is not set: do `set-param` first" }

type ParamHolder =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Param }>

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
