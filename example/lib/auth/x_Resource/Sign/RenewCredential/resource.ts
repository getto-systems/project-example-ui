import { RenewComponent } from "./Renew/component"

import { ApplicationAction, SecureScriptPathLocationInfo } from "../../../common/application/action"
import { RenewAction, SetContinuousRenewAction } from "../../../sign/credentialStore/action"

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
