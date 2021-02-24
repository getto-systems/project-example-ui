import { CoreAction, CoreState, initialCoreState } from "./Core/action"

export type LogoutResource = Readonly<{
    logout: CoreAction
}>

export type LogoutState = CoreState

export const initialLogoutState: LogoutState = initialCoreState
