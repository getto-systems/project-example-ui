import { LoginLink } from "../link"

import { Reset } from "../../profile/password_reset/action"
import { SetContinuousRenew } from "../../login/renew/action"
import { SecureScriptPath } from "../../common/application/action"

import { ResetError } from "../../profile/password_reset/data"
import { ScriptPath, LoadError } from "../../common/application/data"
import { StorageError } from "../../common/credential/data"

export interface PasswordResetComponentFactory {
    (material: PasswordResetMaterial): PasswordResetComponent
}

export type PasswordResetMaterial = Readonly<{
    link: LoginLink
    reset: Reset
    setContinuousRenew: SetContinuousRenew
    secureScriptPath: SecureScriptPath
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
    | Readonly<{ type: "try-to-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordResetState: PasswordResetState = { type: "initial-reset" }

interface Post<T> {
    (state: T): void
}
