import { env } from "../../../../y_environment/env"

import { initNextVersionAction } from "../../../nextVersion/main/nextVersion"

import { detectAppTarget } from "../../../nextVersion/impl/location"
import { initNextVersionResource } from "../impl/nextVersion"

import { initNextVersionComponent } from "../../../x_Resource/MoveToNextVersion/nextVersion/impl"

import { MoveToNextVersionEntryPoint } from "../entryPoint"

type OutsideFeature = Readonly<{
    currentURL: URL
}>
export function newForeground(feature: OutsideFeature): MoveToNextVersionEntryPoint {
    const { currentURL } = feature
    const factory = {
        actions: {
            nextVersion: initNextVersionAction(),
        },
        components: {
            nextVersion: initNextVersionComponent,
        },
    }
    const locationInfo = {
        nextVersion: {
            getAppTarget: () => detectAppTarget(env.version, currentURL),
        },
    }
    const resource = initNextVersionResource(factory, locationInfo)
    return {
        resource,
        terminate: () => {
            resource.nextVersion.terminate()
        },
    }
}
