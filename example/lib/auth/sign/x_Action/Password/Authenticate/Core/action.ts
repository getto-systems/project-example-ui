import { ApplicationAction } from "../../../../../../common/vendor/getto-example/Application/action"

import { AuthenticatePasswordMethod } from "../../../../password/authenticate/action"
import { GetSecureScriptPathMethod } from "../../../../secureScriptPath/get/action"
import { StartContinuousRenewAuthnInfoMethod } from "../../../../authnInfo/startContinuousRenew/action"

import { AuthenticatePasswordEvent } from "../../../../password/authenticate/event"
import { StartContinuousRenewAuthnInfoEvent } from "../../../../authnInfo/startContinuousRenew/event"

import { FormConvertResult } from "../../../../../../common/vendor/getto-form/form/data"
import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../../secureScriptPath/get/data"
import { AuthenticatePasswordFields } from "../../../../password/authenticate/data"

export interface AuthenticatePasswordAction
    extends ApplicationAction<AuthenticatePasswordActionState> {
    submit(fields: FormConvertResult<AuthenticatePasswordFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type AuthenticatePasswordMaterial = AuthenticatePasswordForegroundMaterial &
    AuthenticatePasswordBackgroundMaterial

export type AuthenticatePasswordForegroundMaterial = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>
export type AuthenticatePasswordBackgroundMaterial = Readonly<{
    authenticate: AuthenticatePasswordMethod
}>

export type AuthenticatePasswordActionState =
    | Readonly<{ type: "initial-login" }>
    | Exclude<AuthenticatePasswordEvent, { type: "succeed-to-login" }>
    | Exclude<
          StartContinuousRenewAuthnInfoEvent,
          { type: "succeed-to-start-continuous-renew" }
      >
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialAuthenticatePasswordActionState: AuthenticatePasswordActionState = {
    type: "initial-login",
}
