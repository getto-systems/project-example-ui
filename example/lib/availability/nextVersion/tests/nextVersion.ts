import { find } from "../impl/core"

import { CheckDeployExistsRemotePod, NextVersionActionConfig } from "../infra"

import { NextVersionAction } from "../action"

export function initTestNextVersionAction(
    version: string,
    config: NextVersionActionConfig,
    remote: CheckDeployExistsRemotePod,
): NextVersionAction {
    return {
        find: find({
            version,
            config: config.find,
            check: remote,
        }),
    }
}
