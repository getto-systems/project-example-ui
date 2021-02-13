import { RenewComponent } from "./Renew/component"

import { ApplicationAction, SecureScriptPathLocationInfo } from "../../../sign/location/action"
import { RenewAction, SetContinuousRenewAction } from "../../../sign/authCredential/renew/action"

export type RenewCredentialResource = Readonly<{
    renew: RenewComponent
}>

export type RenewCredentialLocationInfo = Readonly<{
    application: SecureScriptPathLocationInfo
}>
export type RenewCredentialForegroundAction = Readonly<{
    application: ApplicationAction
    renew: RenewAction
    setContinuousRenew: SetContinuousRenewAction
}>
