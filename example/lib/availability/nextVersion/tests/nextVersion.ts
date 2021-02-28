import { find } from "../impl/core"

import { CheckDeployExistsRemote, NextVersionActionConfig } from "../infra"

import { NextVersionAction } from "../action"

export function initTestNextVersionAction(
    config: NextVersionActionConfig,
    remote: CheckDeployExistsRemote,
): NextVersionAction {
    return {
        find: find({
            config: config.find,
            check: remote,
        }),
    }
}
