import { AuthComponentError } from "./data"
import { ResetToken } from "../password_reset/data"

export interface AuthComponentDeprecated {
    initialState: AuthComponentState
}

export type AuthComponentState =
    Readonly<{ type: "renew" }> |
    Readonly<{ type: "load-application" }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset", resetToken: ResetToken }> |
    Readonly<{ type: "error", err: AuthComponentError }>

export interface AuthComponentEventPublisher {
    tryToLogin(): void
    failedToAuth(err: AuthComponentError): void
    succeedToAuth(): void
}

export interface AuthComponentEventInit {
    (stateChanged: AuthComponentStateHandler): AuthComponentEventPublisher
}

export interface AuthComponentStateHandler {
    (state: AuthComponentState): void
}
