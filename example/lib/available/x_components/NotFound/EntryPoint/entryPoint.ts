import { CurrentVersionComponent } from "../currentVersion/component"

export type NotFoundEntryPoint = Readonly<{
    resource: NotFoundResource
    terminate: Terminate
}>

export type NotFoundResource = Readonly<{
    currentVersion: CurrentVersionComponent
}>

interface Terminate {
    (): void
}
