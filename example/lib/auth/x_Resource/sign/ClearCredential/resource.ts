import { LogoutComponent } from "./Logout/component"

import { ClearAuthCredentialAction } from "../../../sign/authCredential/clear/action"

export type ClearCredentialResource = Readonly<{
    logout: LogoutComponent
}>

export type ClearCredentialForegroundAction = Readonly<{
    clear: ClearAuthCredentialAction
}>
