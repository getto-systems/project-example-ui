import { RenewCredentialComponent } from "./Renew/component"

import { ApplicationAction, SecureScriptPathLocationInfo } from "../../../common/application/action"
import { RenewAction, SetContinuousRenewAction } from "../../../login/credentialStore/action"

export type RenewCredentialResource = Readonly<{
    renew: RenewCredentialComponent
}>

export type RenewCredentialLocationInfo = Readonly<{
    application: SecureScriptPathLocationInfo
}>
export type RenewCredentialForegroundAction = Readonly<{
    application: ApplicationAction
    renew: RenewAction
    setContinuousRenew: SetContinuousRenewAction
}>
