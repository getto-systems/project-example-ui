import { newAppHref } from "../../../main/href"

import { newCredentialComponent } from "./credential"
import { newApplicationComponent } from "./application"

import { newPasswordLoginComponent } from "./password_login"
import { newPasswordResetSessionComponent } from "./password_reset_session"
import { newPasswordResetComponent } from "./password_reset"

import { packCredentialParam } from "../../../auth/component/credential/impl"
import { packApplicationParam } from "../../../auth/component/application/impl"
import { packPasswordResetParam } from "../../../auth/component/password_reset/impl"

import { packTicketNonce, packAuthAt } from "../../../credential/adapter"
import { packResetToken } from "../../../password_reset/adapter"
import { packPagePathname } from "../../../application/adapter"

import { AppHref } from "../../../href"
import {
    AuthUsecase,
    AuthUsecaseResource,
    AuthComponent,
    AuthState,
    PasswordLoginView,
} from "../../../auth/usecase"

export function newAuthUsecase(): AuthUsecase {
    return new Usecase(new Init().credential())
}

class Init {
    credential(): AuthState {
        return {
            type: "credential",
            param: packCredentialParam({
                pagePathname: packPagePathname(new URL("https://example.com/index.html")),
                lastAuth: {
                    ticketNonce: packTicketNonce("ticket-nonce"),
                    lastAuthAt: packAuthAt(new Date()),
                },
            }),
        }
    }
    application(): AuthState {
        return {
            type: "application",
            param: packApplicationParam({
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
            credential: newCredentialComponent(),
            application: newApplicationComponent(),

            passwordLogin: newPasswordLoginComponent(),
            passwordResetSession: newPasswordResetSessionComponent(),
            passwordReset: newPasswordResetComponent(),
        }

        this.state = state
    }

    onStateChange(stateChanged: Post<AuthState>): void {
        stateChanged(this.state)
    }

    init(): AuthUsecaseResource {
        return {
            request: () => { /* mock では特に何もしない */ },
            terminate: () => { /* mock では特に何もしない */ },
        }
    }

    initPasswordLogin(_view: PasswordLoginView): Terminate {
        return () => { /* mock では特に何もしない */ }
    }
}

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}
