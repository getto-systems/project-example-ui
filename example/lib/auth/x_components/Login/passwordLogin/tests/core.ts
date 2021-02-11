import {
    initTestApplicationAction,
    initTestSetContinuousRenewAction,
    initTestPasswordLoginAction,
    initPasswordLoginLocationInfo,
} from "../../EntryPoint/tests/core"

import { initLoginLink } from "../../EntryPoint/main/link"

import { initPasswordLoginResource, PasswordLoginFactory } from "../../EntryPoint/impl/login"

import { initPasswordLoginComponent, initPasswordLoginFormComponent } from "../impl"

import { initFormAction } from "../../../../../sub/getto-form/main/form"
import { initLoginIDFormFieldAction, initPasswordFormFieldAction } from "../../EntryPoint/main/action/form"

import { Clock } from "../../../../../z_infra/clock/infra"
import { ApplicationActionConfig } from "../../../../common/application/infra"
import { LoginRemoteAccess, PasswordLoginActionConfig } from "../../../../login/passwordLogin/infra"
import { SetContinuousRenewActionConfig, AuthCredentialRepository, RenewRemoteAccess } from "../../../../login/credentialStore/infra"

import { PasswordLoginResource } from "../../EntryPoint/entryPoint"

export type PasswordLoginConfig = {
    application: ApplicationActionConfig
    passwordLogin: PasswordLoginActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type PasswordLoginRepository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type PasswordLoginRemoteAccess = Readonly<{
    login: LoginRemoteAccess
    renew: RenewRemoteAccess
}>

export function newTestPasswordLoginResource(
    currentURL: URL,
    config: PasswordLoginConfig,
    repository: PasswordLoginRepository,
    simulator: PasswordLoginRemoteAccess,
    clock: Clock
): PasswordLoginResource {
    const factory: PasswordLoginFactory = {
        link: initLoginLink,
        actions: {
            application: initTestApplicationAction(config.application),
            setContinuousRenew: initTestSetContinuousRenewAction(
                config.setContinuousRenew,
                repository.authCredentials,
                simulator.renew,
                clock
            ),

            passwordLogin: initTestPasswordLoginAction(config.passwordLogin, simulator.login),

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
