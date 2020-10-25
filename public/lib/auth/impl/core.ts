import { initAuthComponentSetInit, FactorySet, InitSet, AuthComponentSetInit } from "./background"

import { packResetToken } from "../../password_reset/adapter"
import { packPagePathname } from "../../application/adapter"

import { AuthInit, AuthView, AuthState, AuthComponentSet } from "../view"

import { RenewCredentialComponent } from "../component/renew_credential/component"

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

export function initAuthInit(factory: FactorySet, init: InitSet): AuthInit {
    return (currentLocation) => {
        const components = initAuthComponentSetInit(factory, init)
        const view = new View(components, currentLocation)
        return {
            view,
            terminate: () => {
                /* worker とインターフェイスを合わせるために必要 */
            },
        }
    }
}

class View implements AuthView {
    listener: Post<AuthState>[] = []

    components: AuthComponentSet

    constructor(components: AuthComponentSetInit, currentLocation: Location) {
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

    load() {
        this.post({ type: "renew-credential" })
    }
}

function currentPagePathname(currentLocation: Location) {
    return packPagePathname(new URL(currentLocation.toString()))
}

interface Post<T> {
    (state: T): void
}
