import { FetchComponent } from "./fetch/data"
import { RenewComponent } from "./renew/action"
import { StoreComponent } from "./store/data"

import { AuthCredential, TicketNonce, RenewError } from "../credential/data"
import { CheckError } from "../script/data"
import { ResetToken } from "../password_reset/data"

export interface AuthUsecase {
    init(stateChanged: Publisher<AuthUsecaseState>): void
    terminate(): void

    component: AuthComponent
}

export type AuthUsecaseState =
    Readonly<{ type: "fetch" }> |
    Readonly<{ type: "renew", ticketNonce: TicketNonce }> |
    Readonly<{ type: "store", authCredential: AuthCredential }> |
    Readonly<{ type: "load-application" }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset", resetToken: ResetToken }> |
    Readonly<{ type: "error", err: AuthUsecaseError }>

export const initialAuthUsecaseState: AuthUsecaseState = { type: "fetch" }

export type AuthUsecaseError =
    Readonly<{ type: "renew", err: RenewError }> |
    Readonly<{ type: "load", err: CheckError }>

export interface AuthComponent {
    fetch: FetchComponent
    renew: RenewComponent
    store: StoreComponent
}

export interface AuthUsecaseEventHandler extends AuthEventHandler {
    onStateChange(pub: Publisher<AuthUsecaseState>): void
}

export interface AuthEventHandler {
    handleAuthEvent(event: AuthEvent): void
}

export type AuthEvent =
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "failed-to-login", err: AuthUsecaseError }> |
    Readonly<{ type: "try-to-store", authCredential: AuthCredential }> |
    Readonly<{ type: "succeed-to-login" }>

interface Publisher<T> {
    (state: T): void
}
