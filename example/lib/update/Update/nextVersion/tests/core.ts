import { detectAppTarget } from "../../MoveToNextVersion/impl/location"
import { initNextVersionResource } from "../../MoveToNextVersion/impl/core"

import { initNextVersion } from "../impl"

import { CheckSimulator } from "../../../nextVersion/impl/client/check/simulate"

import { initNextVersionAction } from "../../MoveToNextVersion/tests/core"

import { NextVersionResource } from "../../MoveToNextVersion/view"

export type NextVersionSimulator = Readonly<{
    check: CheckSimulator
}>

export function newNextVersionResource(
    version: string,
    currentURL: URL,
    simulator: NextVersionSimulator
): NextVersionResource {
    const factory = {
        actions: {
            nextVersion: initNextVersionAction(simulator.check),
        },
        components: {
            nextVersion: initNextVersion,
        },
    }
    const collector = {
        nextVersion: {
            getAppTarget: () => detectAppTarget(version, currentURL),
        },
    }
    return initNextVersionResource(factory, collector)
}
