import {
    PasswordLoginAction,
    PasswordLoginEventSubscriber,
} from "../../../password_login/action"

import { LoginError } from "../../../password_login/data"

export type PasswordLoginComponentAction = Readonly<{
    passwordLogin: PasswordLoginAction
}>

export interface PasswordLoginComponent {
    subscribePasswordLogin(subscriber: PasswordLoginEventSubscriber): void
    setAction(action: PasswordLoginComponentAction): void

    onStateChange(post: Post<PasswordLoginState>): void
    login(): void
}

export type PasswordLoginState =
    Readonly<{ type: "initial-login" }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", err: LoginError }> |
    Readonly<{ type: "succeed-to-login" }> |
    Readonly<{ type: "error", err: string }>

export const initialPasswordLoginState: PasswordLoginState = { type: "initial-login" }

interface Post<T> {
    (state: T): void
}
