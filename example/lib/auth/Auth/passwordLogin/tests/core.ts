import {
    initApplicationAction,
    initSetContinuousRenewAction,
    initPasswordLoginAction,
    initPasswordLoginLocationInfo,
} from "../../Login/tests/core"

import { initLoginLink } from "../../Login/main/link"

import {
    initPasswordLoginResource,
    PasswordLoginLocationInfo,
    PasswordLoginFactory,
} from "../../Login/impl/login"

import { initPasswordLoginComponent, initPasswordLoginFormComponent } from "../impl"

import { initFormAction } from "../../../../sub/getto-form/main/form"
import { initLoginIDFormFieldAction, initPasswordFormFieldAction } from "../../Login/main/action/form"

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
        },
        components: {
            passwordLogin: { core: initPasswordLoginComponent, form: initPasswordLoginFormComponent },
        },
    }

    return initPasswordLoginResource(factory, initPasswordLoginLocationInfo(currentURL))
}
