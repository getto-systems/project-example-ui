import { FetchResponse } from "../../../credential/data"

export type ExampleParam = { ExampleParam: never }

export interface ExampleParamPacker {
    (param: Param): ExampleParam
}
type Param = Readonly<{
    fetchResponse: FetchResponse
}>

export interface ExampleComponent {
    onStateChange(stateChanged: Post<ExampleState>): void
    init(): ExampleComponentResource
}
export type ExampleComponentResource = ComponentResource<ExampleOperation>

export type ExampleState =
    Readonly<{ type: "initial-example" }> |
    Readonly<{ type: "error", err: string }>

export const initialExampleState: ExampleState = { type: "initial-example" }

export type ExampleOperation =
    Readonly<{ type: "set-param", param: ExampleParam }>

export const initialExampleRequest: Post<ExampleOperation> = (): void => {
    throw new Error("Component is not initialized. use: `init()`")
}

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

type ComponentResource<T> = Readonly<{
    request: Post<T>
    terminate: Terminate
}>
