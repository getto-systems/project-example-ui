import { initNextVersionResource } from "../../../../z_EntryPoint/MoveToNextVersion/impl/nextVersion"

import { initNextVersionComponent } from "../impl"

import { initTestNextVersionAction } from "../../../../nextVersion/tests/nextVersion"

import { CheckDeployExistsRemotePod, NextVersionActionConfig } from "../../../../nextVersion/infra"

import { NextVersionResource } from "../../../../z_EntryPoint/MoveToNextVersion/entryPoint"
import { initFindLocationDetecter } from "../../../../nextVersion/testHelper"

export type NextVersionRemoteAccess = Readonly<{
    check: CheckDeployExistsRemotePod
}>

export function newTestNextVersionResource(
    version: string,
    currentURL: URL,
    config: NextVersionActionConfig,
    remote: NextVersionRemoteAccess
): NextVersionResource {
    const factory = {
        actions: {
            nextVersion: initTestNextVersionAction(version, config, remote.check),
        },
        components: {
            nextVersion: initNextVersionComponent,
        },
    }
    const locationInfo = {
        nextVersion: initFindLocationDetecter(currentURL, version),
    }
    return initNextVersionResource(factory, locationInfo)
}
