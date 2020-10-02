import { PagePathname } from "../../location/data"
import { NavigationList, Expansion, LoadError } from "../../navigation/data"

export type NavigationParam = { NavigationParam: never }

export interface NavigationParamPacker {
    (param: Param): NavigationParam
}
type Param = Readonly<{
    pagePathname: PagePathname
    expansion: Expansion
}>

export interface NavigationComponent {
    onStateChange(stateChanged: Post<NavigationState>): void
    init(): NavigationComponentResource
}
export type NavigationComponentResource = ComponentResource<NavigationOperation>

export type NavigationState =
    Readonly<{ type: "initial-navigation" }> |
    Readonly<{ type: "succeed-to-load", navigation: NavigationList }> |
    Readonly<{ type: "failed-to-load", navigation: NavigationList, err: LoadError }> |
    Readonly<{ type: "error", err: string }>

export const initialNavigationState: NavigationState = { type: "initial-navigation" }

export type NavigationOperation =
    Readonly<{ type: "set-param", param: NavigationParam }> |
    Readonly<{ type: "load" }>

export const initialNavigationRequest: Post<NavigationOperation> = (): void => {
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
