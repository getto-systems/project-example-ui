import { packResetToken } from "../../password_reset/adapter"

import { AuthSearch } from "./href"

import {
    AuthView,
    AuthState,
    RenewCredentialComponentSet,
    PasswordLoginComponentSet,
    PasswordResetSessionComponentSet,
    PasswordResetComponentSet,
} from "../view"

import { RenewCredentialComponent } from "../component/renew_credential/component"

import { PagePathname, markPagePathname } from "../../application/data"
import { ResetToken } from "../../password_reset/data"

export type LoginView = "password-login" | "password-reset-session" | "password-reset"

export function detectLoginView(currentLocation: Location): LoginView {
    const url = new URL(currentLocation.toString())

    // パスワードリセット
    switch (url.searchParams.get(AuthSearch.passwordReset)) {
        case AuthSearch.passwordReset_start:
            return "password-reset-session"
        case AuthSearch.passwordReset_reset:
            return "password-reset"
    }

    // 特に指定が無ければパスワードログイン
    return "password-login"
}
export function detectResetToken(currentLocation: Location): ResetToken {
    const url = new URL(currentLocation.toString())
    return packResetToken(url.searchParams.get(AuthSearch.passwordResetToken) || "")
}
export function currentPagePathname(currentLocation: Location): PagePathname {
    return markPagePathname(new URL(currentLocation.toString()).pathname)
}

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

    mapLoginView(loginView: LoginView): AuthState {
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
        getLoginView(): LoginView
    }>
}

interface Post<T> {
    (state: T): void
}
interface Setup<T> {
    (component: T): void
}
