import { newNextVersionAction } from "../../../nextVersion/main/nextVersion"

import { initNextVersionResource } from "../impl/nextVersion"

import { initNextVersionComponent } from "../../../x_Resource/MoveToNextVersion/nextVersion/impl"

import { MoveToNextVersionEntryPoint } from "../entryPoint"
import { newFindLocationDetecter } from "../../../nextVersion/init"

type OutsideFeature = Readonly<{
    currentLocation: Location
}>
export function newForeground(feature: OutsideFeature): MoveToNextVersionEntryPoint {
    const { currentLocation } = feature
    const factory = {
        actions: {
            nextVersion: newNextVersionAction(),
        },
        components: {
            nextVersion: initNextVersionComponent,
        },
    }
    const locationInfo = {
        nextVersion: newFindLocationDetecter(currentLocation),
    }
    const resource = initNextVersionResource(factory, locationInfo)
    return {
        resource,
        terminate: () => {
            resource.nextVersion.terminate()
        },
    }
}
