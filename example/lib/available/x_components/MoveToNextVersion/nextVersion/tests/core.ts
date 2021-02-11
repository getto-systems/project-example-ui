import { detectAppTarget } from "../../EntryPoint/impl/location"
import { initNextVersionResource } from "../../EntryPoint/impl/core"

import { initNextVersionComponent } from "../impl"

import { initNextVersionAction } from "../../EntryPoint/tests/core"

import { CheckRemoteAccess, NextVersionActionConfig } from "../../../../nextVersion/infra"

import { NextVersionResource } from "../../EntryPoint/entryPoint"

export type NextVersionRemoteAccess = Readonly<{
    check: CheckRemoteAccess
}>

export function newTestNextVersionResource(
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
