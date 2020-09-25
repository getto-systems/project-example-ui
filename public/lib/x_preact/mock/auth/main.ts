import { newRenewCredentialComponent } from "./renew_credential"
import { newStoreCredentialComponent } from "./store_credential"
import { newLoadApplicationComponent } from "./load_application"

import { newPasswordLoginComponent } from "./password_login"
import { newPasswordResetSessionComponent } from "./password_reset_session"
import { newPasswordResetComponent } from "./password_reset"

import { initTicketNonce, initApiRoles } from "../../../credential/adapter"
import { initResetToken } from "../../../password_reset/adapter"

import { AuthUsecase, AuthComponent } from "../../../auth/usecase"

import { AuthState } from "../../../auth/data"

export function newAuthUsecase(): AuthUsecase {
    return new Usecase(new Init().renewCredential())
}

class Init {
    renewCredential(): AuthState {
        return { type: "renew-credential" }
    }
    storeCredential(): AuthState {
        return {
            type: "store-credential", authCredential: {
                ticketNonce: initTicketNonce("ticket-nonce"),
                apiCredential: { apiRoles: initApiRoles(["admin", "dev"]) },
            }
        }
    }
    loadApplication(): AuthState {
        return { type: "load-application" }
    }

    passwordLogin(): AuthState {
        return { type: "password-login" }
    }
    passwordResetSession(): AuthState {
        return { type: "password-reset-session" }
    }
    passwordReset(): AuthState {
        return { type: "password-reset", resetToken: initResetToken("reset-token") }
    }
}

class Usecase implements AuthUsecase {
    state: AuthState
    component: AuthComponent

    constructor(state: AuthState) {
        this.state = state

        this.component = {
            renewCredential: newRenewCredentialComponent(),
            storeCredential: newStoreCredentialComponent(),
            loadApplication: newLoadApplicationComponent(),

            passwordLogin: newPasswordLoginComponent(),
            passwordResetSession: newPasswordResetSessionComponent(),
            passwordReset: newPasswordResetComponent(),
        }
    }

    onStateChange(stateChanged: Post<AuthState>): void {
        stateChanged(this.state)
    }
    terminate(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
