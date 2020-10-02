import {
    NavigationComponent,
    NavigationComponentResource,
    NavigationParam,
    NavigationState,
    NavigationOperation,
} from "./component"

import { NavigationAction } from "../../navigation/action"

import { Expansion } from "../../navigation/data"
import { PagePathname } from "../../location/data"

type Action = Readonly<{
    navigation: NavigationAction
}>

export function initNavigationComponent(action: Action): NavigationComponent {
    return new Component(action)
}
export function initNavigationWorkerComponent(initializer: WorkerInitializer): NavigationComponent {
    return new WorkerComponent(initializer)
}

export function packNavigationParam(param: Param): NavigationParam {
    return param as NavigationParam & Param
}

function unpackParam(param: NavigationParam): Param {
    return param as unknown as Param
}

type Param = Readonly<{
    pagePathname: PagePathname
    expansion: Expansion
}>

class Component implements NavigationComponent {
    action: Action

    listener: Post<NavigationState>[] = []
    holder: ParamHolder = { set: false }

    constructor(action: Action) {
        this.action = action
    }
    post(state: NavigationState): void {
        this.listener.forEach(post => post(state))
    }

    onStateChange(stateChanged: Post<NavigationState>): void {
        this.listener.push(stateChanged)
    }

    init(): NavigationComponentResource {
        return {
            request: operation => this.request(operation),
            terminate: () => { /* WorkerComponent とインターフェイスを合わせるために必要 */ },
        }
    }
    request(operation: NavigationOperation): void {
        switch (operation.type) {
            case "set-param":
                this.holder = { set: true, param: unpackParam(operation.param) }
                return

            case "load":
                if (this.holder.set) {
                    this.action.navigation.loadNavigationList(
                        this.holder.param.pagePathname,
                        this.holder.param.expansion,
                    )
                } else {
                    this.post(paramIsNotSet)
                }
                return

            default:
                assertNever(operation)
        }
    }
}

const paramIsNotSet: NavigationState = { type: "error", err: "param is not set: do `set-param` first" }

class WorkerComponent implements NavigationComponent {
    initializer: WorkerInitializer

    listener: Post<NavigationState>[] = []

    constructor(initializer: WorkerInitializer) {
        this.initializer = initializer
    }

    onStateChange(stateChanged: Post<NavigationState>): void {
        this.listener.push(stateChanged)
    }

    init(): NavigationComponentResource {
        const worker = this.initWorker()
        return {
            request: operation => worker.postMessage(operation),
            terminate: () => worker.terminate(),
        }
    }
    initWorker(): Worker {
        const worker = this.initializer()

        worker.addEventListener("message", (event) => {
            const state = event.data as NavigationState
            this.listener.forEach(post => post(state))
        })

        return worker
    }
}

type ParamHolder =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Param }>

interface Post<T> {
    (state: T): void
}

interface WorkerInitializer {
    (): Worker
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
