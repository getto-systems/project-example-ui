import { PasswordResetResource, PasswordResetSessionResource } from "../entryPoint"

import { LoginLinkFactory } from "../../link"

import { LoginIDFieldComponent, LoginIDFieldComponentFactory } from "../../field/loginID/component"
import {
    PasswordResetComponentFactory,
    PasswordResetFormComponentFactory,
    PasswordResetFormMaterial,
    PasswordResetMaterial,
} from "../../passwordReset/component"
import {
    PasswordResetSessionComponentFactory,
    PasswordResetSessionMaterial,
} from "../../passwordResetSession/component"

import { ApplicationAction, SecureScriptPathCollector } from "../../../common/application/action"
import { LoginIDFieldAction, LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../common/field/password/action"
import { SetContinuousRenewAction } from "../../../login/renew/action"
import {
    PasswordResetAction,
    PasswordResetSessionAction,
    ResetCollector,
} from "../../../profile/passwordReset/action"
import { FormAction } from "../../../../sub/getto-form/action/action"

import { Content, invalidContent, validContent } from "../../../common/field/data"
import { LoginID } from "../../../common/loginID/data"
import { StartSessionFields } from "../../../profile/passwordReset/data"

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
        form: Readonly<{
            core: FormAction
            loginID: LoginIDFormFieldAction
            password: PasswordFormFieldAction
        }>
    }>
    components: Readonly<{
        passwordReset: Readonly<{
            core: PasswordResetComponentFactory
            form: PasswordResetFormComponentFactory
        }>
    }>
}>
export type PasswordResetCollector = Readonly<{
    application: SecureScriptPathCollector
    passwordReset: ResetCollector
}>
export function initPasswordResetResource(
    factory: PasswordResetFactory,
    collector: PasswordResetCollector
): PasswordResetResource {
    return {
        passwordReset: factory.components.passwordReset.core(core()),
        form: factory.components.passwordReset.form(form()),
    }

    function core(): PasswordResetMaterial {
        return {
            link: factory.link(),
            reset: factory.actions.passwordReset.reset(collector.passwordReset),
            setContinuousRenew: factory.actions.setContinuousRenew.setContinuousRenew(),
            secureScriptPath: factory.actions.application.secureScriptPath(collector.application),
        }
    }
    function form(): PasswordResetFormMaterial {
        return {
            validation: factory.actions.form.core.validation(),
            history: factory.actions.form.core.history(),
            loginID: factory.actions.form.loginID.field(),
            password: factory.actions.form.password.field(),
            checker: factory.actions.form.password.character(),
            viewer: factory.actions.form.password.viewer(),
        }
    }
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

function collectLoginID(loginIDField: LoginIDFieldComponent): Promise<Content<LoginID>> {
    return new Promise((resolve) => {
        loginIDField.validate((event) => {
            resolve(event.content)
        })
    })
}
