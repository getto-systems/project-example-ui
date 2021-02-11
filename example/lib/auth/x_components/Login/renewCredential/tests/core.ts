import {
    initApplicationAction,
    initSetContinuousRenewAction,
    initRenewAction,
    initRenewCredentialLocationInfo,
} from "../../EntryPoint/tests/core"

import { initRenewCredentialResource, RenewCredentialFactory } from "../../EntryPoint/impl/renew"

import { initRenewCredentialComponent } from "../impl"

import { Clock } from "../../../../../z_infra/clock/infra"
import { ApplicationActionConfig } from "../../../../common/application/infra"
import {
    RenewActionConfig,
    SetContinuousRenewActionConfig,
    AuthCredentialRepository,
    RenewRemoteAccess,
} from "../../../../login/renew/infra"

import { RenewCredentialResource } from "../../EntryPoint/entryPoint"

import { RenewCredentialComponent } from "../component"

export type RenewCredentialConfig = {
    application: ApplicationActionConfig
    renew: RenewActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type RenewCredentialRepository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type RenewCredentialRemoteAccess = Readonly<{
    renew: RenewRemoteAccess
}>

export function newRenewCredentialResource(
    currentURL: URL,
    config: RenewCredentialConfig,
    repository: RenewCredentialRepository,
    remote: RenewCredentialRemoteAccess,
    clock: Clock,
    hook: Setup<RenewCredentialComponent>
): RenewCredentialResource {
    const factory: RenewCredentialFactory = {
        actions: {
            application: initApplicationAction(config.application),
            setContinuousRenew: initSetContinuousRenewAction(
                config.setContinuousRenew,
                repository.authCredentials,
                remote.renew,
                clock
            ),

            renew: initRenewAction(config.renew, repository.authCredentials, remote.renew, clock),
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