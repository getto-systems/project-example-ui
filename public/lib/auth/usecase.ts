import { RenewCredentialComponent, RenewCredentialParam } from "./component/renew_credential/component"
import { StoreCredentialComponent } from "./component/store_credential/component"
import { LoadApplicationComponent } from "./component/load_application/component"

import { PasswordLoginComponent } from "./component/password_login/component"
import { PasswordResetSessionComponent } from "./component/password_reset_session/component"
import { PasswordResetComponent } from "./component/password_reset/component"

import { AuthCredential } from "../credential/data"
import { ResetToken } from "../password_reset/data"

export interface AuthUsecase {
    onStateChange(stateChanged: Post<AuthState>): void
    terminate(): void
    init(): Promise<void>

    component: AuthComponent
}

export interface AuthLocation {
    passwordLoginHref(): string
    passwordResetSessionHref(): string
}

export interface AuthComponent {
    renewCredential: RenewCredentialComponent
    storeCredential: StoreCredentialComponent
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
    Readonly<{ type: "store-credential", authCredential: AuthCredential }> |
    Readonly<{ type: "load-application" }> |
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
