import { BackgroundCredentialOperation } from "../../../background/credential/component"

import { LoginIDFieldState } from "../field/login_id/component"
import { PasswordFieldState } from "../field/password/component"

import { AuthCredential } from "../../../credential/data"
import { ResetToken, ResetError } from "../../../password_reset/data"
import { LoginIDFieldOperation } from "../../../login_id/field/data"
import { PasswordFieldOperation } from "../../../password/field/data"

export interface PasswordResetComponent {
    onStateChange(stateChanged: Post<PasswordResetState>): void
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void
    init(): PasswordResetComponentResource
}
export type PasswordResetComponentResource = ComponentResource<PasswordResetOperation>

export type PasswordResetParam = { PasswordResetParam: never }

export interface PasswordResetParamPacker {
    (resetToken: ResetToken): PasswordResetParam
}

export type PasswordResetState =
    Readonly<{ type: "initial-reset" }> |
    Readonly<{ type: "try-to-reset" }> |
    Readonly<{ type: "delayed-to-reset" }> |
    Readonly<{ type: "failed-to-reset", err: ResetError }> |
    Readonly<{ type: "succeed-to-reset", authCredential: AuthCredential }> |
    Readonly<{ type: "error", err: string }>

export const initialPasswordResetState: PasswordResetState = { type: "initial-reset" }

export type PasswordResetOperation =
    Readonly<{ type: "set-param", param: PasswordResetParam }> |
    Readonly<{ type: "reset" }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }> |
    Readonly<{ type: "field-password", operation: PasswordFieldOperation }>

export const initialPasswordResetRequest: Post<PasswordResetOperation> = () => {
    throw new Error("Component is not initialized. use: `init()`")
}

export interface PasswordResetWorkerComponentHelper {
    mapBackgroundCredentialOperation(operation: BackgroundCredentialOperation): PasswordResetWorkerState
    mapPasswordResetState(state: PasswordResetState): PasswordResetWorkerState
    mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetWorkerState
    mapPasswordFieldState(state: PasswordFieldState): PasswordResetWorkerState
}

export type PasswordResetWorkerState =
    Readonly<{ type: "password_reset", state: PasswordResetState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldState }> |
    Readonly<{ type: "field-password", state: PasswordFieldState }> |
    Readonly<{ type: "background-credential", operation: BackgroundCredentialOperation }>

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

type ComponentResource<T> = Readonly<{
    request: Post<T>
    terminate: Terminate
}>
