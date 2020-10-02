import { PagePathname } from "../../location/data"
import { BreadcrumbList } from "../../navigation/data"

export type BreadcrumbParam = { BreadcrumbParam: never }

export interface BreadcrumbParamPacker {
    (param: Param): BreadcrumbParam
}
type Param = Readonly<{
    pagePathname: PagePathname
}>

export interface BreadcrumbComponent {
    onStateChange(stateChanged: Post<BreadcrumbState>): void
    init(): BreadcrumbComponentResource
}
export type BreadcrumbComponentResource = ComponentResource<BreadcrumbOperation>

export type BreadcrumbState =
    Readonly<{ type: "initial-breadcrumb" }> |
    Readonly<{ type: "succeed-to-load", breadcrumbs: BreadcrumbList }> |
    Readonly<{ type: "error", err: string }>

export const initialBreadcrumbState: BreadcrumbState = { type: "initial-breadcrumb" }

export type BreadcrumbOperation =
    Readonly<{ type: "set-param", param: BreadcrumbParam }> |
    Readonly<{ type: "load" }>

export const initialBreadcrumbRequest: Post<BreadcrumbOperation> = (): void => {
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
