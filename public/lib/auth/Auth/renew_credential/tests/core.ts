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

import { initRenewCredential } from "../impl"

import { RenewSimulator } from "../../../login/renew/impl/client/renew/simulate"

import { ApplicationActionConfig } from "../../../common/application/infra"
import {
    RenewActionConfig,
    SetContinuousRenewActionConfig,
    AuthCredentialRepository,
    Clock,
} from "../../../login/renew/infra"

import { RenewCredentialResource } from "../../Login/view"

export type Config = {
    application: ApplicationActionConfig
    renew: RenewActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type Repository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type Simulator = Readonly<{
    renew: RenewSimulator
}>

export function newRenewCredentialResource(
    currentURL: URL,
    config: Config,
    repository: Repository,
    simulator: Simulator,
    clock: Clock
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
            renewCredential: initRenewCredential,
        },
    }
    const collector: RenewCredentialCollector = initRenewCredentialCollector(currentURL)

    return initRenewCredentialResource(factory, collector, (_component) => {
        // test では特になにもしない
    })
}
