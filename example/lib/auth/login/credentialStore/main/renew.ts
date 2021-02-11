import { env } from "../../../../y_environment/env"

import { initApiAuthRenew } from "../../../../z_external/api/auth/renew"

import { delayMinute, delaySecond, expireMinute, intervalMinute } from "../../../../z_infra/time/infra"
import { initDateClock } from "../../../../z_infra/clock/date"
import { delayed } from "../../../../z_infra/delayed/core"
import { initRenewConnectRemoteAccess } from "../impl/remote/renew/connect"

import { initAuthCredentialRepository } from "../impl/repository/authCredential"

import { forceRenew, renew, setContinuousRenew } from "../impl/core"

import { RenewInfra, SetContinuousRenewInfra } from "../infra"

import { RenewAction, SetContinuousRenewAction } from "../action"
import { initAuthCredentialStorage } from "./common"

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
