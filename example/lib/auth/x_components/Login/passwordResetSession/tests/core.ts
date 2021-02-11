import { initTestApplicationAction, initTestPasswordResetSessionAction } from "../../EntryPoint/tests/core"

import { initLoginLink } from "../../EntryPoint/main/link"
import { initPasswordResetSessionResource, PasswordResetSessionFactory } from "../../EntryPoint/impl/reset"

import { initPasswordResetSessionComponent, initPasswordResetSessionFormComponent } from "../impl"

import { ApplicationActionConfig } from "../../../../common/application/infra"
import {
    GetStatusRemoteAccess,
    PasswordResetSessionActionConfig,
    SendTokenRemoteAccess,
    StartSessionRemoteAccess,
} from "../../../../profile/passwordReset/infra"

import { PasswordResetSessionResource } from "../../EntryPoint/entryPoint"
import { initLoginIDFormFieldAction } from "../../EntryPoint/main/action/form"
import { initFormAction } from "../../../../../sub/getto-form/main/form"

export type PasswordResetSessionConfig = {
    application: ApplicationActionConfig
    passwordResetSession: PasswordResetSessionActionConfig
}
export type PasswordResetSessionRemoteAccess = Readonly<{
    startSession: StartSessionRemoteAccess
    sendToken: SendTokenRemoteAccess
    getStatus: GetStatusRemoteAccess
}>

export function newTestPasswordResetSessionResource(
    config: PasswordResetSessionConfig,
    remote: PasswordResetSessionRemoteAccess
): PasswordResetSessionResource {
    const factory: PasswordResetSessionFactory = {
        link: initLoginLink,
        actions: {
            application: initTestApplicationAction(config.application),

            passwordResetSession: initTestPasswordResetSessionAction(config.passwordResetSession, remote),
            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
            },
        },
        components: {
            passwordResetSession: {
                core: initPasswordResetSessionComponent,
                form: initPasswordResetSessionFormComponent,
            },
        },
    }

    return initPasswordResetSessionResource(factory)
}
