import { initTestApplicationAction } from "../../../../common/application/tests/application"
import {
    initTestRenewAction,
    initTestSetContinuousRenewAction,
} from "../../../../login/credentialStore/tests/renew"

import { initLoginLocationInfo } from "../../common/impl/location"

import { initRenewCredentialResource } from "../impl/resource"

import { Clock } from "../../../../../z_infra/clock/infra"
import { ApplicationActionConfig } from "../../../../common/application/infra"
import {
    RenewActionConfig,
    SetContinuousRenewActionConfig,
    AuthCredentialRepository,
    RenewRemoteAccess,
} from "../../../../login/credentialStore/infra"

import { RenewCredentialResource } from "../resource"

import { RenewCredentialComponent } from "../component"

export type RenewCredentialTestConfig = {
    application: ApplicationActionConfig
    renew: RenewActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type RenewCredentialTestRepository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type RenewCredentialTestRemoteAccess = Readonly<{
    renew: RenewRemoteAccess
}>

export function newRenewCredentialTestResource(
    currentURL: URL,
    config: RenewCredentialTestConfig,
    repository: RenewCredentialTestRepository,
    remote: RenewCredentialTestRemoteAccess,
    clock: Clock,
    hook: Setup<RenewCredentialComponent>
): RenewCredentialResource {
    return initRenewCredentialResource(hook, initLoginLocationInfo(currentURL), {
        application: initTestApplicationAction(config.application),
        renew: initTestRenewAction(config.renew, repository.authCredentials, remote.renew, clock),
        setContinuousRenew: initTestSetContinuousRenewAction(
            config.setContinuousRenew,
            repository.authCredentials,
            remote.renew,
            clock
        ),
    })
}

interface Setup<T> {
    (component: T): void
}
