import { ApplicationComponent } from "../../../../../vendor/getto-example/Application/component"

import { PasswordLoginAction } from "../../../../sign/password/login/action"
import { AuthLocationAction } from "../../../../sign/authLocation/action"
import { ContinuousRenewAuthCredentialAction } from "../../../../sign/authCredential/continuousRenew/action"

import { FormConvertResult } from "../../../../../vendor/getto-form/form/data"
import { SecureScriptPath, LoadSecureScriptError } from "../../../../sign/authLocation/data"
import { SubmitPasswordLoginError, PasswordLoginFields } from "../../../../sign/password/login/data"
import { StorageError } from "../../../../../common/storage/data"

export interface LoginComponentFactory {
    (material: LoginMaterial): LoginComponent
}
export type LoginMaterial = Readonly<{
    continuousRenew: ContinuousRenewAuthCredentialAction
    login: PasswordLoginAction
    location: AuthLocationAction
}>

export interface LoginComponent extends ApplicationComponent<LoginComponentState> {
    submit(fields: FormConvertResult<PasswordLoginFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type LoginComponentState =
    | Readonly<{ type: "initial-login" }>
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "failed-to-login"; err: SubmitPasswordLoginError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>
    | Readonly<{ type: "error"; err: string }>

export const initialLoginComponentState: LoginComponentState = { type: "initial-login" }
