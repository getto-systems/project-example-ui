import { packResetToken } from "../../password_reset/adapter"
import { packPagePathname } from "../../application/adapter"

import { AppHrefInit } from "../../href"
import {
    AuthInit,
    AuthView,
    AuthState,
    AuthComponentSet,
} from "../view"

import { RenewCredentialInit, RenewCredentialComponent } from "../component/renew_credential/component"
import { PasswordLoginInit } from "../component/password_login/component"
import { PasswordResetSessionInit } from "../component/password_reset_session/component"
import { PasswordResetInit } from "../component/password_reset/component"

import { LoginIDFieldInit } from "../component/field/login_id/component"
import { PasswordFieldInit } from "../component/field/password/component"

import { PathFactory } from "../../application/action"
import { RenewFactory, StoreFactory } from "../../credential/action"

import { LoginFactory } from "../../password_login/action"
import { SessionFactory, ResetFactory } from "../../password_reset/action"

import { LoginIDFieldFactory } from "../../login_id/field/action"
import { PasswordFieldFactory } from "../../password/field/action"

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

type Factory = Readonly<{
    application: {
        path: PathFactory
    }
    credential: {
        renew: RenewFactory
        store: StoreFactory
    }

    passwordLogin: {
        login: LoginFactory
    }
    passwordReset: {
        session: SessionFactory
        reset: ResetFactory
    }

    field: {
        loginID: LoginIDFieldFactory
        password: PasswordFieldFactory
    }
}>

type Init = Readonly<{
    href: AppHrefInit

    renewCredential: RenewCredentialInit

    passwordLogin: PasswordLoginInit
    passwordResetSession: PasswordResetSessionInit
    passwordReset: PasswordResetInit

    field: {
        loginID: LoginIDFieldInit
        password: PasswordFieldInit
    }
}>

export function initAuthInit(factory: Factory, init: Init): AuthInit {
    return (currentLocation) => {
        const view = new View(factory, init, currentLocation)
        return {
            view,
            terminate: () => view.terminate(),
        }
    }
}

class View implements AuthView {
    listener: Post<AuthState>[] = []

    components: AuthComponentSet

    constructor(factory: Factory, init: Init, currentLocation: Location) {
        this.components = {
            renewCredential: () => initRenewCredential(factory, init, currentLocation, (renewCredential) => {
                this.hookCredentialStateChange(currentLocation, renewCredential)
            }),

            passwordLogin: () => initPasswordLogin(factory, init, currentLocation),
            passwordResetSession: () => initPasswordResetSession(factory, init),
            passwordReset: () => initPasswordReset(factory, init, currentLocation),
        }
    }

    hookCredentialStateChange(currentLocation: Location, renewCredential: RenewCredentialComponent): void {
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
        this.listener.forEach(post => post(state))
    }

    terminate(): void {
        // worker とインターフェイスを合わせるために必要
    }
    load() {
        this.post({ type: "renew-credential" })
    }
}

function initRenewCredential(factory: Factory, init: Init, currentLocation: Location, hook: Hook<RenewCredentialComponent>) {
    const actions = {
        renew: factory.credential.renew(),
        path: factory.application.path(),
    }

    const param = {
        pagePathname: currentPagePathname(currentLocation),
    }

    const renewCredential = init.renewCredential(actions, param)
    hook(renewCredential)

    return {
        renewCredential,
    }
}
function initPasswordLogin(factory: Factory, init: Init, currentLocation: Location) {
    const loginID = factory.field.loginID()
    const password = factory.field.password()

    const actions = {
        login: factory.passwordLogin.login(),
        field: {
            loginID: loginID.action,
            password: password.action,
        },
        store: factory.credential.store(),
        path: factory.application.path(),
    }

    const fields = {
        loginIDField: init.field.loginID({ loginID }),
        passwordField: init.field.password({ password }),
    }

    const param = {
        pagePathname: currentPagePathname(currentLocation),
    }

    return {
        href: init.href(),
        passwordLogin: init.passwordLogin(actions, fields, param),
    }
}
function initPasswordResetSession(factory: Factory, init: Init) {
    const loginID = factory.field.loginID()

    const actions = {
        session: factory.passwordReset.session(),
        field: {
            loginID: loginID.action,
        },
    }

    const fields = {
        loginIDField: init.field.loginID({ loginID }),
    }

    return {
        href: init.href(),
        passwordResetSession: init.passwordResetSession(actions, fields),
    }
}
function initPasswordReset(factory: Factory, init: Init, currentLocation: Location) {
    const loginID = factory.field.loginID()
    const password = factory.field.password()

    const actions = {
        reset: factory.passwordReset.reset(),
        field: {
            loginID: loginID.action,
            password: password.action,
        },
        store: factory.credential.store(),
        path: factory.application.path(),
    }

    const fields = {
        loginIDField: init.field.loginID({ loginID }),
        passwordField: init.field.password({ password }),
    }

    const param = {
        pagePathname: currentPagePathname(currentLocation),
        resetToken: detectPasswordResetToken(currentLocation),
    }

    return {
        href: init.href(),
        passwordReset: init.passwordReset(actions, fields, param),
    }
}

function currentPagePathname(currentLocation: Location) {
    return packPagePathname(new URL(currentLocation.toString()))
}

interface Hook<T> {
    (component: T): void
}
interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}
