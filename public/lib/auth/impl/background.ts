import { AppHrefInit } from "../../href"
import {
    RenewCredentialComponentSet,
    PasswordLoginComponentSet,
    PasswordResetSessionComponentSet,
    PasswordResetComponentSet,
} from "../view"

import { RenewCredentialInit, RenewCredentialComponent, RenewCredentialParam } from "../component/renew_credential/component"
import { PasswordLoginInit, PasswordLoginParam } from "../component/password_login/component"
import { PasswordResetSessionInit } from "../component/password_reset_session/component"
import { PasswordResetInit, PasswordResetParam } from "../component/password_reset/component"

import { LoginIDFieldInit } from "../component/field/login_id/component"
import { PasswordFieldInit } from "../component/field/password/component"

import { SecureScriptPathAction } from "../../application/action"
import { RenewAction, SetContinuousRenewAction, StoreAction } from "../../credential/action"

import { LoginAction, LoginFieldCollector } from "../../password_login/action"
import {
    StartSessionAction, StartSessionFieldCollector,
    PollingStatusAction,
    ResetAction, ResetFieldCollector
} from "../../password_reset/action"

import { LoginIDFieldAction } from "../../login_id/field/action"
import { PasswordFieldAction } from "../../password/field/action"

export type FactorySet = Readonly<{
    application: {
        secureScriptPath: Factory<SecureScriptPathAction>
    }
    credential: {
        renew: Factory<RenewAction>
        setContinuousRenew: Factory<SetContinuousRenewAction>
        store: Factory<StoreAction>
    }

    passwordLogin: {
        login: ParameterFactory<LoginFieldCollector, LoginAction>
    }
    passwordReset: {
        startSession: ParameterFactory<StartSessionFieldCollector, StartSessionAction>
        pollingStatus: Factory<PollingStatusAction>
        reset: ParameterFactory<ResetFieldCollector, ResetAction>
    }

    field: {
        loginID: Factory<LoginIDFieldAction>
        password: Factory<PasswordFieldAction>
    }
}>

export type InitSet = Readonly<{
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

export interface AuthComponentSetInit {
    renewCredential(param: RenewCredentialParam, setup: Setup<RenewCredentialComponent>): RenewCredentialComponentSet

    passwordLogin(param: PasswordLoginParam): PasswordLoginComponentSet
    passwordResetSession(): PasswordResetSessionComponentSet
    passwordReset(param: PasswordResetParam): PasswordResetComponentSet
}

export function initAuthComponentSetInit(factory: FactorySet, init: InitSet): AuthComponentSetInit {
    return {
        renewCredential: (param, setup) => initRenewCredential(factory, init, param, setup),

        passwordLogin: (param) => initPasswordLogin(factory, init, param),
        passwordResetSession: () => initPasswordResetSession(factory, init),
        passwordReset: (param) => initPasswordReset(factory, init, param),
    }
}

function initRenewCredential(factory: FactorySet, init: InitSet, param: RenewCredentialParam, setup: Setup<RenewCredentialComponent>) {
    const actions = {
        renew: factory.credential.renew(),
        setContinuousRenew: factory.credential.setContinuousRenew(),
        secureScriptPath: factory.application.secureScriptPath(),
    }

    const renewCredential = init.renewCredential(actions, param)
    setup(renewCredential)

    return {
        renewCredential,
    }
}
function initPasswordLogin(factory: FactorySet, init: InitSet, param: PasswordLoginParam) {
    const components = {
        loginIDField: init.field.loginID({ loginID: factory.field.loginID() }),
        passwordField: init.field.password({ password: factory.field.password() }),
    }
    const fields: LoginFieldCollector = {
        loginID() {
            return new Promise((resolve) => {
                components.loginIDField.validate((event) => {
                    resolve(event.content)
                })
            })
        },
        password() {
            return new Promise((resolve) => {
                components.passwordField.validate((event) => {
                    resolve(event.content)
                })
            })
        }
    }
    const actions = {
        login: factory.passwordLogin.login(fields),
        store: factory.credential.store(),
        secureScriptPath: factory.application.secureScriptPath(),
    }

    return {
        href: init.href(),
        passwordLogin: init.passwordLogin(actions, param),
        ...components,
    }
}
function initPasswordResetSession(factory: FactorySet, init: InitSet) {
    const components = {
        loginIDField: init.field.loginID({ loginID: factory.field.loginID() }),
    }
    const fields: StartSessionFieldCollector = {
        loginID() {
            return new Promise((resolve) => {
                components.loginIDField.validate((event) => {
                    resolve(event.content)
                })
            })
        },
    }
    const actions = {
        startSession: factory.passwordReset.startSession(fields),
        pollingStatus: factory.passwordReset.pollingStatus(),
    }

    return {
        href: init.href(),
        passwordResetSession: init.passwordResetSession(actions),
        ...components,
    }
}
function initPasswordReset(factory: FactorySet, init: InitSet, param: PasswordResetParam) {
    const components = {
        loginIDField: init.field.loginID({ loginID: factory.field.loginID() }),
        passwordField: init.field.password({ password: factory.field.password() }),
    }
    const fields: ResetFieldCollector = {
        loginID() {
            return new Promise((resolve) => {
                components.loginIDField.validate((event) => {
                    resolve(event.content)
                })
            })
        },
        password() {
            return new Promise((resolve) => {
                components.passwordField.validate((event) => {
                    resolve(event.content)
                })
            })
        }
    }
    const actions = {
        reset: factory.passwordReset.reset(fields),
        store: factory.credential.store(),
        secureScriptPath: factory.application.secureScriptPath(),
    }

    return {
        href: init.href(),
        passwordReset: init.passwordReset(actions, param),
        ...components,
    }
}

interface Setup<T> {
    (component: T): void
}
interface Factory<T> {
    (): T
}
interface ParameterFactory<P, T> {
    (param: P): T
}
