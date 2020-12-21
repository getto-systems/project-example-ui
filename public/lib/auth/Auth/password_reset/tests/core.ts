import {
    initApplicationAction,
    initSetContinuousRenewAction,
    initPasswordResetAction,
    initPasswordResetCollector,
} from "../../Login/tests/core"

import { initLoginLink } from "../../Login/impl/link"
import {
    initPasswordResetResource,
    PasswordResetCollector,
    PasswordResetFactory,
} from "../../Login/impl/core"

import { initPasswordReset } from "../impl"
import { initLoginIDField } from "../../field/login_id/impl"
import { initPasswordField } from "../../field/password/impl"

import { loginIDField } from "../../../common/field/login_id/impl/core"
import { passwordField } from "../../../common/field/password/impl/core"

import { ResetSimulator } from "../../../profile/password_reset/impl/client/reset/simulate"
import { RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"

import { PasswordResetResource } from "../../Login/view"

import { ApplicationActionConfig } from "../../../common/application/infra"
import { PasswordResetActionConfig } from "../../../profile/password_reset/infra"
import { SetContinuousRenewActionConfig, AuthCredentialRepository } from "../../../login/renew/infra"

export type Config = {
    application: ApplicationActionConfig
    passwordReset: PasswordResetActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type Repository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type Simulator = Readonly<{
    reset: ResetSimulator
    renew: RenewSimulator
}>

export function newPasswordResetResource(
    currentURL: URL,
    config: Config,
    repository: Repository,
    simulator: Simulator
): PasswordResetResource {
    const factory: PasswordResetFactory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(config.application),
            setContinuousRenew: initSetContinuousRenewAction(
                config.setContinuousRenew,
                repository.authCredentials,
                simulator.renew
            ),

            passwordReset: initPasswordResetAction(config.passwordReset, simulator.reset),

            field: {
                loginID: loginIDField,
                password: passwordField,
            },
        },
        components: {
            passwordReset: initPasswordReset,

            field: {
                loginID: initLoginIDField,
                password: initPasswordField,
            },
        },
    }
    const collector: PasswordResetCollector = initPasswordResetCollector(currentURL)

    return initPasswordResetResource(factory, collector)
}
