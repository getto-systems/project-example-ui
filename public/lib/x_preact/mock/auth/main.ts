import { newFetchCredentialComponent } from "./fetch_credential"
import { newRenewCredentialComponent } from "./renew_credential"
import { newStoreCredentialComponent } from "./store_credential"
import { newLoadApplicationComponent } from "./load_application"

import { newPasswordLoginComponent } from "./password_login"
import { newPasswordResetSessionComponent } from "./password_reset_session"
import { newPasswordResetComponent } from "./password_reset"

import { initTicketNonce, initApiRoles } from "../../../credential/adapter"
import { initResetToken } from "../../../password_reset/adapter"

import { AuthUsecase, AuthComponent } from "../../../auth/component"

import { AuthUsecaseState } from "../../../auth/data"

export function newAuthUsecase(): AuthUsecase {
    return new Usecase(new Init().passwordResetSession())
}

class Init {
    fetchCredential(): AuthUsecaseState {
        return { type: "fetch-credential" }
    }
    renewCredential(): AuthUsecaseState {
        return { type: "renew-credential", ticketNonce: initTicketNonce("ticket-nonce") }
    }
    storeCredential(): AuthUsecaseState {
        return {
            type: "store-credential", authCredential: {
                ticketNonce: initTicketNonce("ticket-nonce"),
                apiCredential: { apiRoles: initApiRoles(["admin", "dev"]) },
            }
        }
    }
    loadApplication(): AuthUsecaseState {
        return { type: "load-application" }
    }

    passwordLogin(): AuthUsecaseState {
        return { type: "password-login" }
    }
    passwordResetSession(): AuthUsecaseState {
        return { type: "password-reset-session" }
    }
    passwordReset(): AuthUsecaseState {
        return { type: "password-reset", resetToken: initResetToken("reset-token") }
    }
}

class Usecase implements AuthUsecase {
    state: AuthUsecaseState
    component: AuthComponent

    constructor(state: AuthUsecaseState) {
        this.state = state

        this.component = {
            fetchCredential: newFetchCredentialComponent(),
            renewCredential: newRenewCredentialComponent(),
            storeCredential: newStoreCredentialComponent(),
            loadApplication: newLoadApplicationComponent(),

            passwordLogin: newPasswordLoginComponent(),
            passwordResetSession: newPasswordResetSessionComponent(),
            passwordReset: newPasswordResetComponent(),
        }
    }

    init(stateChanged: Publisher<AuthUsecaseState>): void {
        stateChanged(this.state)
    }
    terminate(): void {
        // mock では特に何もしない
    }
}

interface Publisher<T> {
    (state: T): void
}
