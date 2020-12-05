import { LoginLinkFactory } from "../../link"

import {
    RenewCredentialResource,
    PasswordLoginResource,
    PasswordResetSessionResource,
    PasswordResetResource,
} from "../view"

import {
    RenewCredentialComponentFactory,
    RenewCredentialComponent,
} from "../../renew_credential/component"
import { PasswordLoginComponentFactory } from "../../password_login/component"
import { PasswordResetSessionComponentFactory } from "../../password_reset_session/component"
import { PasswordResetComponentFactory } from "../../password_reset/component"

import { LoginIDFieldComponent, LoginIDFieldComponentFactory } from "../../field/login_id/component"
import { PasswordFieldComponent, PasswordFieldComponentFactory } from "../../field/password/component"

import { SecureScriptPath, SecureScriptPathCollector } from "../../../common/application/action"
import { Renew, SetContinuousRenew, Store } from "../../../login/renew/action"

import { Login } from "../../../login/password_login/action"
import { StartSession, CheckStatus, Reset, ResetTokenCollector } from "../../../profile/password_reset/action"

import { LoginIDField } from "../../../common/field/login_id/action"
import { PasswordField } from "../../../common/field/password/action"

import { LoginID } from "../../../common/login_id/data"
import { Password } from "../../../common/password/data"
import { LoginFields } from "../../../login/password_login/data"
import { StartSessionFields, ResetFields } from "../../../profile/password_reset/data"
import { Content, invalidContent, validContent } from "../../../common/field/data"

export type RenewCredentialFactory = Readonly<{
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: SecureScriptPath
        }>
        credential: Readonly<{
            renew: Renew
            setContinuousRenew: SetContinuousRenew
        }>
    }>
    components: Readonly<{
        renewCredential: RenewCredentialComponentFactory
    }>
}>
export type RenewCredentialCollectorSet = Readonly<{
    application: SecureScriptPathCollector
}>
export function initRenewCredentialResource(
    factory: RenewCredentialFactory,
    collector: RenewCredentialCollectorSet,
    setup: Setup<RenewCredentialComponent>
): RenewCredentialResource {
    const actions = {
        renew: factory.actions.credential.renew(),
        setContinuousRenew: factory.actions.credential.setContinuousRenew(),
        secureScriptPath: factory.actions.application.secureScriptPath(collector.application),
    }

    const renewCredential = factory.components.renewCredential(actions)
    setup(renewCredential)

    return {
        renewCredential,
    }
}

export type PasswordLoginFactory = Readonly<{
    link: LoginLinkFactory
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: SecureScriptPath
        }>
        credential: Readonly<{
            store: Store
        }>
        passwordLogin: Readonly<{
            login: Login
        }>
        field: Readonly<{
            loginID: LoginIDField
            password: PasswordField
        }>
    }>
    components: Readonly<{
        passwordLogin: PasswordLoginComponentFactory

        field: Readonly<{
            loginID: LoginIDFieldComponentFactory
            password: PasswordFieldComponentFactory
        }>
    }>
}>
export type PasswordLoginCollectorSet = Readonly<{
    application: SecureScriptPathCollector
}>
export function initPasswordLoginResource(
    factory: PasswordLoginFactory,
    collector: PasswordLoginCollectorSet
): PasswordLoginResource {
    const fields = {
        loginIDField: initLoginIDFieldComponent(factory),
        passwordField: initPasswordFieldComponent(factory),
    }

    const actions = {
        link: factory.link(),
        login: factory.actions.passwordLogin.login({
            getFields: () => collectLoginFields(fields),
        }),
        store: factory.actions.credential.store(),
        secureScriptPath: factory.actions.application.secureScriptPath(collector.application),
    }

    return {
        passwordLogin: factory.components.passwordLogin(actions),
        ...fields,
    }
}

