import { LoginAction } from "../../../password_login/action"
import { StoreAction } from "../../../credential/action"
import { SecureScriptPathAction } from "../../../application/action"

import { LoginError } from "../../../password_login/data"
import { StorageError } from "../../../credential/data"
import { PagePathname, ScriptPath, LoadError } from "../../../application/data"

export interface PasswordLoginComponentFactory {
    (actions: PasswordLoginActionSet, param: PasswordLoginParam): PasswordLoginComponent
}
export type PasswordLoginActionSet = Readonly<{
    login: LoginAction
    store: StoreAction
    secureScriptPath: SecureScriptPathAction
}>

export type PasswordLoginParam = Readonly<{
    pagePathname: PagePathname
}>

export interface PasswordLoginComponent {
    onStateChange(post: Post<PasswordLoginState>): void
    action(request: PasswordLoginRequest): void
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

export type PasswordLoginRequest =
    | Readonly<{ type: "login" }>
    | Readonly<{ type: "load-error"; err: LoadError }>

interface Post<T> {
    (state: T): void
}
