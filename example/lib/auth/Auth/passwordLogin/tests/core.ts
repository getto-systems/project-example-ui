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

import { initPasswordLoginComponent, initPasswordLoginFormComponent } from "../impl"
import { initLoginIDFieldComponent } from "../../field/loginID/impl"
import { initPasswordFieldComponent } from "../../field/password/impl"

import { initFormAction } from "../../../../sub/getto-form/main/form"
import { initLoginIDFormFieldAction, initPasswordFormFieldAction } from "../../Login/main/action/form"

import { loginIDField } from "../../../common/field/loginID/impl/core"
import { passwordField } from "../../../common/field/password/impl/core"

import { LoginSimulator } from "../../../login/passwordLogin/impl/remote/login/simulate"
import { RenewSimulator } from "../../../login/renew/impl/remote/renew/simulate"

import { Clock } from "../../../../z_infra/clock/infra"
import { ApplicationActionConfig } from "../../../common/application/infra"
import { PasswordLoginActionConfig } from "../../../login/passwordLogin/infra"
import { SetContinuousRenewActionConfig, AuthCredentialRepository } from "../../../login/renew/infra"

import { PasswordLoginResource } from "../../Login/entryPoint"

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

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },

            field: {
                loginID: loginIDField,
                password: passwordField,
            },
        },
        components: {
            passwordLogin: { core: initPasswordLoginComponent, form: initPasswordLoginFormComponent },

            field: {
                loginID: initLoginIDFieldComponent,
                password: initPasswordFieldComponent,
            },
        },
    }
    const collector: PasswordLoginCollector = initPasswordLoginCollector(currentURL)

    return initPasswordLoginResource(factory, collector)
}
