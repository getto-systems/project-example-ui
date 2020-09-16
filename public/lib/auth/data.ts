import { FetchCredentialComponent } from "./fetch_credential/data"
import { RenewCredentialComponent } from "./renew_credential/action"
import { StoreCredentialComponent } from "./store_credential/data"

import { AuthCredential, TicketNonce } from "../credential/data"
import { ResetToken } from "../password_reset/data"

export interface AuthUsecase {
    init(stateChanged: Publisher<AuthUsecaseState>): void
    terminate(): void

    component: AuthComponent

    renewCredential(ticketNonce: TicketNonce): Promise<void>
    storeCredential(authCredential: AuthCredential): Promise<void>
    tryToLogin(): Promise<void>
    loadApplication(): Promise<void>
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
