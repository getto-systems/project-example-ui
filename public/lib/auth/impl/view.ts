import { packResetToken } from "../../password_reset/adapter"
import { packPagePathname } from "../../application/adapter"

import {
    AuthView,
    AuthState,
    AuthComponentSet,
    RenewCredentialComponentSet,
    PasswordLoginComponentSet,
    PasswordResetSessionComponentSet,
    PasswordResetComponentSet,
} from "../view"

import { RenewCredentialComponent, RenewCredentialParam } from "../component/renew_credential/component"
import { PasswordLoginParam } from "../component/password_login/component"
import { PasswordResetParam } from "../component/password_reset/component"

import { ResetToken } from "../../password_reset/data"

// ログイン前画面ではアンダースコアから始まるクエリを使用する
const SEARCH = {
    passwordReset: "_password_reset",
    passwordResetToken: "_password_reset_token",
}

function detectLoginState(currentLocation: Location): AuthState {
    const url = new URL(currentLocation.toString())

    // パスワードリセット
    switch (url.searchParams.get(SEARCH.passwordReset)) {
        case "start":
            return { type: "password-reset-session" }
        case "reset":
            return { type: "password-reset" }
    }

    // 特に指定が無ければパスワードログイン
    return { type: "password-login" }
}
function detectPasswordResetToken(currentLocation: Location): ResetToken {
    const url = new URL(currentLocation.toString())
    return packResetToken(url.searchParams.get(SEARCH.passwordResetToken) || "")
}

export class View implements AuthView {
    listener: Post<AuthState>[] = []

    components: AuthComponentSet

    constructor(currentLocation: Location, components: AuthComponentFactorySet) {
        this.components = {
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
                    this.post(detectLoginState(currentLocation))
                    return
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
        this.post({ type: "renew-credential" })
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
