import { detectAppTarget } from "../../../../nextVersion/impl/location"
import { initNextVersionResource } from "../../EntryPoint/impl/nextVersion"

import { initNextVersionComponent } from "../impl"

import { initTestNextVersionAction } from "../../../../nextVersion/tests/nextVersion"

import { CheckRemoteAccess, NextVersionActionConfig } from "../../../../nextVersion/infra"

import { NextVersionResource } from "../../EntryPoint/entryPoint"

export type NextVersionRemoteAccess = Readonly<{
    check: CheckRemoteAccess
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
