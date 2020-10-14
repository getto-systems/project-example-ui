import { LoginIDFieldComponent } from "../field/login_id/component"
import { PasswordFieldComponent } from "../field/password/component"

import { ResetResource } from "../../../password_reset/action"
import { LoginIDFieldAction } from "../../../login_id/field/action"
import { PasswordFieldAction } from "../../../password/field/action"
import { StoreResource } from "../../../credential/action"
import { PathAction } from "../../../application/action"

import { ResetToken, ResetError } from "../../../password_reset/data"
import { StoreError } from "../../../credential/data"
import { PagePathname, ScriptPath } from "../../../application/data"

export interface PasswordResetInit {
    (actions: PasswordResetActionSet, components: PasswordResetFieldComponentSet, param: PasswordResetParam): PasswordResetComponent
}

export type PasswordResetActionSet = Readonly<{
    reset: ResetResource
    field: {
        loginID: LoginIDFieldAction
        password: PasswordFieldAction
    }
    store: StoreResource
    path: PathAction
}>

export type PasswordResetParam = Readonly<{
    pagePathname: PagePathname
    resetToken: ResetToken
}>

export interface PasswordResetComponent {
    onStateChange(post: Post<PasswordResetState>): void
    action(request: PasswordResetRequest): void
    readonly components: PasswordResetFieldComponentSet
}
export type PasswordResetFieldComponentSet = Readonly<{
    loginID: Readonly<{ loginIDField: LoginIDFieldComponent }>
    password: Readonly<{ passwordField: PasswordFieldComponent }>
}>

export type PasswordResetState =
    Readonly<{ type: "initial-reset" }> |
    Readonly<{ type: "try-to-reset" }> |
    Readonly<{ type: "delayed-to-reset" }> |
    Readonly<{ type: "failed-to-reset", err: ResetError }> |
    Readonly<{ type: "succeed-to-reset", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "failed-to-load", err: LoadError }> |
    Readonly<{ type: "error", err: string }>

export const initialPasswordResetState: PasswordResetState = { type: "initial-reset" }

export type PasswordResetRequest =
    Readonly<{ type: "reset" }> |
    Readonly<{ type: "failed-to-load", err: LoadError }>

export type LoadError =
    Readonly<{ type: "infra-error", err: string }>

interface Post<T> {
    (state: T): void
}
