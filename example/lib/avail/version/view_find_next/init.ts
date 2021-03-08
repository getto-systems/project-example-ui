import { newFindNextVersionInfra, newFindNextVersionLocationDetecter } from "../find_next/impl/init"

import { initFindNextVersionEntryPoint } from "./impl"
import { initFindNextVersionCoreAction, initFindNextVersionCoreMaterial } from "./core/impl"

import { FindNextVersionEntryPoint } from "./entry_point"

type OutsideFeature = Readonly<{
    currentLocation: Location
}>
export function newFindNextVersionEntryPoint(feature: OutsideFeature): FindNextVersionEntryPoint {
    const { currentLocation } = feature
    return initFindNextVersionEntryPoint({
        findNext: initFindNextVersionCoreAction(
            initFindNextVersionCoreMaterial(
                newFindNextVersionInfra(),
                newFindNextVersionLocationDetecter(currentLocation),
            ),
        ),
    })
}
