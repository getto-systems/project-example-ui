import { find } from "../impl/core"

import { CheckRemoteAccess, NextVersionActionConfig } from "../infra"

import { NextVersionAction } from "../action"

export function initTestNextVersionAction(
    config: NextVersionActionConfig,
    remote: CheckRemoteAccess,
): NextVersionAction {
    return {
        find: find({
            config: config.find,
            check: remote,
        }),
    }
}
