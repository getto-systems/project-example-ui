import { newAppHref } from "../../../main/href"

import { newRenewCredentialComponent } from "./renew_credential"
import { newLoadApplicationComponent } from "./load_application"

import { newPasswordLoginComponent } from "./password_login"
import { newPasswordResetSessionComponent } from "./password_reset_session"
import { newPasswordResetComponent } from "./password_reset"

import { packRenewCredentialParam } from "../../../auth/component/renew_credential/impl"
import { packLoadApplicationParam } from "../../../auth/component/load_application/impl"
import { packPasswordResetParam } from "../../../auth/component/password_reset/impl"

import { packTicketNonce, packAuthAt } from "../../../credential/adapter"
import { packResetToken } from "../../../password_reset/adapter"
import { packPagePathname } from "../../../script/adapter"

import { AppHref } from "../../../href"
import { AuthUsecase, AuthComponent, AuthState } from "../../../auth/usecase"

export function newAuthUsecase(): AuthUsecase {
    return new Usecase(new Init().renewCredential())
}

class Init {
    renewCredential(): AuthState {
        return {
            type: "renew-credential",
            param: packRenewCredentialParam({
                pagePathname: packPagePathname(new URL("https://example.com/index.html")),
                authResource: {
                    ticketNonce: packTicketNonce("ticket-nonce"),
                    lastAuthAt: packAuthAt(new Date()),
                },
            }),
        }
    }
    loadApplication(): AuthState {
        return {
            type: "load-application",
            param: packLoadApplicationParam({
                pagePathname: packPagePathname(new URL("https://example.com/index.html")),
            }),
        }
    }

    passwordLogin(): AuthState {
        return { type: "password-login" }
    }
    passwordResetSession(): AuthState {
        return { type: "password-reset-session" }
    }
    passwordReset(): AuthState {
        return {
            type: "password-reset",
            param: packPasswordResetParam(packResetToken("reset-token"))
        }
    }
}

class Usecase implements AuthUsecase {
    href: AppHref
    component: AuthComponent

    state: AuthState

    constructor(state: AuthState) {
        this.href = newAppHref()
        this.component = {
            renewCredential: newRenewCredentialComponent(),
            loadApplication: newLoadApplicationComponent(),

            passwordLogin: newPasswordLoginComponent(),
            passwordResetSession: newPasswordResetSessionComponent(),
            passwordReset: newPasswordResetComponent(),
        }

        this.state = state
    }

    onStateChange(stateChanged: Post<AuthState>): void {
        stateChanged(this.state)
    }

    init(): Terminate {
        return () => this.terminate()
    }
    terminate(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}
