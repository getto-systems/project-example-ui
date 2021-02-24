import { CoreAction, CoreState, initialCoreState } from "./Core/action"

export type RenewAuthnInfoEntryPoint = Readonly<{
    resource: RenewAuthnInfoResource
    terminate: { (): void }
}>
export type RenewAuthnInfoResource = Readonly<{
    core: CoreAction
}>

export type RenewAuthnInfoResourceState = CoreState

export const initialRenewAuthnInfoResourceState: RenewAuthnInfoResourceState = initialCoreState
