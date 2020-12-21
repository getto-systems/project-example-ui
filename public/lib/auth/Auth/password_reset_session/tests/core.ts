import { initApplicationAction, initPasswordResetSessionAction } from "../../Login/tests/core"

import { initLoginLink } from "../../Login/impl/link"
import { initPasswordResetSessionResource, PasswordResetSessionFactory } from "../../Login/impl/core"

import { initPasswordResetSession } from "../impl"
import { initLoginIDField } from "../../field/login_id/impl"

import { loginIDField } from "../../../common/field/login_id/impl/core"

import { SessionSimulator } from "../../../profile/password_reset/impl/client/session/simulate"

import { PasswordResetSessionResource } from "../../Login/view"

import { ApplicationActionConfig } from "../../../common/application/infra"
import { PasswordResetSessionActionConfig } from "../../../profile/password_reset/infra"

export type Config = {
    application: ApplicationActionConfig
    passwordResetSession: PasswordResetSessionActionConfig
}
export type Simulator = Readonly<{
    session: SessionSimulator
}>

export function newPasswordResetSessionResource(
    config: Config,
    simulator: Simulator
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
            passwordResetSession: initPasswordResetSession,

            field: {
                loginID: initLoginIDField,
            },
        },
    }

    return initPasswordResetSessionResource(factory)
}
