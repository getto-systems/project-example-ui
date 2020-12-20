import {
    initApplicationAction,
    initSetContinuousRenewAction,
    initPasswordLoginAction,
    initPasswordLoginCollector,
} from "../../Login/tests/core"

import { initLoginLink } from "../../Login/impl/link"
import {
    initPasswordLoginResource,
    PasswordLoginCollector,
    PasswordLoginFactory,
} from "../../Login/impl/core"

import { initPasswordLogin } from "../../password_login/impl"
import { initLoginIDField } from "../../field/login_id/impl"
import { initPasswordField } from "../../field/password/impl"

import { loginIDField } from "../../../common/field/login_id/impl/core"
import { passwordField } from "../../../common/field/password/impl/core"

import { LoginSimulator } from "../../../login/password_login/impl/client/login/simulate"
import { RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"

import { PasswordLoginResource } from "../../Login/view"

import { ApplicationActionConfig } from "../../../common/application/infra"
import { PasswordLoginActionConfig } from "../../../login/password_login/infra"
import { AuthCredentialRepository } from "../../../common/credential/infra"
import { SetContinuousRenewActionConfig } from "../../../login/renew/infra"

export type Config = {
    application: ApplicationActionConfig
    passwordLogin: PasswordLoginActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type Repository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type Simulator = Readonly<{
    login: LoginSimulator
    renew: RenewSimulator
}>

export function newPasswordLoginResource(
    currentURL: URL,
    config: Config,
    repository: Repository,
    simulator: Simulator
): PasswordLoginResource {
    const factory: PasswordLoginFactory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(config.application),
            setContinuousRenew: initSetContinuousRenewAction(
                config.setContinuousRenew,
                repository.authCredentials,
                simulator.renew
            ),

            passwordLogin: initPasswordLoginAction(config.passwordLogin, simulator.login),

            field: {
                loginID: loginIDField,
                password: passwordField,
            },
        },
        components: {
            passwordLogin: initPasswordLogin,

            field: {
                loginID: initLoginIDField,
                password: initPasswordField,
            },
        },
    }
    const collector: PasswordLoginCollector = initPasswordLoginCollector(currentURL)

    return initPasswordLoginResource(factory, collector)
}
