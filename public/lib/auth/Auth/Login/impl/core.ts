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
    RenewCredentialMaterial,
} from "../../renew_credential/component"
import { PasswordLoginComponentFactory, PasswordLoginMaterial } from "../../password_login/component"
import {
    PasswordResetSessionComponentFactory,
    PasswordResetSessionMaterial,
} from "../../password_reset_session/component"
import { PasswordResetComponentFactory, PasswordResetMaterial } from "../../password_reset/component"

import { LoginIDFieldComponent, LoginIDFieldComponentFactory } from "../../field/login_id/component"
import { PasswordFieldComponent, PasswordFieldComponentFactory } from "../../field/password/component"

import { ApplicationAction, SecureScriptPathCollector } from "../../../common/application/action"
import { CredentialAction, StoreCredentialAction } from "../../../common/credential/action"
import { Renew, SetContinuousRenew } from "../../../login/renew/action"

import { PasswordLoginAction } from "../../../login/password_login/action"
import {
    StartSession,
    CheckStatus,
    Reset,
    ResetTokenCollector,
} from "../../../profile/password_reset/action"

import { LoginIDFieldAction } from "../../../common/field/login_id/action"
import { PasswordFieldAction } from "../../../common/field/password/action"

import { LoginID } from "../../../common/login_id/data"
import { Password } from "../../../common/password/data"
import { LoginFields } from "../../../login/password_login/data"
import { StartSessionFields, ResetFields } from "../../../profile/password_reset/data"
import { Content, invalidContent, validContent } from "../../../common/field/data"

export type RenewCredentialFactory = Readonly<{
    actions: Readonly<{
        application: ApplicationAction
        // TODO renew に分ける
        credential: Readonly<{
            renew: Renew
            setContinuousRenew: SetContinuousRenew
        }> &
            CredentialAction
    }>
    components: Readonly<{
        renewCredential: RenewCredentialComponentFactory
    }>
}>
export type RenewCredentialCollector = Readonly<{
    application: SecureScriptPathCollector
}>
export function initRenewCredentialResource(
    factory: RenewCredentialFactory,
    collector: RenewCredentialCollector,
    setup: Setup<RenewCredentialComponent>
): RenewCredentialResource {
    const material: RenewCredentialMaterial = {
        renew: factory.actions.credential.renew(),
        setContinuousRenew: factory.actions.credential.setContinuousRenew(),
        loadLastLogin: factory.actions.credential.loadLastLogin(),
        storeAuthCredential: factory.actions.credential.storeAuthCredential(),
        removeAuthCredential: factory.actions.credential.removeAuthCredential(),
        secureScriptPath: factory.actions.application.secureScriptPath(collector.application),
    }

    const renewCredential = factory.components.renewCredential(material)
    setup(renewCredential)

    return {
        renewCredential,
    }
}

export type PasswordLoginFactory = Readonly<{
    link: LoginLinkFactory
    actions: Readonly<{
        application: ApplicationAction
        credential: StoreCredentialAction
        passwordLogin: PasswordLoginAction
        field: LoginIDFieldAction & PasswordFieldAction
    }>
    components: Readonly<{
        passwordLogin: PasswordLoginComponentFactory

        field: Readonly<{
            loginID: LoginIDFieldComponentFactory
            password: PasswordFieldComponentFactory
        }>
    }>
}>
export type PasswordLoginCollector = Readonly<{
    application: SecureScriptPathCollector
}>
export function initPasswordLoginResource(
    factory: PasswordLoginFactory,
    collector: PasswordLoginCollector
): PasswordLoginResource {
    const fields = {
        loginIDField: initLoginIDFieldComponent(factory),
        passwordField: initPasswordFieldComponent(factory),
    }

    const material: PasswordLoginMaterial = {
        link: factory.link(),
        login: factory.actions.passwordLogin.login({
            getFields: () => collectLoginFields(fields),
        }),
        storeAuthCredential: factory.actions.credential.storeAuthCredential(),
        secureScriptPath: factory.actions.application.secureScriptPath(collector.application),
    }

    return {
        passwordLogin: factory.components.passwordLogin(material),
        ...fields,
    }
}

export type PasswordResetSessionFactory = Readonly<{
    link: LoginLinkFactory
    actions: Readonly<{
        application: ApplicationAction
        passwordReset: Readonly<{
            startSession: StartSession
            checkStatus: CheckStatus
        }>
        field: LoginIDFieldAction
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

    const material: PasswordResetSessionMaterial = {
        link: factory.link(),
        startSession: factory.actions.passwordReset.startSession({
            getFields: () => collectStartSessionFields(fields),
        }),
        checkStatus: factory.actions.passwordReset.checkStatus(),
    }

    return {
        passwordResetSession: factory.components.passwordResetSession(material),
        ...fields,
    }
}

export type PasswordResetFactory = Readonly<{
    link: LoginLinkFactory
    actions: Readonly<{
        application: ApplicationAction
        credential: StoreCredentialAction
        passwordReset: Readonly<{
            reset: Reset
        }>
        field: LoginIDFieldAction & PasswordFieldAction
    }>
    components: Readonly<{
        passwordReset: PasswordResetComponentFactory

        field: Readonly<{
            loginID: LoginIDFieldComponentFactory
            password: PasswordFieldComponentFactory
        }>
    }>
}>
export type PasswordResetCollector = Readonly<{
    application: SecureScriptPathCollector
    passwordReset: ResetTokenCollector
}>
export function initPasswordResetResource(
    factory: PasswordResetFactory,
    collector: PasswordResetCollector
): PasswordResetResource {
    const fields = {
        loginIDField: initLoginIDFieldComponent(factory),
        passwordField: initPasswordFieldComponent(factory),
    }

    const material: PasswordResetMaterial = {
        link: factory.link(),
        reset: factory.actions.passwordReset.reset({
            getFields: () => collectResetFields(fields),
            ...collector.passwordReset,
        }),
        storeAuthCredential: factory.actions.credential.storeAuthCredential(),
        secureScriptPath: factory.actions.application.secureScriptPath(collector.application),
    }

    return {
        passwordReset: factory.components.passwordReset(material),
        ...fields,
    }
}

export type LoginIDFieldFactory = Readonly<{
    actions: Readonly<{
        field: LoginIDFieldAction
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
        field: PasswordFieldAction
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
