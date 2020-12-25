import {
    initApplicationAction,
    initSetContinuousRenewAction,
    initRenewAction,
    initRenewCredentialCollector,
} from "../../Login/tests/core"

import {
    initRenewCredentialResource,
    RenewCredentialCollector,
    RenewCredentialFactory,
} from "../../Login/impl/core"

import { initRenewCredentialComponent } from "../impl"

import { RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"

import { ApplicationActionConfig } from "../../../common/application/infra"
import {
    RenewActionConfig,
    SetContinuousRenewActionConfig,
    AuthCredentialRepository,
    Clock,
} from "../../../login/renew/infra"

import { RenewCredentialResource } from "../../Login/view"
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
    const collector: RenewCredentialCollector = initRenewCredentialCollector(currentURL)

    return initRenewCredentialResource(factory, collector, hook)
}

interface Setup<T> {
    (component: T): void
}
