import {
    LoginView,
    LoginState,
    ViewState,
    RenewCredentialComponentSet,
    PasswordLoginComponentSet,
    PasswordResetSessionComponentSet,
    PasswordResetComponentSet,
} from "../view"

import { RenewCredentialComponent } from "../../renew_credential/component"

export class View implements LoginView {
    listener: Post<LoginState>[] = []

    collector: LoginCollector
    components: LoginComponentFactorySet

    constructor(collector: LoginCollector, components: LoginComponentFactorySet) {
        this.collector = collector
        this.components = components
    }

    hookCredentialStateChange(renewCredential: RenewCredentialComponent): void {
        renewCredential.onStateChange((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.post(this.mapLoginView(this.collector.login.getLoginView()))
                    return
            }
        })
    }

    mapLoginView(loginView: ViewState): LoginState {
        switch (loginView) {
            case "password-login":
                return { type: loginView, components: this.components.passwordLogin() }
            case "password-reset-session":
                return { type: loginView, components: this.components.passwordResetSession() }
            case "password-reset":
                return { type: loginView, components: this.components.passwordReset() }
        }
    }

    onStateChange(post: Post<LoginState>): void {
        this.listener.push(post)
    }
    post(state: LoginState): void {
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

export interface LoginComponentFactorySet {
    renewCredential(setup: Setup<RenewCredentialComponent>): RenewCredentialComponentSet

    passwordLogin(): PasswordLoginComponentSet
    passwordResetSession(): PasswordResetSessionComponentSet
    passwordReset(): PasswordResetComponentSet
}
export interface LoginCollector {
    login: Readonly<{
        getLoginView(): ViewState
    }>
}

interface Post<T> {
    (state: T): void
}
interface Setup<T> {
    (component: T): void
}