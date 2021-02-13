import { LogoutComponent } from "./Logout/component"

import { LogoutAction } from "../../../sign/credentialStore/action"

export type ClearCredentialResource = Readonly<{
    logout: LogoutComponent
}>

export type ClearCredentialForegroundAction = Readonly<{
    logout: LogoutAction
}>
