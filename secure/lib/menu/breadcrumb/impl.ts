import {
    BreadcrumbComponent,
    BreadcrumbComponentResource,
    BreadcrumbParam,
    BreadcrumbState,
    BreadcrumbOperation,
} from "./component"

import { NavigationAction } from "../../navigation/action"

import { PagePathname } from "../../location/data"

type Action = Readonly<{
    navigation: NavigationAction
}>

export function initBreadcrumbComponent(action: Action): BreadcrumbComponent {
    return new Component(action)
}
export function initBreadcrumbWorkerComponent(initializer: WorkerInitializer): BreadcrumbComponent {
    return new WorkerComponent(initializer)
}

export function packBreadcrumbParam(param: Param): BreadcrumbParam {
    return param as BreadcrumbParam & Param
}

function unpackParam(param: BreadcrumbParam): Param {
    return param as unknown as Param
}

type Param = Readonly<{
    pagePathname: PagePathname
}>

class Component implements BreadcrumbComponent {
    action: Action

    listener: Post<BreadcrumbState>[] = []
    holder: ParamHolder = { set: false }

    constructor(action: Action) {
        this.action = action
    }
    post(state: BreadcrumbState): void {
        this.listener.forEach(post => post(state))
    }

    onStateChange(stateChanged: Post<BreadcrumbState>): void {
        this.listener.push(stateChanged)
    }

    init(): BreadcrumbComponentResource {
        return {
            request: operation => this.request(operation),
            terminate: () => { /* WorkerComponent とインターフェイスを合わせるために必要 */ },
        }
    }
    request(operation: BreadcrumbOperation): void {
        switch (operation.type) {
            case "set-param":
                this.holder = { set: true, param: unpackParam(operation.param) }
                return

            case "detect":
                if (this.holder.set) {
                    this.post({
                        type: "loaded",
                        breadcrumbs: this.action.navigation.detect(this.holder.param.pagePathname),
                    })
                } else {
                    this.post(paramIsNotSet)
                }
                return

            default:
                assertNever(operation)
        }
    }
}

const paramIsNotSet: BreadcrumbState = { type: "error", err: "param is not set: do `set-param` first" }

class WorkerComponent implements BreadcrumbComponent {
    initializer: WorkerInitializer

    listener: Post<BreadcrumbState>[] = []

    constructor(initializer: WorkerInitializer) {
        this.initializer = initializer
    }

    onStateChange(stateChanged: Post<BreadcrumbState>): void {
        this.listener.push(stateChanged)
    }

    init(): BreadcrumbComponentResource {
        const worker = this.initWorker()
        return {
            request: operation => worker.postMessage(operation),
            terminate: () => worker.terminate(),
        }
    }
    initWorker(): Worker {
        const worker = this.initializer()

        worker.addEventListener("message", (event) => {
            const state = event.data as BreadcrumbState
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
