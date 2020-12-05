import {
    initApplicationAction,
    initCredentialAction,
    initPasswordLoginAction,
    initPasswordLoginCollector,
} from "../../Login/tests/core"

import { initLoginLink } from "../../Login/impl/link"
import { initPasswordLoginResource } from "../../Login/impl/core"

import { initPasswordLogin } from "../../password_login/impl"

import { initLoginIDField } from "../../field/login_id/impl"
import { initPasswordField } from "../../field/password/impl"

import { loginIDField } from "../../../common/field/login_id/impl/core"
import { passwordField } from "../../../common/field/password/impl/core"

import { RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"
import { LoginSimulator } from "../../../login/password_login/impl/client/login/simulate"

import { PasswordLoginResource } from "../../Login/view"

import { SecureScriptPathHostConfig } from "../../../common/application/infra"
import { LoginTimeConfig } from "../../../login/password_login/infra"
import {
    AuthCredentialRepository,
    RenewTimeConfig,
    SetContinuousRenewTimeConfig,
} from "../../../login/renew/infra"

type Config = {
    host: { secureScriptPath: SecureScriptPathHostConfig }
    time: {
        renew: RenewTimeConfig
        setContinuousRenew: SetContinuousRenewTimeConfig

        login: LoginTimeConfig
    }
}
type Repository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
type Simulator = LoginSimulator & RenewSimulator

export function newPasswordLoginResource(
    currentURL: URL,
    config: Config,
    repository: Repository,
    simulator: Simulator
): PasswordLoginResource {
    const factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(config.host),
            credential: initCredentialAction(config.time, repository, simulator),

            passwordLogin: initPasswordLoginAction(config.time, simulator),

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
    const collector = initPasswordLoginCollector(currentURL)

    return initPasswordLoginResource(factory, collector)
}
