import { ApiAuthRenew } from "../../../../../z_external/api/auth/renew"

import { initDateClock } from "../../../../../z_infra/clock/date"
import { delayed } from "../../../../../z_infra/delayed/core"
import { initWebTypedStorage } from "../../../../../z_infra/storage/webStorage"
import { initRenewConnectRemoteAccess } from "../../../../login/renew/impl/remote/renew/connect"

import { AuthCredentialStorage } from "../../../../login/renew/impl/repository/authCredential"
import {
    initLastAuthAtConverter,
    initTicketNonceConverter,
} from "../../../../login/renew/impl/repository/converter"

import { initApiCredentialConverter } from "../../../../common/credential/impl/repository/converter"
import { forceRenew, renew, setContinuousRenew } from "../../../../login/renew/impl/core"

import {
    AuthCredentialRepository,
    RenewActionConfig,
    SetContinuousRenewActionConfig,
} from "../../../../login/renew/infra"

import { RenewAction, SetContinuousRenewAction } from "../../../../login/renew/action"

export type AuthCredentialStorageKey = Readonly<{
    ticketNonce: string
    apiCredential: string
    lastAuthAt: string
}>
export function initAuthCredentialStorage(
    key: AuthCredentialStorageKey,
    credentialStorage: Storage
): AuthCredentialStorage {
    return {
        ticketNonce: initWebTypedStorage(credentialStorage, key.ticketNonce, initTicketNonceConverter()),
        apiCredential: initWebTypedStorage(
            credentialStorage,
            key.apiCredential,
            initApiCredentialConverter()
        ),
        lastAuthAt: initWebTypedStorage(credentialStorage, key.lastAuthAt, initLastAuthAtConverter()),
    }
}
export function initRenewAction(
    config: RenewActionConfig,
    authCredentials: AuthCredentialRepository,
    apiAuthRenew: ApiAuthRenew
): RenewAction {
    const infra = {
        authCredentials,
        renew: initRenewConnectRemoteAccess(apiAuthRenew),
        config: config.renew,
        delayed,
        clock: initDateClock(),
    }

    return {
        renew: renew(infra),
        forceRenew: forceRenew(infra),
    }
}
export function initSetContinuousRenewAction(
    config: SetContinuousRenewActionConfig,
    authCredentials: AuthCredentialRepository,
    apiAuthRenew: ApiAuthRenew
): SetContinuousRenewAction {
    const client = initRenewConnectRemoteAccess(apiAuthRenew)

    return {
        setContinuousRenew: setContinuousRenew({
            authCredentials,
            renew: client,
            config: config.setContinuousRenew,
            clock: initDateClock(),
        }),
    }
}
