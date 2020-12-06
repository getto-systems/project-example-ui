import { LoginAction } from "../../login/password_login/action"
import { StoreAuthCredentialAction } from "../../common/credential/action"
import { SecureScriptPathAction } from "../../common/application/action"

import { LoginError } from "../../login/password_login/data"
import { ScriptPath, LoadError } from "../../common/application/data"
import { LoginLink } from "../link"
import { StorageError } from "../../common/credential/data"

export interface PasswordLoginComponentFactory {
    (material: PasswordLoginMaterial): PasswordLoginComponent
}
export type PasswordLoginMaterial = Readonly<{
    link: LoginLink
    login: LoginAction
    storeAuthCredential: StoreAuthCredentialAction
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
