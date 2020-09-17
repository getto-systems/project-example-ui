import { FetchCredentialComponent } from "./fetch_credential/data"
import { RenewCredentialComponent } from "./renew_credential/data"
import { StoreCredentialComponent } from "./store_credential/data"
import { LoadApplicationComponent } from "./load_application/data"

import { PasswordLoginComponent } from "./password_login/action"
import { PasswordResetSessionComponent } from "./password_reset_session/action"

import { AuthCredential, TicketNonce } from "../credential/data"
import { ResetToken } from "../password_reset/data"

export interface AuthUsecase {
    init(stateChanged: Publisher<AuthUsecaseState>): void
    terminate(): void

    component: AuthComponent
}

export type AuthUsecaseState =
    Readonly<{ type: "fetch-credential" }> |
    Readonly<{ type: "renew-credential", ticketNonce: TicketNonce }> |
    Readonly<{ type: "store-credential", authCredential: AuthCredential }> |
    Readonly<{ type: "load-application" }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset", resetToken: ResetToken }>

export const initialAuthUsecaseState: AuthUsecaseState = { type: "fetch-credential" }

export interface AuthComponent {
    fetchCredential: FetchCredentialComponent
    renewCredential: RenewCredentialComponent
    storeCredential: StoreCredentialComponent
    loadApplication: LoadApplicationComponent

    passwordLogin: PasswordLoginComponent
    passwordResetSession: PasswordResetSessionComponent
}

export interface AuthUsecaseEventHandler extends AuthEventHandler {
    onStateChange(pub: Publisher<AuthUsecaseState>): void
}

export interface AuthEventHandler {
    handleAuthEvent(event: AuthEvent): void
}

export type AuthEvent =
    Readonly<{ type: "try-to-renew-credential", ticketNonce: TicketNonce }> |
    Readonly<{ type: "try-to-store-credential", authCredential: AuthCredential }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "succeed-to-login" }>

interface Publisher<T> {
    (state: T): void
}
