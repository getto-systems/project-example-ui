import { env } from "../../../../../../y_environment/env"

import { initApiAuthRenew } from "../../../../../../z_external/api/auth/renew"

import {
    delayMinute,
    delaySecond,
    expireMinute,
    intervalMinute,
} from "../../../../../../z_infra/time/infra"
import { initDateClock } from "../../../../../../z_infra/clock/date"
import { delayed } from "../../../../../../z_infra/delayed/core"
import { initWebTypedStorage } from "../../../../../../z_infra/storage/webStorage"
import { initRenewConnectRemoteAccess } from "../../../../../login/renew/impl/remote/renew/connect"

import {
    AuthCredentialStorage,
    initAuthCredentialRepository,
} from "../../../../../login/renew/impl/repository/authCredential"
import {
    initLastAuthAtConverter,
    initTicketNonceConverter,
} from "../../../../../login/renew/impl/repository/converter"

import { initApiCredentialConverter } from "../../../../../common/credential/impl/repository/converter"
import { forceRenew, renew, setContinuousRenew } from "../../../../../login/renew/impl/core"

import { RenewInfra, SetContinuousRenewInfra } from "../../../../../login/renew/infra"

import { RenewAction, SetContinuousRenewAction } from "../../../../../login/renew/action"

export function initRenewAction(credentialStorage: Storage): RenewAction {
    return {
        renew: renew(renewInfra()),
        forceRenew: forceRenew(renewInfra()),
    }

    function renewInfra(): RenewInfra {
        return {
            authCredentials: initAuthCredentialRepository(initAuthCredentialStorage(credentialStorage)),
            renew: initRenewConnectRemoteAccess(initApiAuthRenew(env.apiServerURL)),
            config: {
                instantLoadExpire: expireMinute(3),
                delay: delaySecond(0.5),
            },
            delayed,
            clock: initDateClock(),
        }
    }
}
export function initSetContinuousRenewAction(credentialStorage: Storage): SetContinuousRenewAction {
    return {
        setContinuousRenew: setContinuousRenew(setContinuousRenewInfra()),
    }

    function setContinuousRenewInfra(): SetContinuousRenewInfra {
        return {
            authCredentials: initAuthCredentialRepository(initAuthCredentialStorage(credentialStorage)),
            renew: initRenewConnectRemoteAccess(initApiAuthRenew(env.apiServerURL)),
            config: {
                delay: delayMinute(1),
                interval: intervalMinute(2),
            },
            clock: initDateClock(),
        }
    }
}

function initAuthCredentialStorage(credentialStorage: Storage): AuthCredentialStorage {
    return {
        ticketNonce: initWebTypedStorage(
            credentialStorage,
            env.storageKey.ticketNonce,
            initTicketNonceConverter()
        ),
        apiCredential: initWebTypedStorage(
            credentialStorage,
            env.storageKey.apiCredential,
            initApiCredentialConverter()
        ),
        lastAuthAt: initWebTypedStorage(
            credentialStorage,
            env.storageKey.lastAuthAt,
            initLastAuthAtConverter()
        ),
    }
}
