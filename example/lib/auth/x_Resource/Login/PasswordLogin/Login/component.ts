import { ApplicationComponent } from "../../../../../sub/getto-example/x_components/Application/component"

import { Login } from "../../../../login/passwordLogin/action"
import { SetContinuousRenew } from "../../../../login/credentialStore/action"
import { SecureScriptPath } from "../../../../common/application/action"

import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { ScriptPath, LoadError } from "../../../../common/application/data"
import { StorageError } from "../../../../common/credential/data"
import { LoginError, LoginFields } from "../../../../login/passwordLogin/data"

export interface PasswordLoginComponentFactory {
    (material: PasswordLoginMaterial): PasswordLoginComponent
}
export type PasswordLoginMaterial = Readonly<{
    login: Login
    setContinuousRenew: SetContinuousRenew
    secureScriptPath: SecureScriptPath
}>

export interface PasswordLoginComponent extends ApplicationComponent<PasswordLoginComponentState> {
    submit(fields: FormConvertResult<LoginFields>): void
    loadError(err: LoadError): void
}

export type PasswordLoginComponentState =
    | Readonly<{ type: "initial-login" }>
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "try-to-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "failed-to-login"; err: LoginError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordLoginComponentState: PasswordLoginComponentState = { type: "initial-login" }
