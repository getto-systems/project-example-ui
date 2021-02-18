import { ApplicationAction } from "../../../../../../../common/vendor/getto-example/Application/action"

import { AuthenticatePasswordMethod } from "../../../method"
import { GetSecureScriptPathMethod } from "../../../../../common/secureScriptPath/get/method"
import { StartContinuousRenewAuthnInfoMethod } from "../../../../../kernel/authnInfo/common/startContinuousRenew/method"

import { AuthenticatePasswordEvent } from "../../../event"
import { StartContinuousRenewAuthnInfoEvent } from "../../../../../kernel/authnInfo/common/startContinuousRenew/event"

import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../../../common/secureScriptPath/get/data"
import { AuthenticatePasswordFields } from "../../../data"

export interface AuthenticatePasswordCoreAction
    extends ApplicationAction<AuthenticatePasswordCoreState> {
    submit(fields: FormConvertResult<AuthenticatePasswordFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type AuthenticatePasswordCoreMaterial = AuthenticatePasswordCoreForeground &
    AuthenticatePasswordCoreBackground

export type AuthenticatePasswordCoreForeground = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>
export type AuthenticatePasswordCoreBackground = Readonly<{
    authenticate: AuthenticatePasswordMethod
}>

export type AuthenticatePasswordCoreState =
    | Readonly<{ type: "initial-login" }>
    | Exclude<AuthenticatePasswordEvent, { type: "succeed-to-login" }>
    | Exclude<StartContinuousRenewAuthnInfoEvent, { type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialAuthenticatePasswordCoreState: AuthenticatePasswordCoreState = {
    type: "initial-login",
}
