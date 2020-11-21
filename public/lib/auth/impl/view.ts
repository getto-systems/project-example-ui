import { packResetToken } from "../../password_reset/adapter"
import { packPagePathname } from "../../application/adapter"

import { AuthSearch } from "./href"

import {
    AuthView,
    AuthState,
    RenewCredentialComponentSet,
    PasswordLoginComponentSet,
    PasswordResetSessionComponentSet,
    PasswordResetComponentSet,
} from "../view"

import { RenewCredentialComponent, RenewCredentialParam } from "../component/renew_credential/component"
import { PasswordLoginParam } from "../component/password_login/component"
import { PasswordResetParam } from "../component/password_reset/component"

import { ResetToken } from "../../password_reset/data"

type ComponentFactorySet = Readonly<{
    renewCredential: Factory<RenewCredentialComponentSet>

    passwordLogin: Factory<PasswordLoginComponentSet>
    passwordResetSession: Factory<PasswordResetSessionComponentSet>
    passwordReset: Factory<PasswordResetComponentSet>
}>

type LoginView = "password-login" | "password-reset-session" | "password-reset"

function detectLoginState(currentLocation: Location): LoginView {
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
function detectPasswordResetToken(currentLocation: Location): ResetToken {
    const url = new URL(currentLocation.toString())
    return packResetToken(url.searchParams.get(AuthSearch.passwordResetToken) || "")
}

export class View implements AuthView {
    listener: Post<AuthState>[] = []

    factory: ComponentFactorySet

    constructor(currentLocation: Location, components: AuthComponentFactorySet) {
        this.factory = {
            renewCredential: () =>
                components.renewCredential(
                    {
                        pagePathname: currentPagePathname(currentLocation),
                    },
                    (component) => {
                        this.hookCredentialStateChange(currentLocation, component)
                    }
                ),

            passwordLogin: () =>
                components.passwordLogin({
                    pagePathname: currentPagePathname(currentLocation),
                }),
            passwordResetSession: () => components.passwordResetSession(),
            passwordReset: () =>
                components.passwordReset({
                    pagePathname: currentPagePathname(currentLocation),
                    resetToken: detectPasswordResetToken(currentLocation),
                }),
        }
    }

    hookCredentialStateChange(
        currentLocation: Location,
        renewCredential: RenewCredentialComponent
    ): void {
        renewCredential.onStateChange((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.post(map(detectLoginState(currentLocation), this.factory))
                    return
            }

            function map(loginView: LoginView, factory: ComponentFactorySet): AuthState {
                switch (loginView) {
                    case "password-login":
                        return { type: loginView, components: factory.passwordLogin() }
                    case "password-reset-session":
                        return { type: loginView, components: factory.passwordResetSession() }
                    case "password-reset":
                        return { type: loginView, components: factory.passwordReset() }
                }
            }
        })
    }

    onStateChange(post: Post<AuthState>): void {
        this.listener.push(post)
    }
    post(state: AuthState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        this.post({ type: "renew-credential", components: this.factory.renewCredential() })
    }
    error(err: string): void {
        this.post({ type: "error", err })
    }
}

export interface AuthComponentFactorySet {
    renewCredential(
        param: RenewCredentialParam,
        setup: Setup<RenewCredentialComponent>
    ): RenewCredentialComponentSet

    passwordLogin(param: PasswordLoginParam): PasswordLoginComponentSet
    passwordResetSession(): PasswordResetSessionComponentSet
    passwordReset(param: PasswordResetParam): PasswordResetComponentSet
}

function currentPagePathname(currentLocation: Location) {
    return packPagePathname(new URL(currentLocation.toString()))
}

interface Post<T> {
    (state: T): void
}
interface Setup<T> {
    (component: T): void
}
interface Factory<T> {
    (): T
}
