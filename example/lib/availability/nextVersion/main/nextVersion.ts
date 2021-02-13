import { initApiAvailableCheck } from "../../../z_external/api/availability/check"

import { delayed } from "../../../z_infra/delayed/core"
import { initCheckConnectRemoteAccess } from "../impl/remote/check/connect"

import { find } from "../impl/core"

import { NextVersionAction } from "../action"

export function initNextVersionAction(): NextVersionAction {
    return {
        find: find({
            config: {
                delay: { delay_millisecond: 300 },
            },
            check: initCheckConnectRemoteAccess(initApiAvailableCheck()),
            delayed,
        }),
    }
}
