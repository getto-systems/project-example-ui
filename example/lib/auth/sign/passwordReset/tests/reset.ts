import { delayed } from "../../../../z_infra/delayed/core"

import { reset } from "../impl/core"

import { PasswordResetActionConfig, ResetRemoteAccess } from "../infra"

import { ResetAction } from "../action"

export function initTestPasswordResetAction(
    config: PasswordResetActionConfig,
    remote: ResetRemoteAccess
): ResetAction {
    return {
        reset: reset({
            reset: remote,
            config: config.reset,
            delayed,
        }),
    }
}
