import { AppHrefInit } from "../../href"

import {
    RenewCredentialComponentSet,
    PasswordLoginComponentSet,
    PasswordResetSessionComponentSet,
    PasswordResetComponentSet,
} from "../view"

import {
    RenewCredentialInit,
    RenewCredentialComponent,
    RenewCredentialParam,
} from "../component/renew_credential/component"
import { PasswordLoginInit, PasswordLoginParam } from "../component/password_login/component"
import { PasswordResetSessionInit } from "../component/password_reset_session/component"
import { PasswordResetInit, PasswordResetParam } from "../component/password_reset/component"

import { LoginIDFieldComponent, LoginIDFieldInit } from "../component/field/login_id/component"
import { PasswordFieldComponent, PasswordFieldInit } from "../component/field/password/component"

import { SecureScriptPathAction } from "../../application/action"
import { RenewAction, SetContinuousRenewAction, StoreAction } from "../../credential/action"

import { LoginAction, LoginFieldCollector } from "../../password_login/action"
import {
    StartSessionAction,
    StartSessionFieldCollector,
    PollingStatusAction,
    ResetAction,
    ResetFieldCollector,
} from "../../password_reset/action"

import { LoginIDFieldAction } from "../../login_id/field/action"
import { PasswordFieldAction } from "../../password/field/action"

import { LoginID } from "../../login_id/data"
import { Password } from "../../password/data"
import { Content } from "../../field/data"

export type RenewCredentialFactorySet = Readonly<{
    application: {
        secureScriptPath: Factory<SecureScriptPathAction>
    }
    credential: {
        renew: Factory<RenewAction>
        setContinuousRenew: Factory<SetContinuousRenewAction>
    }
}>
export type RenewCredentialInitSet = Readonly<{
    renewCredential: RenewCredentialInit
}>
export function initRenewCredentialComponentSet(
    factory: RenewCredentialFactorySet,
    init: RenewCredentialInitSet,
    param: RenewCredentialParam,
    setup: Setup<RenewCredentialComponent>
): RenewCredentialComponentSet {
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

export type PasswordLoginFactorySet = Readonly<{
    application: {
        secureScriptPath: Factory<SecureScriptPathAction>
    }
    credential: {
        store: Factory<StoreAction>
    }
    passwordLogin: {
        login: ParameterizedFactory<LoginFieldCollector, LoginAction>
    }
    field: {
        loginID: Factory<LoginIDFieldAction>
        password: Factory<PasswordFieldAction>
    }
}>
export type PasswordLoginInitSet = Readonly<{
    href: AppHrefInit

    passwordLogin: PasswordLoginInit

    field: {
        loginID: LoginIDFieldInit
        password: PasswordFieldInit
    }
}>
export function initPasswordLoginComponentSet(
    factory: PasswordLoginFactorySet,
    init: PasswordLoginInitSet,
    param: PasswordLoginParam
): PasswordLoginComponentSet {
    const loginIDField = initLoginIDFieldComponent(factory, init)
    const passwordField = initPasswordFieldComponent(factory, init)

    const actions = {
        login: factory.passwordLogin.login({
            loginID: () => collectLoginID(loginIDField),
            password: () => collectPassword(passwordField),
        }),
        store: factory.credential.store(),
        secureScriptPath: factory.application.secureScriptPath(),
    }

    return {
        href: init.href(),
        passwordLogin: init.passwordLogin(actions, param),
        loginIDField,
        passwordField,
    }
}

export type PasswordResetSessionFactorySet = Readonly<{
    application: {
        secureScriptPath: Factory<SecureScriptPathAction>
    }
    credential: {
        store: Factory<StoreAction>
    }
    passwordReset: {
        startSession: ParameterizedFactory<StartSessionFieldCollector, StartSessionAction>
        pollingStatus: Factory<PollingStatusAction>
    }
    field: {
        loginID: Factory<LoginIDFieldAction>
    }
}>
export type PasswordResetSessionInitSet = Readonly<{
    href: AppHrefInit

    passwordResetSession: PasswordResetSessionInit

    field: {
        loginID: LoginIDFieldInit
    }
}>
export function initPasswordResetSessionComponentSet(
    factory: PasswordResetSessionFactorySet,
    init: PasswordResetSessionInitSet
): PasswordResetSessionComponentSet {
    const loginIDField = initLoginIDFieldComponent(factory, init)

    const actions = {
        startSession: factory.passwordReset.startSession({
            loginID: () => collectLoginID(loginIDField),
        }),
        pollingStatus: factory.passwordReset.pollingStatus(),
    }

    return {
        href: init.href(),
        passwordResetSession: init.passwordResetSession(actions),
        loginIDField,
    }
}

export type PasswordResetFactorySet = Readonly<{
    application: {
        secureScriptPath: Factory<SecureScriptPathAction>
    }
    credential: {
        store: Factory<StoreAction>
    }
    passwordReset: {
        reset: ParameterizedFactory<ResetFieldCollector, ResetAction>
    }
    field: {
        loginID: Factory<LoginIDFieldAction>
        password: Factory<PasswordFieldAction>
    }
}>
export type PasswordResetInitSet = Readonly<{
    href: AppHrefInit

    passwordReset: PasswordResetInit

    field: {
        loginID: LoginIDFieldInit
        password: PasswordFieldInit
    }
}>
export function initPasswordResetComponentSet(
    factory: PasswordResetFactorySet,
    init: PasswordResetInitSet,
    param: PasswordResetParam
): PasswordResetComponentSet {
    const loginIDField = initLoginIDFieldComponent(factory, init)
    const passwordField = initPasswordFieldComponent(factory, init)

    const actions = {
        reset: factory.passwordReset.reset({
            loginID: () => collectLoginID(loginIDField),
            password: () => collectPassword(passwordField),
        }),
        store: factory.credential.store(),
        secureScriptPath: factory.application.secureScriptPath(),
    }

    return {
        href: init.href(),
        passwordReset: init.passwordReset(actions, param),
        loginIDField,
        passwordField,
    }
}

export type LoginIDFieldFactorySet = Readonly<{
    field: {
        loginID: Factory<LoginIDFieldAction>
    }
}>
export type LoginIDFieldInitSet = Readonly<{
    field: {
        loginID: LoginIDFieldInit
    }
}>
export function initLoginIDFieldComponent(
    factory: LoginIDFieldFactorySet,
    init: LoginIDFieldInitSet
): LoginIDFieldComponent {
    return init.field.loginID({ loginID: factory.field.loginID() })
}

export type PasswordFieldFactorySet = Readonly<{
    field: {
        password: Factory<PasswordFieldAction>
    }
}>
export type PasswordFieldInitSet = Readonly<{
    field: {
        password: PasswordFieldInit
    }
}>
export function initPasswordFieldComponent(
    factory: PasswordFieldFactorySet,
    init: PasswordFieldInitSet
): PasswordFieldComponent {
    return init.field.password({ password: factory.field.password() })
}

function collectLoginID(loginIDField: LoginIDFieldComponent): Promise<Content<LoginID>> {
    return new Promise((resolve) => {
        loginIDField.validate((event) => {
            resolve(event.content)
        })
    })
}
function collectPassword(passwordField: PasswordFieldComponent): Promise<Content<Password>> {
    return new Promise((resolve) => {
        passwordField.validate((event) => {
            resolve(event.content)
        })
    })
}

interface Setup<T> {
    (component: T): void
}
interface Factory<T> {
    (): T
}
interface ParameterizedFactory<P, T> {
    (param: P): T
}
