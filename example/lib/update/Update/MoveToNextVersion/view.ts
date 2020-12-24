import { NextVersionComponent } from "../next_version/component"

export interface MoveToNextVersionEntryPointFactory {
    (): MoveToNextVersionEntryPoint
}
export type MoveToNextVersionEntryPoint = Readonly<{
    components: NextVersionResource
    terminate: Terminate
}>

export type NextVersionResource = Readonly<{
    nextVersion: NextVersionComponent
}>

interface Terminate {
    (): void
}
