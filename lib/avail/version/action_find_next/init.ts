import { newFindNextVersionInfra, newFindNextVersionLocationDetecter } from "../find_next/impl/init"

import { initFindNextVersionView } from "./impl"
import { initFindNextVersionCoreAction, initFindNextVersionCoreMaterial } from "./core/impl"

import { FindNextVersionView } from "./resource"

type OutsideFeature = Readonly<{
    currentLocation: Location
}>
export function newFindNextVersionView(feature: OutsideFeature): FindNextVersionView {
    const { currentLocation } = feature
    return initFindNextVersionView({
        findNext: initFindNextVersionCoreAction(
            initFindNextVersionCoreMaterial(
                newFindNextVersionInfra(),
                newFindNextVersionLocationDetecter(currentLocation),
            ),
        ),
    })
}
