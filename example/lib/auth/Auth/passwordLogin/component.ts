import { Login } from "../../login/passwordLogin/action"
import { SetContinuousRenew } from "../../login/renew/action"
import { SecureScriptPath } from "../../common/application/action"

import { LoginError } from "../../login/passwordLogin/data"
import { ScriptPath, LoadError } from "../../common/application/data"
import { LoginLink } from "../link"
import { StorageError } from "../../common/credential/data"

export interface PasswordLoginComponentFactory {
    (material: PasswordLoginMaterial): PasswordLoginComponent
}
export type PasswordLoginMaterial = Readonly<{
    link: LoginLink
    login: Login
    setContinuousRenew: SetContinuousRenew
    secureScriptPath: SecureScriptPath
}>

export interface PasswordLoginComponent {
    readonly link: LoginLink
    onStateChange(post: Post<PasswordLoginState>): void
    login(): void
    loadError(err: LoadError): void
}

export type PasswordLoginState =
    | Readonly<{ type: "initial-login" }>
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "try-to-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "failed-to-login"; err: LoginError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordLoginState: PasswordLoginState = { type: "initial-login" }

interface Post<T> {
    (state: T): void
}
