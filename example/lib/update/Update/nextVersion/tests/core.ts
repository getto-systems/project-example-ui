import { detectAppTarget } from "../../MoveToNextVersion/impl/location"
import { initNextVersionResource } from "../../MoveToNextVersion/impl/core"

import { initNextVersionComponent } from "../impl"

import { initNextVersionAction } from "../../MoveToNextVersion/tests/core"

import { CheckRemoteAccess, NextVersionActionConfig } from "../../../nextVersion/infra"

import { NextVersionResource } from "../../MoveToNextVersion/entryPoint"

export type NextVersionRemoteAccess = Readonly<{
    check: CheckRemoteAccess
}>

export function newNextVersionResource(
    version: string,
    currentURL: URL,
    config: NextVersionActionConfig,
    simulator: NextVersionRemoteAccess
): NextVersionResource {
    const factory = {
        actions: {
            nextVersion: initNextVersionAction(config, simulator),
        },
        components: {
            nextVersion: initNextVersionComponent,
        },
    }
    const locationInfo = {
        nextVersion: {
            getAppTarget: () => detectAppTarget(version, currentURL),
        },
    }
    return initNextVersionResource(factory, locationInfo)
}
