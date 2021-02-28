import { detectAppTarget } from "../../../../nextVersion/impl/location"
import { initNextVersionResource } from "../../../../z_EntryPoint/MoveToNextVersion/impl/nextVersion"

import { initNextVersionComponent } from "../impl"

import { initTestNextVersionAction } from "../../../../nextVersion/tests/nextVersion"

import { CheckDeployExistsRemote, NextVersionActionConfig } from "../../../../nextVersion/infra"

import { NextVersionResource } from "../../../../z_EntryPoint/MoveToNextVersion/entryPoint"

export type NextVersionRemoteAccess = Readonly<{
    check: CheckDeployExistsRemote
}>

export function newTestNextVersionResource(
    version: string,
    currentURL: URL,
    config: NextVersionActionConfig,
    remote: NextVersionRemoteAccess
): NextVersionResource {
    const factory = {
        actions: {
            nextVersion: initTestNextVersionAction(config, remote.check),
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
