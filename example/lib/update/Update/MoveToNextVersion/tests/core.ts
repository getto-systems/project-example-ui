import { delayed } from "../../../../z_infra/delayed/core"

import { initSimulateCheckClient, CheckSimulator } from "../../../nextVersion/impl/client/check/simulate"

import { find } from "../../../nextVersion/impl/core"

import { NextVersionActionConfig } from "../../../nextVersion/infra"

import { NextVersionAction } from "../../../nextVersion/action"

export type NextVersionSimulator = Readonly<{
    check: CheckSimulator
}>
export function initNextVersionAction(
    config: NextVersionActionConfig,
    simulator: NextVersionSimulator
): NextVersionAction {
    return {
        find: find({
            config: config.find,
            check: initSimulateCheckClient(simulator.check),
            delayed,
        }),
    }
}
