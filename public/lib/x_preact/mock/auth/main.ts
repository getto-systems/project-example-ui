import { newTopLink } from "../../../main/link"

import { newRenewCredentialComponent } from "./renew_credential"
import { newLoadApplicationComponent } from "./load_application"

import { newPasswordLoginComponent } from "./password_login"
import { newPasswordResetSessionComponent } from "./password_reset_session"
import { newPasswordResetComponent } from "./password_reset"

import { packRenewCredentialParam } from "../../../auth/component/renew_credential/param"
import { packLoadApplicationParam } from "../../../auth/component/load_application/param"
import { packPasswordResetParam } from "../../../auth/component/password_reset/param"

import { packTicketNonce } from "../../../credential/adapter"
import { packResetToken } from "../../../password_reset/adapter"
import { packPagePathname } from "../../../script/adapter"

import { TopLink } from "../../../link"
import { AuthUsecase, AuthComponent, AuthState } from "../../../auth/usecase"

export function newAuthUsecase(): AuthUsecase {
    return new Usecase(new Init().initial())
}

class Init {
    initial(): AuthState {
        return { type: "initial" }
    }
    renewCredential(): AuthState {
        return {
            type: "renew-credential",
            param: packRenewCredentialParam(packTicketNonce("ticket-nonce")),
        }
    }
    loadApplication(): AuthState {
        return {
            type: "load-application",
            param: packLoadApplicationParam(packPagePathname(new URL("https://example.com/index.html"))),
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
    link: TopLink
    component: AuthComponent

    state: AuthState

    constructor(state: AuthState) {
        this.link = newTopLink()
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
