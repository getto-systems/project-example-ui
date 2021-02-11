import { initLoginLink } from "../../EntryPoint/main/link"

import { initPasswordResetSessionResource } from "../impl/resource"

import { initLoginIDFormFieldAction } from "../../../../common/field/loginID/main/loginID"
import { initFormAction } from "../../../../../sub/getto-form/main/form"
import { initTestApplicationAction } from "../../../../common/application/tests/application"
import { initTestPasswordResetSessionAction } from "../../../../profile/passwordReset/tests/session"

import { ApplicationActionConfig } from "../../../../common/application/infra"
import {
    GetStatusRemoteAccess,
    PasswordResetSessionActionConfig,
    SendTokenRemoteAccess,
    StartSessionRemoteAccess,
} from "../../../../profile/passwordReset/infra"

import { PasswordResetSessionResource } from "../resource"

export type PasswordResetSessionTestConfig = {
    application: ApplicationActionConfig
    passwordResetSession: PasswordResetSessionActionConfig
}
export type PasswordResetSessionTestRemoteAccess = Readonly<{
    startSession: StartSessionRemoteAccess
    sendToken: SendTokenRemoteAccess
    getStatus: GetStatusRemoteAccess
}>

export function newPasswordResetSessionTestResource(
    config: PasswordResetSessionTestConfig,
    remote: PasswordResetSessionTestRemoteAccess
): PasswordResetSessionResource {
    return initPasswordResetSessionResource(
        {
            link: initLoginLink,
            application: initTestApplicationAction(config.application),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
            },
        },
        {
            resetSession: initTestPasswordResetSessionAction(config.passwordResetSession, remote),
        }
    )
}
