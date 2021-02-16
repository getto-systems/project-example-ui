import { ApplicationComponent } from "../../../../../../../vendor/getto-example/Application/component"

import { RegisterPasswordResetSessionAction } from "../../../../../password/resetSession/register/action"
import { GetSecureScriptPathAction } from "../../../../../secureScriptPath/get/action"

import {
    SubmitPasswordResetRegisterError,
    PasswordResetFields,
} from "../../../../../password/resetSession/register/data"
import { SecureScriptPath, LoadSecureScriptError } from "../../../../../secureScriptPath/get/data"
import { FormConvertResult } from "../../../../../../../vendor/getto-form/form/data"
import { StorageError } from "../../../../../../../common/storage/data"
import { StartContinuousRenewAuthCredentialAction } from "../../../../../authCredential/startContinuousRenew/action"

export interface PasswordResetRegisterComponent
    extends ApplicationComponent<PasswordResetRegisterComponentState> {
    submit(fields: FormConvertResult<PasswordResetFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type PasswordResetRegisterMaterial = Readonly<{
    continuousRenew: StartContinuousRenewAuthCredentialAction
    location: GetSecureScriptPathAction
    register: RegisterPasswordResetSessionAction
}>

export type PasswordResetRegisterComponentState =
    | Readonly<{ type: "initial-reset" }>
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: SubmitPasswordResetRegisterError }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordResetRegisterComponentState: PasswordResetRegisterComponentState = {
    type: "initial-reset",
}
