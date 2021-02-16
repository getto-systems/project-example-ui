import { ApplicationComponent } from "../../../../../../vendor/getto-example/Application/component"

import { PasswordLoginAction, PasswordLoginActionPod } from "../../../../password/login/action"
import { AuthLocationAction } from "../../../../authLocation/action"
import { ContinuousRenewAuthCredentialAction } from "../../../../authCredential/continuousRenew/action"

import { FormConvertResult } from "../../../../../../vendor/getto-form/form/data"
import { SecureScriptPath, LoadSecureScriptError } from "../../../../authLocation/data"
import { SubmitPasswordLoginError, PasswordLoginFields } from "../../../../password/login/data"
import { StorageError } from "../../../../../../common/storage/data"

export interface PasswordLoginComponent extends ApplicationComponent<PasswordLoginComponentState> {
    submit(fields: FormConvertResult<PasswordLoginFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type PasswordLoginMaterial = PasswordLoginForegroundMaterial & PasswordLoginBackgroundMaterial

export type PasswordLoginForegroundMaterial = Readonly<{
    continuousRenew: ContinuousRenewAuthCredentialAction
    location: AuthLocationAction
}>

export type PasswordLoginBackgroundMaterial = Readonly<{
    login: PasswordLoginAction
}>
export type PasswordLoginBackgroundMaterialPod = Readonly<{
    initLogin: PasswordLoginActionPod
}>

export type PasswordLoginComponentState =
    | Readonly<{ type: "initial-login" }>
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "failed-to-login"; err: SubmitPasswordLoginError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordLoginComponentState: PasswordLoginComponentState = { type: "initial-login" }
