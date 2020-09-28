import { LoginIDFieldState } from "../field/login_id/component"
import { PasswordFieldState } from "../field/password/component"

import { AuthCredential } from "../../../credential/data"
import { LoginError } from "../../../password_login/data"
import { LoginIDFieldOperation } from "../../../field/login_id/data"
import { PasswordFieldOperation } from "../../../field/password/data"

export interface PasswordLoginComponent {
    onStateChange(stateChanged: Post<PasswordLoginState>): void
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void
    init(): ComponentResource<PasswordLoginOperation>
}

export type PasswordLoginState =
    Readonly<{ type: "initial-login" }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", err: LoginError }> |
    Readonly<{ type: "succeed-to-login", authCredential: AuthCredential }> |
    Readonly<{ type: "error", err: string }>

export const initialPasswordLoginState: PasswordLoginState = { type: "initial-login" }

export type PasswordLoginOperation =
    Readonly<{ type: "login" }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }> |
    Readonly<{ type: "field-password", operation: PasswordFieldOperation }>

export const initialPasswordLoginSend: Post<PasswordLoginOperation> = (): void => {
    throw new Error("Component is not initialized. use: `init()`")
}

export interface PasswordLoginWorkerComponentHelper {
    mapPasswordLoginState(state: PasswordLoginState): PasswordLoginWorkerState
    mapLoginIDFieldState(state: LoginIDFieldState): PasswordLoginWorkerState
    mapPasswordFieldState(state: PasswordFieldState): PasswordLoginWorkerState
}

export type PasswordLoginWorkerState =
    Readonly<{ type: "password_login", state: PasswordLoginState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldState }> |
    Readonly<{ type: "field-password", state: PasswordFieldState }>

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

type ComponentResource<T> = Readonly<{
    send: Post<T>
    terminate: Terminate
}>
