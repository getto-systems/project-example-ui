import { LoginAction } from "../../login/password_login/action"
import { StoreAction } from "../../login/renew/action"
import { SecureScriptPathAction } from "../../common/application/action"

import { LoginError } from "../../login/password_login/data"
import { StorageError } from "../../login/renew/data"
import { ScriptPath, LoadError } from "../../common/application/data"
import { LoginLink } from "../link"

export interface PasswordLoginComponentFactory {
    (material: PasswordLoginMaterial): PasswordLoginComponent
}
export type PasswordLoginMaterial = Readonly<{
    link: LoginLink
    login: LoginAction
    store: StoreAction
    secureScriptPath: SecureScriptPathAction
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
    | Readonly<{ type: "failed-to-login"; err: LoginError }>
    | Readonly<{ type: "succeed-to-login"; scriptPath: ScriptPath }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordLoginState: PasswordLoginState = { type: "initial-login" }

interface Post<T> {
    (state: T): void
}
