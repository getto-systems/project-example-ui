import { LoginLink } from "../link"

import { ResetAction } from "../../profile/password_reset/action"
import { StoreAction } from "../../login/renew/action"
import { SecureScriptPathAction } from "../../common/application/action"

import { ResetError } from "../../profile/password_reset/data"
import { StorageError } from "../../login/renew/data"
import { ScriptPath, LoadError } from "../../common/application/data"

export interface PasswordResetComponentFactory {
    (material: PasswordResetMaterial): PasswordResetComponent
}

export type PasswordResetMaterial = Readonly<{
    link: LoginLink
    reset: ResetAction
    store: StoreAction
    secureScriptPath: SecureScriptPathAction
}>

export interface PasswordResetComponent {
    readonly link: LoginLink
    onStateChange(post: Post<PasswordResetState>): void
    reset(): void
    loadError(err: LoadError): void
}

export type PasswordResetState =
    | Readonly<{ type: "initial-reset" }>
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: ResetError }>
    | Readonly<{ type: "succeed-to-reset"; scriptPath: ScriptPath }>
    | Readonly<{ type: "failed-to-store"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordResetState: PasswordResetState = { type: "initial-reset" }

interface Post<T> {
    (state: T): void
}
