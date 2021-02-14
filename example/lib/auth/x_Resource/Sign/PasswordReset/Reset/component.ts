import { ApplicationComponent } from "../../../../../common/getto-example/Application/component"

import { RegisterAction } from "../../../../sign/password/reset/register/action"
import { LocationAction } from "../../../../sign/location/action"

import { SubmitError, ResetFields } from "../../../../sign/password/reset/register/data"
import { ScriptPath, LoadError } from "../../../../sign/location/data"
import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { StorageError } from "../../../../../common/auth/storage/data"
import { ContinuousRenewAction } from "../../../../sign/authCredential/continuousRenew/action"

export interface ResetComponentFactory {
    (material: ResetMaterial): ResetComponent
}

export type ResetMaterial = Readonly<{
    continuousRenew: ContinuousRenewAction
    location: LocationAction
    register: RegisterAction
}>

export interface ResetComponent extends ApplicationComponent<ResetComponentState> {
    submit(fields: FormConvertResult<ResetFields>): void
    loadError(err: LoadError): void
}

export type ResetComponentState =
    | Readonly<{ type: "initial-reset" }>
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: SubmitError }>
    | Readonly<{ type: "try-to-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialResetComponentState: ResetComponentState = { type: "initial-reset" }
