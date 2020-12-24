import { NextVersionComponent } from "../next_version/component"

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
