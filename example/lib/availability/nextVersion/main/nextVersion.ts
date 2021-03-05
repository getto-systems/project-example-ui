import { env } from "../../../y_environment/env"

import { newCheckDeployExistsRemote } from "../impl/remote/checkDeployExists"

import { find } from "../impl/core"

import { NextVersionAction } from "../action"

export function newNextVersionAction(): NextVersionAction {
    return {
        find: find({
            version: env.version,
            config: {
                delay: { delay_millisecond: 300 },
            },
            check: newCheckDeployExistsRemote(),
        }),
    }
}
