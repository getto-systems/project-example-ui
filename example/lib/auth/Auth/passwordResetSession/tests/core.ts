import { initApplicationAction, initPasswordResetSessionAction } from "../../Login/tests/core"

import { initLoginLink } from "../../Login/main/link"
import { initPasswordResetSessionResource, PasswordResetSessionFactory } from "../../Login/impl/core"

import { initPasswordResetSessionComponent } from "../impl"
import { initLoginIDFieldComponent } from "../../field/loginID/impl"

import { loginIDField } from "../../../common/field/loginID/impl/core"

import { SessionSimulator } from "../../../profile/passwordReset/impl/client/session/simulate"

import { ApplicationActionConfig } from "../../../common/application/infra"
import { PasswordResetSessionActionConfig } from "../../../profile/passwordReset/infra"

import { PasswordResetSessionResource } from "../../Login/entryPoint"

export type PasswordResetSessionConfig = {
    application: ApplicationActionConfig
    passwordResetSession: PasswordResetSessionActionConfig
}
export type PasswordResetSessionSimulator = Readonly<{
    session: SessionSimulator
}>

export function newPasswordResetSessionResource(
    config: PasswordResetSessionConfig,
    simulator: PasswordResetSessionSimulator
): PasswordResetSessionResource {
    const factory: PasswordResetSessionFactory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(config.application),

            passwordResetSession: initPasswordResetSessionAction(
                config.passwordResetSession,
                simulator.session
            ),

            field: {
                loginID: loginIDField,
            },
        },
        components: {
            passwordResetSession: initPasswordResetSessionComponent,

            field: {
                loginID: initLoginIDFieldComponent,
            },
        },
    }

    return initPasswordResetSessionResource(factory)
}
