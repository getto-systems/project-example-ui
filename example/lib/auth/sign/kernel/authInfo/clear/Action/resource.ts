import { LogoutCoreAction, LogoutCoreState } from "./Core/action"

export type LogoutResource = Readonly<{
    logout: LogoutCoreAction
}>

export type LogoutResourceState = Readonly<{ state: LogoutCoreState }>
