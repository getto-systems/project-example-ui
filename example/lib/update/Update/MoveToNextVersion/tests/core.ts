import {
    initSimulateCheckClient,
    CheckSimulator,
} from "../../../nextVersion/impl/client/check/simulate"

import { find } from "../../../nextVersion/impl/core"

import { NextVersionAction } from "../../../nextVersion/action"

export function initNextVersionAction(simulator: CheckSimulator): NextVersionAction {
    return {
        find: find({
            client: initSimulateCheckClient(simulator),
        }),
    }
}
