import {
    initApplicationAction,
    initSetContinuousRenewAction,
    initPasswordResetAction,
    initPasswordResetLocationInfo,
} from "../../Login/tests/core"

import { initLoginLink } from "../../Login/main/link"
import { initPasswordResetResource, PasswordResetFactory } from "../../Login/impl/reset"

import { initPasswordResetComponent, initPasswordResetFormComponent } from "../impl"
import { initFormAction } from "../../../../sub/getto-form/main/form"
import { initLoginIDFormFieldAction, initPasswordFormFieldAction } from "../../Login/main/action/form"

import { ResetSimulator } from "../../../profile/passwordReset/impl/remote/reset/simulate"

import { Clock } from "../../../../z_infra/clock/infra"
import { ApplicationActionConfig } from "../../../common/application/infra"
import { PasswordResetActionConfig } from "../../../profile/passwordReset/infra"
import {
    SetContinuousRenewActionConfig,
    AuthCredentialRepository,
    RenewRemoteAccess,
} from "../../../login/renew/infra"

import { PasswordResetResource } from "../../Login/entryPoint"

export type PasswordResetConfig = {
    application: ApplicationActionConfig
    passwordReset: PasswordResetActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type PasswordResetRepository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type PasswordResetSimulator = Readonly<{
    reset: ResetSimulator
    renew: RenewRemoteAccess
}>

export function newPasswordResetResource(
    currentURL: URL,
    config: PasswordResetConfig,
    repository: PasswordResetRepository,
    simulator: PasswordResetSimulator,
    clock: Clock
): PasswordResetResource {
    const factory: PasswordResetFactory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(config.application),
            setContinuousRenew: initSetContinuousRenewAction(
                config.setContinuousRenew,
                repository.authCredentials,
                simulator.renew,
                clock
            ),

            passwordReset: initPasswordResetAction(config.passwordReset, simulator.reset),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },
        },
        components: {
            passwordReset: { core: initPasswordResetComponent, form: initPasswordResetFormComponent },
        },
    }

    return initPasswordResetResource(factory, initPasswordResetLocationInfo(currentURL))
}
