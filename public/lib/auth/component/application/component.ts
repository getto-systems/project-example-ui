import { PagePathname, ScriptPath } from "../../../application/data"

export type ApplicationParam = { ApplicationParam: never }

export interface ApplicationParamPacker {
    (param: Param): ApplicationParam
}
type Param = Readonly<{
    pagePathname: PagePathname
}>

export interface ApplicationComponent {
    onStateChange(stateChanged: Post<ApplicationState>): void
    init(): ApplicationComponentResource
}
export type ApplicationComponentResource = ComponentResource<ApplicationOperation>

export type ApplicationState =
    Readonly<{ type: "initial-load" }> |
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: LoadError }> |
    Readonly<{ type: "error", err: string }>

export const initialApplicationState: ApplicationState = { type: "initial-load" }

export type ApplicationOperation =
    Readonly<{ type: "set-param", param: ApplicationParam }> |
    Readonly<{ type: "load" }> |
    Readonly<{ type: "failed-to-load", err: LoadError }>

export const initialApplicationRequest: Post<ApplicationOperation> = (): void => {
    throw new Error("Component is not initialized. use: `init()`")
}

export type LoadError =
    Readonly<{ type: "infra-error", err: string }>

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
