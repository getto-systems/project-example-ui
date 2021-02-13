import { ApplicationComponent } from "../../../../../common/getto-example/Application/component"

import { Login } from "../../../../sign/passwordLogin/action"
import { LocationAction } from "../../../../sign/location/action"
import { ContinuousRenewAction } from "../../../../sign/authCredential/continuousRenew/action"

import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { ScriptPath, LoadError } from "../../../../sign/location/data"
import { LoginError, LoginFields } from "../../../../sign/passwordLogin/data"
import { StorageError } from "../../../../../common/auth/storage/data"

export interface LoginComponentFactory {
    (material: LoginMaterial): LoginComponent
}
export type LoginMaterial = Readonly<{
    continuousRenew: ContinuousRenewAction
    location: LocationAction

    login: Login
}>

export interface LoginComponent extends ApplicationComponent<LoginComponentState> {
    submit(fields: FormConvertResult<LoginFields>): void
    loadError(err: LoadError): void
}

export type LoginComponentState =
    | Readonly<{ type: "initial-login" }>
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "try-to-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "failed-to-login"; err: LoginError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialLoginComponentState: LoginComponentState = { type: "initial-login" }
