import { initApplicationAction, initPasswordResetSessionAction } from "../../Login/tests/core"

import { initLoginLink } from "../../Login/main/link"
import { initPasswordResetSessionResource, PasswordResetSessionFactory } from "../../Login/impl/reset"

import { initPasswordResetSessionComponent, initPasswordResetSessionFormComponent } from "../impl"

import { SessionSimulator } from "../../../profile/passwordReset/impl/remote/session/simulate"

import { ApplicationActionConfig } from "../../../common/application/infra"
import { PasswordResetSessionActionConfig } from "../../../profile/passwordReset/infra"

import { PasswordResetSessionResource } from "../../Login/entryPoint"
import { initLoginIDFormFieldAction } from "../../Login/main/action/form"
import { initFormAction } from "../../../../sub/getto-form/main/form"

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
