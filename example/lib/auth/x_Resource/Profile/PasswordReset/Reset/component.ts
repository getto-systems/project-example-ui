import { ApplicationComponent } from "../../../../../sub/getto-example/x_components/Application/component"

import { Reset } from "../../../../profile/passwordReset/action"
import { SetContinuousRenew } from "../../../../login/credentialStore/action"
import { SecureScriptPath } from "../../../../common/application/action"

import { ResetError, ResetFields } from "../../../../profile/passwordReset/data"
import { ScriptPath, LoadError } from "../../../../common/application/data"
import { StorageError } from "../../../../common/credential/data"
import { FormConvertResult } from "../../../../../sub/getto-form/form/data"

export interface PasswordResetComponentFactory {
    (material: PasswordResetMaterial): PasswordResetComponent
}

export type PasswordResetMaterial = Readonly<{
    reset: Reset
    setContinuousRenew: SetContinuousRenew
    secureScriptPath: SecureScriptPath
}>

export interface PasswordResetComponent extends ApplicationComponent<PasswordResetComponentState> {
    reset(fields: FormConvertResult<ResetFields>): void
    loadError(err: LoadError): void
}

export type PasswordResetComponentState =
    | Readonly<{ type: "initial-reset" }>
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: ResetError }>
    | Readonly<{ type: "try-to-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordResetComponentState: PasswordResetComponentState = { type: "initial-reset" }
