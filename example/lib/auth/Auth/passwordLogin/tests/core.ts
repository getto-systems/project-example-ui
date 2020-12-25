import {
    initApplicationAction,
    initSetContinuousRenewAction,
    initPasswordLoginAction,
    initPasswordLoginCollector,
} from "../../Login/tests/core"

import { initLoginLink } from "../../Login/main/link"
import {
    initPasswordLoginResource,
    PasswordLoginCollector,
    PasswordLoginFactory,
} from "../../Login/impl/core"

import { initPasswordLogin } from "../impl"
import { initLoginIDField } from "../../field/loginID/impl"
import { initPasswordField } from "../../field/password/impl"

import { loginIDField } from "../../../common/field/loginID/impl/core"
import { passwordField } from "../../../common/field/password/impl/core"

import { LoginSimulator } from "../../../login/passwordLogin/impl/client/login/simulate"
import { RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"

import { ApplicationActionConfig } from "../../../common/application/infra"
import { PasswordLoginActionConfig } from "../../../login/passwordLogin/infra"
import {
    SetContinuousRenewActionConfig,
    AuthCredentialRepository,
    Clock,
} from "../../../login/renew/infra"

import { PasswordLoginResource } from "../../Login/view"

export type PasswordLoginConfig = {
    application: ApplicationActionConfig
    passwordLogin: PasswordLoginActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type PasswordLoginRepository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type PasswordLoginSimulator = Readonly<{
    login: LoginSimulator
    renew: RenewSimulator
}>

export function newPasswordLoginResource(
    currentURL: URL,
    config: PasswordLoginConfig,
    repository: PasswordLoginRepository,
    simulator: PasswordLoginSimulator,
    clock: Clock
): PasswordLoginResource {
    const factory: PasswordLoginFactory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(config.application),
            setContinuousRenew: initSetContinuousRenewAction(
                config.setContinuousRenew,
                repository.authCredentials,
                simulator.renew,
                clock
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
