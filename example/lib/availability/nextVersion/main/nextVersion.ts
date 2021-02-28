import { newCheckDeployExistsRemote } from "../impl/remote/checkDeployExists"

import { find } from "../impl/core"

import { NextVersionAction } from "../action"

export function initNextVersionAction(): NextVersionAction {
    return {
        find: find({
            config: {
                delay: { delay_millisecond: 300 },
            },
            check: newCheckDeployExistsRemote(),
        }),
    }
}
