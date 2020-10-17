import { LoginIDFieldComponent } from "../field/login_id/component"
import { PasswordFieldComponent } from "../field/password/component"

import { LoginAction } from "../../../password_login/action"
import { LoginIDFieldAction } from "../../../login_id/field/action"
import { PasswordFieldAction } from "../../../password/field/action"
import { StoreResource } from "../../../credential/action"
import { PathAction } from "../../../application/action"

import { LoginError } from "../../../password_login/data"
import { StorageError } from "../../../credential/data"
import { PagePathname, ScriptPath, LoadError } from "../../../application/data"

export interface PasswordLoginInit {
    (actions: PasswordLoginActionSet, components: PasswordLoginFieldComponentSet, param: PasswordLoginParam): PasswordLoginComponent
}
export type PasswordLoginActionSet = Readonly<{
    login: LoginAction
    field: {
        loginID: LoginIDFieldAction
        password: PasswordFieldAction
    }
    store: StoreResource
    path: PathAction
}>

export type PasswordLoginParam = Readonly<{
    pagePathname: PagePathname
}>

export interface PasswordLoginComponent {
    onStateChange(post: Post<PasswordLoginState>): void
    action(request: PasswordLoginRequest): void
    readonly components: PasswordLoginFieldComponentSet
}
export type PasswordLoginFieldComponentSet = Readonly<{
    loginIDField: LoginIDFieldComponent
    passwordField: PasswordFieldComponent
}>

export type PasswordLoginState =
    Readonly<{ type: "initial-login" }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", err: LoginError }> |
    Readonly<{ type: "succeed-to-login", scriptPath: ScriptPath }> |
    Readonly<{ type: "storage-error", err: StorageError }> |
    Readonly<{ type: "load-error", err: LoadError }> |
    Readonly<{ type: "error", err: string }>

export const initialPasswordLoginState: PasswordLoginState = { type: "initial-login" }

export type PasswordLoginRequest =
    Readonly<{ type: "login" }> |
    Readonly<{ type: "load-error", err: LoadError }>

interface Post<T> {
    (state: T): void
}
