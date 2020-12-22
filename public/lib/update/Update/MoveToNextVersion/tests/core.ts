import {
    initSimulateCheckClient,
    CheckSimulator,
} from "../../../next_version/impl/client/check/simulate"

import { find } from "../../../next_version/impl/core"

import { NextVersionAction } from "../../../next_version/action"

export function initNextVersionAction(simulator: CheckSimulator): NextVersionAction {
    return {
        find: find({
            client: initSimulateCheckClient(simulator),
        }),
    }
}
