import { FetchCredentialComponent } from "./fetch_credential/component"
import { RenewCredentialComponent } from "./renew_credential/component"
import { StoreCredentialComponent } from "./store_credential/component"
import { LoadApplicationComponent } from "./load_application/component"

import { PasswordLoginComponent } from "./password_login/component"
import { PasswordResetSessionComponent } from "./password_reset_session/component"
import { PasswordResetComponent } from "./password_reset/component"

import { AuthState } from "./data"

export interface AuthUsecase {
    init(stateChanged: Publisher<AuthState>): void
    terminate(): void

    component: AuthComponent
}

export interface AuthComponent {
    fetchCredential: FetchCredentialComponent
    renewCredential: RenewCredentialComponent
    storeCredential: StoreCredentialComponent
    loadApplication: LoadApplicationComponent

    passwordLogin: PasswordLoginComponent
    passwordResetSession: PasswordResetSessionComponent
    passwordReset: PasswordResetComponent
}

interface Publisher<T> {
    (state: T): void
}
