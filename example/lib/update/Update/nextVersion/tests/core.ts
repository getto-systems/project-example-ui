import { detectAppTarget } from "../../MoveToNextVersion/impl/location"
import { initNextVersionResource } from "../../MoveToNextVersion/impl/core"

import { initNextVersionComponent } from "../impl"

import { CheckSimulator } from "../../../nextVersion/impl/remote/check/simulate"

import { initNextVersionAction } from "../../MoveToNextVersion/tests/core"

import { NextVersionResource } from "../../MoveToNextVersion/entryPoint"
import { NextVersionActionConfig } from "../../../nextVersion/infra"

export type NextVersionSimulator = Readonly<{
    check: CheckSimulator
}>

export function newNextVersionResource(
    version: string,
    currentURL: URL,
    config: NextVersionActionConfig,
    simulator: NextVersionSimulator
): NextVersionResource {
    const factory = {
        actions: {
            nextVersion: initNextVersionAction(config, simulator),
        },
        components: {
            nextVersion: initNextVersionComponent,
        },
    }
    const collector = {
        nextVersion: {
            getAppTarget: () => detectAppTarget(version, currentURL),
        },
    }
    return initNextVersionResource(factory, collector)
}
