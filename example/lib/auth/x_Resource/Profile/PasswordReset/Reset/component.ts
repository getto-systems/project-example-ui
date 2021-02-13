import { ApplicationComponent } from "../../../../../common/getto-example/Application/component"

import { Reset } from "../../../../sign/passwordReset/action"
import { SetContinuousRenew } from "../../../../sign/authCredential/renew/action"
import { SecureScriptPath } from "../../../../sign/location/action"

import { ResetError, ResetFields } from "../../../../sign/passwordReset/data"
import { ScriptPath, LoadError } from "../../../../sign/location/data"
import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { StorageError } from "../../../../../common/auth/storage/data"

export interface ResetComponentFactory {
    (material: ResetMaterial): ResetComponent
}

export type ResetMaterial = Readonly<{
    reset: Reset
    setContinuousRenew: SetContinuousRenew
    secureScriptPath: SecureScriptPath
}>

export interface ResetComponent extends ApplicationComponent<ResetComponentState> {
    submit(fields: FormConvertResult<ResetFields>): void
    loadError(err: LoadError): void
}

export type ResetComponentState =
    | Readonly<{ type: "initial-reset" }>
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: ResetError }>
    | Readonly<{ type: "try-to-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialResetComponentState: ResetComponentState = { type: "initial-reset" }
