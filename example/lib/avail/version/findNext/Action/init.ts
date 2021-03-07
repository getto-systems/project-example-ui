import { newFindNextVersionInfra, newFindNextVersionLocationDetecter } from "../impl/init"

import { initFindNextVersionEntryPoint } from "./impl"
import { initFindNextVersionCoreAction, initFindNextVersionCoreMaterial } from "./Core/impl"

import { FindNextVersionEntryPoint } from "./entryPoint"

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
