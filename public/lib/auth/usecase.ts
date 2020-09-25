import { RenewCredentialComponent } from "./component/renew_credential/component"
import { StoreCredentialComponent } from "./component/store_credential/component"
import { LoadApplicationComponent } from "./component/load_application"

import { PasswordLoginComponent } from "./component/password_login"
import { PasswordResetSessionComponent } from "./component/password_reset_session/component"
import { PasswordResetComponent } from "./component/password_reset/component"

import { AuthState } from "./data"

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

interface Post<T> {
    (state: T): void
}
