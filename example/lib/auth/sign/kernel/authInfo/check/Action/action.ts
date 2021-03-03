import { CoreAction, CoreState, initialCoreState } from "./Core/action"

export type CheckAuthInfoEntryPoint = Readonly<{
    resource: CheckAuthInfoResource
    terminate: { (): void }
}>
export type CheckAuthInfoResource = Readonly<{
    core: CoreAction
}>

export type CheckAuthInfoResourceState = CoreState

export const initialCheckAuthInfoResourceState: CheckAuthInfoResourceState = initialCoreState
