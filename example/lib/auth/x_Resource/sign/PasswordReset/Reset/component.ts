import { ApplicationComponent } from "../../../../../vendor/getto-example/Application/component"

import { PasswordResetRegisterAction } from "../../../../sign/password/reset/register/action"
import { AuthLocationAction } from "../../../../sign/authLocation/action"

import { SubmitPasswordResetRegisterError, PasswordResetFields } from "../../../../sign/password/reset/register/data"
import { SecureScriptPath, LoadSecureScriptError } from "../../../../sign/authLocation/data"
import { FormConvertResult } from "../../../../../vendor/getto-form/form/data"
import { StorageError } from "../../../../../common/storage/data"
import { ContinuousRenewAuthCredentialAction } from "../../../../sign/authCredential/continuousRenew/action"

export interface ResetComponentFactory {
    (material: ResetMaterial): ResetComponent
}

export type ResetMaterial = Readonly<{
    continuousRenew: ContinuousRenewAuthCredentialAction
    location: AuthLocationAction
    register: PasswordResetRegisterAction
}>

export interface ResetComponent extends ApplicationComponent<ResetComponentState> {
    submit(fields: FormConvertResult<PasswordResetFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type ResetComponentState =
    | Readonly<{ type: "initial-reset" }>
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: SubmitPasswordResetRegisterError }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>
    | Readonly<{ type: "error"; err: string }>

export const initialResetComponentState: ResetComponentState = { type: "initial-reset" }
