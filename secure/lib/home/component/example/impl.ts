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

type ParamHolder =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Param }>

interface Post<T> {
    (state: T): void
}
