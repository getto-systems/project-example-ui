import { initTestApplicationAction } from "../../../../common/application/tests/application"
import { initTestSetContinuousRenewAction } from "../../../../login/credentialStore/tests/renew"
import { initTestPasswordLoginAction } from "../../../../login/passwordLogin/tests/login"

import { initLoginLink } from "../../EntryPoint/main/link"
import { initLoginLocationInfo } from "../../common/impl/location"

import { initPasswordLoginResource } from "../impl/resource"

import { initFormAction } from "../../../../../sub/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../common/field/password/main/password"

import { Clock } from "../../../../../z_infra/clock/infra"
import { ApplicationActionConfig } from "../../../../common/application/infra"
import { LoginRemoteAccess, PasswordLoginActionConfig } from "../../../../login/passwordLogin/infra"
import {
    SetContinuousRenewActionConfig,
    AuthCredentialRepository,
    RenewRemoteAccess,
} from "../../../../login/credentialStore/infra"

import { PasswordLoginResource } from "../resource"

export type PasswordLoginTestConfig = {
    application: ApplicationActionConfig
    passwordLogin: PasswordLoginActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type PasswordLoginTestRepository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type PasswordLoginTestRemoteAccess = Readonly<{
    login: LoginRemoteAccess
    renew: RenewRemoteAccess
}>

export function newPasswordLoginTestResource(
    currentURL: URL,
    config: PasswordLoginTestConfig,
    repository: PasswordLoginTestRepository,
    remote: PasswordLoginTestRemoteAccess,
    clock: Clock
): PasswordLoginResource {
    return initPasswordLoginResource(
        initLoginLocationInfo(currentURL),
        {
            link: initLoginLink,
            application: initTestApplicationAction(config.application),
            setContinuousRenew: initTestSetContinuousRenewAction(
                config.setContinuousRenew,
                repository.authCredentials,
                remote.renew,
                clock
            ),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },
        },
        {
            login: initTestPasswordLoginAction(config.passwordLogin, remote.login),
        }
    )
}
