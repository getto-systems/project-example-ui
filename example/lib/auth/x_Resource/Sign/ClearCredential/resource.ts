import { LogoutComponent } from "./Logout/component"

import { ClearActionPod } from "../../../sign/authCredential/clear/action"

export type ClearCredentialResource = Readonly<{
    logout: LogoutComponent
}>

export type ClearCredentialForegroundActionPod = Readonly<{
    initClear: ClearActionPod
}>
