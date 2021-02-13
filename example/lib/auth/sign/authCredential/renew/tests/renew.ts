import { Clock } from "../../../../../z_infra/clock/infra"
import { delayed } from "../../../../../z_infra/delayed/core"
import {
    AuthCredentialRepository,
    RenewConfig,
    RenewRemoteAccess,
    SetContinuousRenewConfig,
} from "../infra"

import { forceRenew, renew, setContinuousRenew } from "../impl"

import { RenewAction, SetContinuousRenewAction } from "../action"
import { ApiCredentialRepository } from "../../../../../common/auth/apiCredential/infra"

export function initTestRenewAction(
    config: RenewConfig,
    apiCredentials: ApiCredentialRepository,
    authCredentials: AuthCredentialRepository,
    remote: RenewRemoteAccess,
    clock: Clock
): RenewAction {
    const infra = {
        apiCredentials,
        authCredentials,
        renew: remote,
        config,
        delayed,
        clock,
    }

    return {
        renew: renew(infra),
        forceRenew: forceRenew(infra),
    }
}
export function initTestSetContinuousRenewAction(
    config: SetContinuousRenewConfig,
    apiCredentials: ApiCredentialRepository,
    authCredentials: AuthCredentialRepository,
    remote: RenewRemoteAccess,
    clock: Clock
): SetContinuousRenewAction {
    return {
        setContinuousRenew: setContinuousRenew({
            apiCredentials,
            authCredentials,
            renew: remote,
            config,
            clock,
        }),
    }
}
