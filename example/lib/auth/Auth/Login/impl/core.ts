import { ApplicationBaseComponent } from "../../../../sub/getto-example/application/impl"

import { LoginLinkFactory } from "../../link"

import {
    LoginView,
    LoginState,
    ViewState,
    RenewCredentialResource,
    PasswordLoginResource,
    PasswordResetSessionResource,
    PasswordResetResource,
} from "../entryPoint"

import {
    RenewCredentialComponentFactory,
    RenewCredentialComponent,
    RenewCredentialMaterial,
} from "../../renewCredential/component"
import { PasswordLoginComponentFactory, PasswordLoginMaterial } from "../../passwordLogin/component"
import {
    PasswordResetSessionComponentFactory,
    PasswordResetSessionMaterial,
} from "../../passwordResetSession/component"
import { PasswordResetComponentFactory, PasswordResetMaterial } from "../../passwordReset/component"
import { LoginIDFieldComponent, LoginIDFieldComponentFactory } from "../../field/loginID/component"
import { PasswordFieldComponent, PasswordFieldComponentFactory } from "../../field/password/component"

import { ApplicationAction, SecureScriptPathCollector } from "../../../common/application/action"
import { RenewAction, SetContinuousRenewAction } from "../../../login/renew/action"

import { PasswordLoginAction } from "../../../login/passwordLogin/action"
import {
    PasswordResetSessionAction,
    PasswordResetAction,
    ResetTokenCollector,
} from "../../../profile/passwordReset/action"

import { LoginIDFieldAction } from "../../../common/field/loginID/action"
import { PasswordFieldAction } from "../../../common/field/password/action"

import { LoginID } from "../../../common/loginID/data"
import { Password } from "../../../common/password/data"
import { LoginFields } from "../../../login/passwordLogin/data"
import { StartSessionFields, ResetFields } from "../../../profile/passwordReset/data"
import { Content, invalidContent, validContent } from "../../../common/field/data"

export class View extends ApplicationBaseComponent<LoginState> implements LoginView {
    collector: LoginViewCollector
    components: LoginResourceFactory

    constructor(collector: LoginViewCollector, components: LoginResourceFactory) {
        super()
        this.collector = collector
        this.components = components
    }

    load(): void {
        this.post({
            type: "renew-credential",
            resource: this.components.renewCredential((renewCredential) => {
                this.hookCredentialStateChange(renewCredential)
            }),
        })
    }
    error(err: string): void {
        this.post({ type: "error", err })
    }

    hookCredentialStateChange(renewCredential: RenewCredentialComponent): void {
        renewCredential.addStateHandler((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.post(this.mapLoginView(this.collector.login.getLoginView()))
                    return
            }
        })
    }
    mapLoginView(loginView: ViewState): LoginState {
        switch (loginView) {
            case "password-login":
                return { type: loginView, resource: this.components.passwordLogin() }
            case "password-reset-session":
                return { type: loginView, resource: this.components.passwordResetSession() }
            case "password-reset":
                return { type: loginView, resource: this.components.passwordReset() }
        }
    }
}

export interface LoginResourceFactory {
    renewCredential(setup: Setup<RenewCredentialComponent>): RenewCredentialResource

    passwordLogin(): PasswordLoginResource
    passwordResetSession(): PasswordResetSessionResource
    passwordReset(): PasswordResetResource
}
export interface LoginViewCollector {
    login: Readonly<{
        getLoginView(): ViewState
    }>
}

export type RenewCredentialFactory = Readonly<{
    actions: Readonly<{
        application: ApplicationAction
        renew: RenewAction
        setContinuousRenew: SetContinuousRenewAction
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
        renew: factory.actions.renew.renew(),
        forceRenew: factory.actions.renew.forceRenew(),
        setContinuousRenew: factory.actions.setContinuousRenew.setContinuousRenew(),
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
        setContinuousRenew: SetContinuousRenewAction
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
        setContinuousRenew: factory.actions.setContinuousRenew.setContinuousRenew(),
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
        passwordResetSession: PasswordResetSessionAction
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
        startSession: factory.actions.passwordResetSession.startSession({
            getFields: () => collectStartSessionFields(fields),
        }),
        checkStatus: factory.actions.passwordResetSession.checkStatus(),
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
        setContinuousRenew: SetContinuousRenewAction
        passwordReset: PasswordResetAction
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
        setContinuousRenew: factory.actions.setContinuousRenew.setContinuousRenew(),
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

interface Post<T> {
    (state: T): void
}
interface Setup<T> {
    (component: T): void
}
