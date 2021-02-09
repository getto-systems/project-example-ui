import {
    initApplicationAction,
    initSetContinuousRenewAction,
    initRenewAction,
    initRenewCredentialLocationInfo,
} from "../../Login/tests/core"

import { initRenewCredentialResource, RenewCredentialFactory } from "../../Login/impl/renew"

import { initRenewCredentialComponent } from "../impl"

import { RenewSimulator } from "../../../login/renew/impl/remote/renew/simulate"

import { Clock } from "../../../../z_infra/clock/infra"
import { ApplicationActionConfig } from "../../../common/application/infra"
import {
    RenewActionConfig,
    SetContinuousRenewActionConfig,
    AuthCredentialRepository,
} from "../../../login/renew/infra"

import { RenewCredentialResource } from "../../Login/entryPoint"

import { RenewCredentialComponent } from "../component"

export type RenewCredentialConfig = {
    application: ApplicationActionConfig
    renew: RenewActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type RenewCredentialRepository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type RenewCredentialSimulator = Readonly<{
    renew: RenewSimulator
}>

export function newRenewCredentialResource(
    currentURL: URL,
    config: RenewCredentialConfig,
    repository: RenewCredentialRepository,
    simulator: RenewCredentialSimulator,
    clock: Clock,
    hook: Setup<RenewCredentialComponent>
): RenewCredentialResource {
    const factory: RenewCredentialFactory = {
        actions: {
            application: initApplicationAction(config.application),
            setContinuousRenew: initSetContinuousRenewAction(
                config.setContinuousRenew,
                repository.authCredentials,
                simulator.renew,
                clock
            ),

            renew: initRenewAction(config.renew, repository.authCredentials, simulator.renew, clock),
        },
        components: {
            renewCredential: initRenewCredentialComponent,
        },
    }

    return initRenewCredentialResource(factory, initRenewCredentialLocationInfo(currentURL), hook)
}

interface Setup<T> {
    (component: T): void
}
