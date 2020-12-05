import { NextVersionComponent } from "../next_version/component"

export interface MoveToNextVersionFactory {
    (): MoveToNextVersionEntryPoint
}
export type MoveToNextVersionEntryPoint = Readonly<{
    components: MoveToNextVersionResource
    terminate: Terminate
}>

export type MoveToNextVersionResource = Readonly<{
    nextVersion: NextVersionComponent
}>

interface Terminate {
    (): void
}
