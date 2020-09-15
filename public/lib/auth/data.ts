import { RenewError } from "../credential/data"
import { CheckError } from "../script/data"
import { ResetToken } from "../password_reset/data"

export interface AuthComponent {
    init(stateChanged: Publisher<AuthComponentState>): void
    terminate(): void
}

export type AuthComponentState =
    Readonly<{ type: "renew" }> |
    Readonly<{ type: "store-credential" }> |
    Readonly<{ type: "load-application" }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset", resetToken: ResetToken }> |
    Readonly<{ type: "error", err: AuthComponentError }>

export const initialAuthComponentState: AuthComponentState = { type: "renew" }

export type AuthComponentError =
    Readonly<{ type: "renew", err: RenewError }> |
    Readonly<{ type: "load", err: CheckError }>

export interface AuthComponentEventHandler extends AuthEventHandler {
    onStateChange(pub: Publisher<AuthComponentState>): void
}

export interface AuthEventHandler {
    handleAuthEvent(event: AuthEvent): void
}

export type AuthEvent =
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "failed-to-login", err: AuthComponentError }> |
    Readonly<{ type: "try-to-store-credential" }> |
    Readonly<{ type: "succeed-to-login" }>

interface Publisher<T> {
    (state: T): void
}
