import { find } from "../impl/core"

import { CheckDeployExistsRemotePod, NextVersionActionConfig } from "../infra"

import { NextVersionAction } from "../action"

export function initTestNextVersionAction(
    config: NextVersionActionConfig,
    remote: CheckDeployExistsRemotePod,
): NextVersionAction {
    return {
        find: find({
            config: config.find,
            check: remote,
        }),
    }
}
