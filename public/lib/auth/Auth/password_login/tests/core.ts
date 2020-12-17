import {
    initApplicationAction,
    initStoreCredentialAction,
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

import { PasswordLoginResource } from "../../Login/view"

import { ApplicationActionConfig } from "../../../common/application/infra"
import { PasswordLoginActionConfig } from "../../../login/password_login/infra"
import { AuthCredentialRepository } from "../../../common/credential/infra"

type Config = {
    application: ApplicationActionConfig
    passwordLogin: PasswordLoginActionConfig
}
type Repository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
type Simulator = Readonly<{
    login: LoginSimulator
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
            storeCredential: initStoreCredentialAction(repository.authCredentials),

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
