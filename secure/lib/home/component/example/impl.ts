import {
    ExampleComponent,
    ExampleComponentResource,
    ExampleParam,
    ExampleState,
    ExampleOperation,
} from "./component"

import { ApiCredential } from "../../../credential/data"

type Action = Readonly<{
}>

export function initExampleComponent(action: Action): ExampleComponent {
    return new Component(action)
}
export function initExampleWorkerComponent(initializer: WorkerInitializer): ExampleComponent {
    return new WorkerComponent(initializer)
}

export function packExampleParam(param: Param): ExampleParam {
    return param as ExampleParam & Param
}

function unpackParam(param: ExampleParam): Param {
    return param as unknown as Param
}

type Param = Readonly<{
    apiCredential: ApiCredential
}>

class Component implements ExampleComponent {
    action: Action

    listener: Post<ExampleState>[] = []
    holder: ParamHolder = { set: false }

    constructor(action: Action) {
        this.action = action
    }
    post(state: ExampleState): void {
        this.listener.forEach(post => post(state))
    }

    onStateChange(stateChanged: Post<ExampleState>): void {
        this.listener.push(stateChanged)
    }

    init(): ExampleComponentResource {
        return {
            request: operation => this.request(operation),
            terminate: () => { /* WorkerComponent とインターフェイスを合わせるために必要 */ },
        }
    }
    request(operation: ExampleOperation): void {
        switch (operation.type) {
            case "set-param":
                this.holder = { set: true, param: unpackParam(operation.param) }
                return
        }
    }
}

class WorkerComponent implements ExampleComponent {
    initializer: WorkerInitializer

    listener: Post<ExampleState>[] = []

    constructor(initializer: WorkerInitializer) {
        this.initializer = initializer
    }

    onStateChange(stateChanged: Post<ExampleState>): void {
        this.listener.push(stateChanged)
    }

    init(): ExampleComponentResource {
        const worker = this.initWorker()
        return {
            request: operation => worker.postMessage(operation),
            terminate: () => worker.terminate(),
        }
    }
    initWorker(): Worker {
        const worker = this.initializer()

        worker.addEventListener("message", (event) => {
            const state = event.data as ExampleState
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
