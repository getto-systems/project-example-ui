import { newRenewCredentialComponent } from "./renew_credential"
import { newStoreCredentialComponent } from "./store_credential"
import { newLoadApplicationComponent } from "./load_application"

import { newPasswordLoginComponent } from "./password_login"
import { newPasswordResetSessionComponent } from "./password_reset_session"
import { newPasswordResetComponent } from "./password_reset"

import { packRenewCredentialParam } from "../../../auth/component/renew_credential/param"

import { packTicketNonce, packApiRoles } from "../../../credential/adapter"
import { packResetToken } from "../../../password_reset/adapter"

import { AuthUsecase, AuthComponent, AuthState } from "../../../auth/usecase"

export function newAuthUsecase(): AuthUsecase {
    return new Usecase(new Init().renewCredential())
}

class Init {
    renewCredential(): AuthState {
        return { type: "renew-credential", param: packRenewCredentialParam(packTicketNonce("ticket-nonce")) }
    }
    storeCredential(): AuthState {
        return {
            type: "store-credential", authCredential: {
                ticketNonce: packTicketNonce("ticket-nonce"),
                apiCredential: { apiRoles: packApiRoles(["admin", "dev"]) },
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
        return { type: "password-reset", resetToken: packResetToken("reset-token") }
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
    async init(): Promise<void> {
        // mock では特に何もしない
    }
    terminate(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
