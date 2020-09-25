import { RenewCredentialComponent } from "./component/renew_credential/component"
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

    component: AuthComponent
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
    Readonly<{ type: "renew-credential" }> |
    Readonly<{ type: "store-credential", authCredential: AuthCredential }> |
    Readonly<{ type: "load-application" }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset", resetToken: ResetToken }>

export const initialAuthState: AuthState = { type: "renew-credential" }

interface Post<T> {
    (state: T): void
}
