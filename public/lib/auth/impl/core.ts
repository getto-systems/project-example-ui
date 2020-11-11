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
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: Factory<SecureScriptPathAction>
        }>
        credential: Readonly<{
            renew: Factory<RenewAction>
            setContinuousRenew: Factory<SetContinuousRenewAction>
        }>
    }>
    components: Readonly<{
        renewCredential: RenewCredentialInit
    }>
}>
export function initRenewCredentialComponentSet(
    factory: RenewCredentialFactorySet,
    param: RenewCredentialParam,
    setup: Setup<RenewCredentialComponent>
): RenewCredentialComponentSet {
    const actions = {
        renew: factory.actions.credential.renew(),
        setContinuousRenew: factory.actions.credential.setContinuousRenew(),
        secureScriptPath: factory.actions.application.secureScriptPath(),
    }

    const renewCredential = factory.components.renewCredential(actions, param)
    setup(renewCredential)

    return {
        renewCredential,
    }
}

export type PasswordLoginFactorySet = Readonly<{
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: Factory<SecureScriptPathAction>
        }>
        credential: Readonly<{
            store: Factory<StoreAction>
        }>
        passwordLogin: Readonly<{
            login: ParameterizedFactory<LoginFieldCollector, LoginAction>
        }>
        field: Readonly<{
            loginID: Factory<LoginIDFieldAction>
            password: Factory<PasswordFieldAction>
        }>
    }>
    components: Readonly<{
        href: AppHrefInit

        passwordLogin: PasswordLoginInit

        field: Readonly<{
            loginID: LoginIDFieldInit
            password: PasswordFieldInit
        }>
    }>
}>
export function initPasswordLoginComponentSet(
    factory: PasswordLoginFactorySet,
    param: PasswordLoginParam
): PasswordLoginComponentSet {
    const loginIDField = initLoginIDFieldComponent(factory)
    const passwordField = initPasswordFieldComponent(factory)

    const actions = {
        login: factory.actions.passwordLogin.login({
            loginID: () => collectLoginID(loginIDField),
            password: () => collectPassword(passwordField),
        }),
        store: factory.actions.credential.store(),
        secureScriptPath: factory.actions.application.secureScriptPath(),
    }

    return {
        href: factory.components.href(),
        passwordLogin: factory.components.passwordLogin(actions, param),
        loginIDField,
        passwordField,
    }
}

export type PasswordResetSessionFactorySet = Readonly<{
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: Factory<SecureScriptPathAction>
        }>
        credential: Readonly<{
            store: Factory<StoreAction>
        }>
        passwordReset: Readonly<{
            startSession: ParameterizedFactory<StartSessionFieldCollector, StartSessionAction>
            pollingStatus: Factory<PollingStatusAction>
        }>
        field: Readonly<{
            loginID: Factory<LoginIDFieldAction>
        }>
    }>
    components: Readonly<{
        href: AppHrefInit

        passwordResetSession: PasswordResetSessionInit

        field: Readonly<{
            loginID: LoginIDFieldInit
        }>
    }>
}>
export function initPasswordResetSessionComponentSet(
    factory: PasswordResetSessionFactorySet
): PasswordResetSessionComponentSet {
    const loginIDField = initLoginIDFieldComponent(factory)

    const actions = {
        startSession: factory.actions.passwordReset.startSession({
            loginID: () => collectLoginID(loginIDField),
        }),
        pollingStatus: factory.actions.passwordReset.pollingStatus(),
    }

    return {
        href: factory.components.href(),
        passwordResetSession: factory.components.passwordResetSession(actions),
        loginIDField,
    }
}

export type PasswordResetFactorySet = Readonly<{
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: Factory<SecureScriptPathAction>
        }>
        credential: Readonly<{
            store: Factory<StoreAction>
        }>
        passwordReset: Readonly<{
            reset: ParameterizedFactory<ResetFieldCollector, ResetAction>
        }>
        field: Readonly<{
            loginID: Factory<LoginIDFieldAction>
            password: Factory<PasswordFieldAction>
        }>
    }>
    components: Readonly<{
        href: AppHrefInit

        passwordReset: PasswordResetInit

        field: Readonly<{
            loginID: LoginIDFieldInit
            password: PasswordFieldInit
        }>
    }>
}>
export function initPasswordResetComponentSet(
    factory: PasswordResetFactorySet,
    param: PasswordResetParam
): PasswordResetComponentSet {
    const loginIDField = initLoginIDFieldComponent(factory)
    const passwordField = initPasswordFieldComponent(factory)

    const actions = {
        reset: factory.actions.passwordReset.reset({
            loginID: () => collectLoginID(loginIDField),
            password: () => collectPassword(passwordField),
        }),
        store: factory.actions.credential.store(),
        secureScriptPath: factory.actions.application.secureScriptPath(),
    }

    return {
        href: factory.components.href(),
        passwordReset: factory.components.passwordReset(actions, param),
        loginIDField,
        passwordField,
    }
}

export type LoginIDFieldFactorySet = Readonly<{
    actions: Readonly<{
        field: Readonly<{
            loginID: Factory<LoginIDFieldAction>
        }>
    }>
    components: Readonly<{
        field: Readonly<{
            loginID: LoginIDFieldInit
        }>
    }>
}>
export function initLoginIDFieldComponent(factory: LoginIDFieldFactorySet): LoginIDFieldComponent {
    return factory.components.field.loginID({ loginID: factory.actions.field.loginID() })
}

export type PasswordFieldFactorySet = Readonly<{
    actions: Readonly<{
        field: Readonly<{
            password: Factory<PasswordFieldAction>
        }>
    }>
    components: Readonly<{
        field: Readonly<{
            password: PasswordFieldInit
        }>
    }>
}>
export function initPasswordFieldComponent(factory: PasswordFieldFactorySet): PasswordFieldComponent {
    return factory.components.field.password({ password: factory.actions.field.password() })
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
