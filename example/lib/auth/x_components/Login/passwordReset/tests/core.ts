import { initTestApplicationAction } from "../../../../common/application/tests/application"
import { initTestSetContinuousRenewAction } from "../../../../login/credentialStore/tests/renew"
import { initTestPasswordResetAction } from "../../../../profile/passwordReset/tests/reset"

import { initLoginLink } from "../../EntryPoint/main/link"
import { initLoginLocationInfo } from "../../common/impl/location"

import { initFormAction } from "../../../../../sub/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../common/field/password/main/password"

import { Clock } from "../../../../../z_infra/clock/infra"
import { ApplicationActionConfig } from "../../../../common/application/infra"
import { PasswordResetActionConfig, ResetRemoteAccess } from "../../../../profile/passwordReset/infra"
import {
    SetContinuousRenewActionConfig,
    AuthCredentialRepository,
    RenewRemoteAccess,
} from "../../../../login/credentialStore/infra"

import { PasswordResetResource } from "../resource"
import { initPasswordResetResource } from "../impl/resource"

export type PasswordResetTestConfig = {
    application: ApplicationActionConfig
    passwordReset: PasswordResetActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type PasswordResetTestRepository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type PasswordResetTestRemoteAccess = Readonly<{
    reset: ResetRemoteAccess
    renew: RenewRemoteAccess
}>

export function newPasswordResetTestResource(
    currentURL: URL,
    config: PasswordResetTestConfig,
    repository: PasswordResetTestRepository,
    remote: PasswordResetTestRemoteAccess,
    clock: Clock
): PasswordResetResource {
    return initPasswordResetResource(
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
            reset: initTestPasswordResetAction(config.passwordReset, remote.reset),
        }
    )
}
