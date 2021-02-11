import { Clock } from "../../../../z_infra/clock/infra"
import { delayed } from "../../../../z_infra/delayed/core"
import {
    AuthCredentialRepository,
    RenewActionConfig,
    RenewRemoteAccess,
    SetContinuousRenewActionConfig,
} from "../infra"

import { forceRenew, renew, setContinuousRenew } from "../impl/core"

import { RenewAction, SetContinuousRenewAction } from "../action"

export function initTestRenewAction(
    config: RenewActionConfig,
    authCredentials: AuthCredentialRepository,
    remote: RenewRemoteAccess,
    clock: Clock
): RenewAction {
    const infra = {
        authCredentials,
        renew: remote,
        config: config.renew,
        delayed,
        clock,
    }

    return {
        renew: renew(infra),
        forceRenew: forceRenew(infra),
    }
}
export function initTestSetContinuousRenewAction(
    config: SetContinuousRenewActionConfig,
    authCredentials: AuthCredentialRepository,
    remote: RenewRemoteAccess,
    clock: Clock
): SetContinuousRenewAction {
    return {
        setContinuousRenew: setContinuousRenew({
            authCredentials,
            renew: remote,
            config: config.setContinuousRenew,
            clock,
        }),
    }
}
