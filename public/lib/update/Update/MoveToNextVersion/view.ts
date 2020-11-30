import { NextVersionComponent } from "../next_version/component"

export interface MoveToNextVersionFactory {
    (): MoveToNextVersionResource
}
export type MoveToNextVersionResource = Readonly<{
    components: MoveToNextVersionComponentSet
    terminate: Terminate
}>

export type MoveToNextVersionComponentSet = Readonly<{
    nextVersion: NextVersionComponent
}>

interface Terminate {
    (): void
}
