import { AuthClient } from "../../../../../z_external/api/authClient"

import { initDateClock } from "../../../../../z_infra/clock/date"
import { delayed } from "../../../../../z_infra/delayed/core"
import { initWebTypedStorage } from "../../../../../z_infra/storage/webStorage"

import { initFetchRenewClient } from "../../../../login/renew/impl/remote/renew/fetch"
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
    authClient: AuthClient
): RenewAction {
    const infra = {
        authCredentials,
        renew: initFetchRenewClient(authClient),
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
    authClient: AuthClient
): SetContinuousRenewAction {
    const client = initFetchRenewClient(authClient)

    return {
        setContinuousRenew: setContinuousRenew({
            authCredentials,
            renew: client,
            config: config.setContinuousRenew,
            clock: initDateClock(),
        }),
    }
}
