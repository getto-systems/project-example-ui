import { CurrentVersionComponent } from "../../x_Resource/GetCurrentVersion/currentVersion/component"

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
