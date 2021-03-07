import { NextVersionComponent } from "../../x_Resource/MoveToNextVersion/nextVersion/component"

export type MoveToNextVersionEntryPoint = Readonly<{
    resource: NextVersionResource
    terminate: Terminate
}>

export type NextVersionResource = Readonly<{
    nextVersion: NextVersionComponent
}>

interface Terminate {
    (): void
}