export type PasswordResetSessionFactory = Readonly<{
    link: LoginLinkFactory
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: SecureScriptPath
        }>
        credential: Readonly<{
            store: Store
        }>
        passwordReset: Readonly<{
            startSession: StartSession
            checkStatus: CheckStatus
        }>
        field: Readonly<{
            loginID: LoginIDField
        }>
    }>
    components: Readonly<{
        passwordResetSession: PasswordResetSessionComponentFactory

        field: Readonly<{
            loginID: LoginIDFieldComponentFactory
        }>
    }>
}>
export function initPasswordResetSessionResource(
    factory: PasswordResetSessionFactory
): PasswordResetSessionResource {
    const fields = { loginIDField: initLoginIDFieldComponent(factory) }

    const actions = {
        link: factory.link(),
        startSession: factory.actions.passwordReset.startSession({
            getFields: () => collectStartSessionFields(fields),
        }),
        checkStatus: factory.actions.passwordReset.checkStatus(),
    }

    return {
        passwordResetSession: factory.components.passwordResetSession(actions),
        ...fields,
    }
}

export type PasswordResetFactory = Readonly<{
    link: LoginLinkFactory
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: SecureScriptPath
        }>
        credential: Readonly<{
            store: Store
        }>
        passwordReset: Readonly<{
            reset: Reset
        }>
        field: Readonly<{
            loginID: LoginIDField
            password: PasswordField
        }>
    }>
    components: Readonly<{
        passwordReset: PasswordResetComponentFactory

        field: Readonly<{
            loginID: LoginIDFieldComponentFactory
            password: PasswordFieldComponentFactory
        }>
    }>
}>
export type PasswordResetCollectorSet = Readonly<{
    application: SecureScriptPathCollector
    passwordReset: ResetTokenCollector
}>
export function initPasswordResetResource(
    factory: PasswordResetFactory,
    collector: PasswordResetCollectorSet
): PasswordResetResource {
    const fields = {
        loginIDField: initLoginIDFieldComponent(factory),
        passwordField: initPasswordFieldComponent(factory),
    }

    const actions = {
        link: factory.link(),
        reset: factory.actions.passwordReset.reset({
            getFields: () => collectResetFields(fields),
            ...collector.passwordReset,
        }),
        store: factory.actions.credential.store(),
        secureScriptPath: factory.actions.application.secureScriptPath(collector.application),
    }

    return {
        passwordReset: factory.components.passwordReset(actions),
        ...fields,
    }
}

export type LoginIDFieldFactory = Readonly<{
    actions: Readonly<{
        field: Readonly<{
            loginID: LoginIDField
        }>
    }>
    components: Readonly<{
        field: Readonly<{
            loginID: LoginIDFieldComponentFactory
        }>
    }>
}>
export function initLoginIDFieldComponent(factory: LoginIDFieldFactory): LoginIDFieldComponent {
    return factory.components.field.loginID({ loginID: factory.actions.field.loginID() })
}

export type PasswordFieldFactory = Readonly<{
    actions: Readonly<{
        field: Readonly<{
            password: PasswordField
        }>
    }>
    components: Readonly<{
        field: Readonly<{
            password: PasswordFieldComponentFactory
        }>
    }>
}>
export function initPasswordFieldComponent(factory: PasswordFieldFactory): PasswordFieldComponent {
    return factory.components.field.password({ password: factory.actions.field.password() })
}

type LoginFieldComponents = Readonly<{
    loginIDField: LoginIDFieldComponent
    passwordField: PasswordFieldComponent
}>

async function collectLoginFields(fields: LoginFieldComponents): Promise<Content<LoginFields>> {
    const loginID = await collectLoginID(fields.loginIDField)
    const password = await collectPassword(fields.passwordField)

    if (!loginID.valid || !password.valid) {
        return invalidContent()
    }
    return validContent({
        loginID: loginID.content,
        password: password.content,
    })
}

type StartSessionFieldComponents = Readonly<{
    loginIDField: LoginIDFieldComponent
}>

async function collectStartSessionFields(
    fields: StartSessionFieldComponents
): Promise<Content<StartSessionFields>> {
    const loginID = await collectLoginID(fields.loginIDField)

    if (!loginID.valid) {
        return invalidContent()
    }
    return validContent({
        loginID: loginID.content,
    })
}

type ResetFieldComponents = Readonly<{
    loginIDField: LoginIDFieldComponent
    passwordField: PasswordFieldComponent
}>

async function collectResetFields(fields: ResetFieldComponents): Promise<Content<ResetFields>> {
    const loginID = await collectLoginID(fields.loginIDField)
    const password = await collectPassword(fields.passwordField)

    if (!loginID.valid || !password.valid) {
        return invalidContent()
    }
    return validContent({
        loginID: loginID.content,
        password: password.content,
    })
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
