import { LogoutComponent } from "./Logout/component"

import { ClearAction } from "../../../sign/authCredential/clear/action"

export type ClearCredentialResource = Readonly<{
    logout: LogoutComponent
}>

export type ClearCredentialForegroundAction = Readonly<{
    clear: ClearAction
}>
