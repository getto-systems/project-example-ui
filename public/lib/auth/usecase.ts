import { RenewCredentialComponent, RenewCredentialParam } from "./component/renew_credential/component"
import { LoadApplicationComponent, LoadApplicationParam } from "./component/load_application/component"

import { PasswordLoginComponent } from "./component/password_login/component"
import { PasswordResetSessionComponent } from "./component/password_reset_session/component"
import { PasswordResetComponent } from "./component/password_reset/component"

import { ResetToken } from "../password_reset/data"

export interface AuthUsecase {
    component: AuthComponent
    onStateChange(stateChanged: Post<AuthState>): void
    init(): Terminate
}

export interface AuthLocation {
    passwordLoginHref(): string
    passwordResetSessionHref(): string
}

export interface AuthComponent {
    renewCredential: RenewCredentialComponent
    loadApplication: LoadApplicationComponent

    passwordLogin: PasswordLoginComponent
    passwordResetSession: PasswordResetSessionComponent
    passwordReset: PasswordResetComponent
}

export type AuthState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "failed-to-fetch", err: FetchError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "renew-credential", param: RenewCredentialParam }> |
    Readonly<{ type: "load-application", param: LoadApplicationParam }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset", resetToken: ResetToken }>

export const initialAuthState: AuthState = { type: "initial" }

export type FetchError =
    Readonly<{ type: "infra-error", err: string }>

export type StoreError =
    Readonly<{ type: "infra-error", err: string }>

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}
