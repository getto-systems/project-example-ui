import {
    AuthView,
    AuthState,
    LoginState,
    RenewCredentialComponentSet,
    PasswordLoginComponentSet,
    PasswordResetSessionComponentSet,
    PasswordResetComponentSet,
} from "../view"

import { RenewCredentialComponent } from "../../renew_credential/component"

export class View implements AuthView {
    listener: Post<AuthState>[] = []

    collector: AuthCollector
    components: AuthComponentFactorySet

    constructor(collector: AuthCollector, components: AuthComponentFactorySet) {
        this.collector = collector
        this.components = components
    }

    hookCredentialStateChange(renewCredential: RenewCredentialComponent): void {
        renewCredential.onStateChange((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.post(this.mapLoginView(this.collector.auth.getLoginView()))
                    return
            }
        })
    }

    mapLoginView(loginView: LoginState): AuthState {
        switch (loginView) {
            case "password-login":
                return { type: loginView, components: this.components.passwordLogin() }
            case "password-reset-session":
                return { type: loginView, components: this.components.passwordResetSession() }
            case "password-reset":
                return { type: loginView, components: this.components.passwordReset() }
        }
    }

    onStateChange(post: Post<AuthState>): void {
        this.listener.push(post)
    }
    post(state: AuthState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        this.post({
            type: "renew-credential",
            components: this.components.renewCredential((renewCredential) => {
                this.hookCredentialStateChange(renewCredential)
            }),
        })
    }
    error(err: string): void {
        this.post({ type: "error", err })
    }
}

export interface AuthComponentFactorySet {
    renewCredential(setup: Setup<RenewCredentialComponent>): RenewCredentialComponentSet

    passwordLogin(): PasswordLoginComponentSet
    passwordResetSession(): PasswordResetSessionComponentSet
    passwordReset(): PasswordResetComponentSet
}
export interface AuthCollector {
    auth: Readonly<{
        getLoginView(): LoginState
    }>
}

interface Post<T> {
    (state: T): void
}
interface Setup<T> {
    (component: T): void
}
