import { LoginLink } from "../link"

import { ResetAction } from "../../password_reset/action"
import { StoreAction } from "../../credential/action"
import { SecureScriptPathAction } from "../../application/action"

import { ResetError } from "../../password_reset/data"
import { StorageError } from "../../credential/data"
import { ScriptPath, LoadError } from "../../application/data"

export interface PasswordResetComponentFactory {
    (actions: PasswordResetActionSet): PasswordResetComponent
}

export type PasswordResetActionSet = Readonly<{
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
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordResetState: PasswordResetState = { type: "initial-reset" }

interface Post<T> {
    (state: T): void
}
