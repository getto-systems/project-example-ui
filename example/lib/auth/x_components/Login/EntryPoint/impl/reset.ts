import { PasswordResetResource, PasswordResetSessionResource } from "../entryPoint"

import { LoginLinkFactory } from "../../link"

import {
    PasswordResetComponentFactory,
    PasswordResetFormComponentFactory,
    PasswordResetFormMaterial,
    PasswordResetMaterial,
} from "../../passwordReset/component"
import {
    PasswordResetSessionComponentFactory,
    PasswordResetSessionFormComponentFactory,
    PasswordResetSessionFormMaterial,
    PasswordResetSessionMaterial,
} from "../../passwordResetSession/component"

import { ApplicationAction, SecureScriptPathLocationInfo } from "../../../../common/application/action"
import { LoginIDFormFieldAction } from "../../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../../common/field/password/action"
import { SetContinuousRenewAction } from "../../../../login/credentialStore/action"
import {
    PasswordResetAction,
    PasswordResetSessionAction,
    ResetLocationInfo,
} from "../../../../profile/passwordReset/action"
import { FormAction } from "../../../../../sub/getto-form/form/action"

export type PasswordResetSessionFactory = Readonly<{
    link: LoginLinkFactory
    actions: Readonly<{
        application: ApplicationAction
        passwordResetSession: PasswordResetSessionAction
        form: Readonly<{
            core: FormAction
            loginID: LoginIDFormFieldAction
        }>
    }>
    components: Readonly<{
        passwordResetSession: Readonly<{
            core: PasswordResetSessionComponentFactory
            form: PasswordResetSessionFormComponentFactory
        }>
    }>
}>
export function initPasswordResetSessionResource(
    factory: PasswordResetSessionFactory
): PasswordResetSessionResource {
    return {
        passwordResetSession: factory.components.passwordResetSession.core(core()),
        form: factory.components.passwordResetSession.form(form()),
    }

    function core(): PasswordResetSessionMaterial {
        return {
            link: factory.link(),
            startSession: factory.actions.passwordResetSession.startSession(),
            checkStatus: factory.actions.passwordResetSession.checkStatus(),
        }
    }
    function form(): PasswordResetSessionFormMaterial {
        return {
            validation: factory.actions.form.core.validation(),
            history: factory.actions.form.core.history(),
            loginID: factory.actions.form.loginID.field(),
        }
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
export type PasswordResetLocationInfo = Readonly<{
    application: SecureScriptPathLocationInfo
    passwordReset: ResetLocationInfo
}>
export function initPasswordResetResource(
    factory: PasswordResetFactory,
    locationInfo: PasswordResetLocationInfo
): PasswordResetResource {
    return {
        passwordReset: factory.components.passwordReset.core(core()),
        form: factory.components.passwordReset.form(form()),
    }

    function core(): PasswordResetMaterial {
        return {
            link: factory.link(),
            reset: factory.actions.passwordReset.reset(locationInfo.passwordReset),
            setContinuousRenew: factory.actions.setContinuousRenew.setContinuousRenew(),
            secureScriptPath: factory.actions.application.secureScriptPath(locationInfo.application),
        }
    }
    function form(): PasswordResetFormMaterial {
        return {
            validation: factory.actions.form.core.validation(),
            history: factory.actions.form.core.history(),
            loginID: factory.actions.form.loginID.field(),
            password: factory.actions.form.password.field(),
            character: factory.actions.form.password.character(),
            viewer: factory.actions.form.password.viewer(),
        }
    }
}
